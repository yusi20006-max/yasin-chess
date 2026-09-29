# Phase 2.6 — Local Data Schema & Migration

The current storage layer already tracks a versioned persistence contract through \`CURRENT_SCHEMA_VERSION\`, migrates legacy snapshots forward, rejects unsupported future versions, and supplies safe defaults for newly introduced fields.

This issue is closed by reconciliation rather than duplicating the existing runtime storage implementation.

Covered contract:
- schema version tracking
- forward migration
- legacy defaults
- invalid version rejection
- future-version rejection
- compatibility with active-game recovery
