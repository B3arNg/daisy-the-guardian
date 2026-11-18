import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isRateLimited } from '../../../../lib/rate-limit';
import { RATE_LIMITED_MESSAGE, SIGN_IN_FAILED_MESSAGE, signInOnServer } from '../../../../lib/server-sign-in';

// Username sign-in. The email behind a username stays on the server; the browser gets session
// tokens only for the right password and hands them to supabase.auth.setSession.
// Needs SUPABASE_SERVICE_ROLE_KEY (server-only, never NEXT_PUBLIC_) to read public.profiles.
// Email sign-in stays in the browser.

const clientOptions = { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } };

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey || !serviceRoleKey) return null;
  return { url, anonKey, serviceRoleKey };
}

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const config = env();
  if (!config) {
    console.error('[sign-in] Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY.');
    return json({ error: SIGN_IN_FAILED_MESSAGE }, 500);
  }

  const input = await request.json().catch(() => null);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const username = typeof input?.username === 'string' ? input.username.trim().toLowerCase() : '';
  if (isRateLimited(`ip:${ip}`, 30) || (username && isRateLimited(`user:${username}`, 10))) {
    return json({ error: RATE_LIMITED_MESSAGE }, 429);
  }

  const admin = createClient(config.url, config.serviceRoleKey, clientOptions);

  const result = await signInOnServer(input, {
    findEmailByUsername: async name => {
      const { data: profile, error } = await admin.from('profiles').select('user_id').eq('username', name).maybeSingle();
      if (error) {
        console.error('[sign-in] profile lookup failed:', error.code, error.message);
        throw error;
      }
      if (!profile) return null;
      const { data, error: userError } = await admin.auth.admin.getUserById(profile.user_id);
      if (userError) {
        console.error('[sign-in] user lookup failed:', userError.code, userError.message);
        throw userError;
      }
      return data.user?.email?.toLowerCase() ?? null;
    },
    signInWithPassword: async (email, password) => {
      try {
        const { data, error } = await createClient(config.url, config.anonKey, clientOptions).auth.signInWithPassword({ email, password });
        if (error) return { session: null, error: { code: error.code, status: error.status } };
        return { session: data.session, error: null };
      } catch (error) {
        console.error('[sign-in] Supabase Auth call failed:', error instanceof Error ? error.message : error);
        return { session: null, error: { code: 'unexpected_failure' } };
      }
    },
  });

  return json(result.body, result.status);
}
