# Daisy the Guardian schema provenance

No checked-in SQL migrations or generated database-schema snapshot were found. The `supabase/` directory currently contains local CLI metadata rather than versioned schema source.

[Client integration source](<../../src/utils>) and [UI queries](<../../src/components>) show application usage, not the complete hosted schema. Schema, RLS and migration provenance remain unverified. No regeneration command is documented; an approved export process and exact target are needed before adding a generated snapshot.

Never include database data, connection strings or secret values in generated documentation.
