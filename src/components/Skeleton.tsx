import { CSSProperties } from 'react';

export default function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div 
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl ${className}`} 
      style={style}
    />
  );
}
