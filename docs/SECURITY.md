# Daisy the Guardian security references

The project instructions require private application credentials and prohibit browser exposure of secret keys. Hosted row isolation was not tested in this documentation task.

## Existing evidence and boundaries

- [src/components/Auth.tsx](<../src/components/Auth.tsx>)
- [src/utils](<../src/utils>)

Follow [project instructions](../AGENTS.md) for credentials, environment selection and authorization. Keep secrets in private project configuration, never in documentation or generated artifacts. No security audit, credential test, hosted access check or remediation was performed by this layout update.
