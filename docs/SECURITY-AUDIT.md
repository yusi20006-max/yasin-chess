# Security & dependency audit

The release gate checks for unsafe HTML sinks (`dangerouslySetInnerHTML` / `innerHTML`), dynamic code execution, and high-severity production dependency vulnerabilities using `npm audit --omit=dev --audit-level=high`.

Import boundaries are JSON/schema validated before restore. PGN/FEN processing remains parser-driven rather than HTML rendering.
