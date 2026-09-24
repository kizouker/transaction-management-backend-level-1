-- - Entiteter : Konto/Account  && Transactions


    --"We use string for the primary key because account and transaction data can originate from multiple source systems with differing ID formats, and a string type avoids collisions 
    --and future type migrations when merging them."

## What we considered when writing the SQL tables

- **Column order matches attribute meaning** — primary key first, then required fields, then optional ones
- **Every column needs a comma** except the last one in the `CREATE TABLE` list — SQLite (and SQL generally) parses the columns as one comma-separated list; a missing comma merges two column definitions into one and throws a syntax error
- **`PRIMARY KEY` already implies `NOT NULL`** — no need to write both on the `id` column
- **`NOT NULL` matches the OpenAPI `required` list** — every field marked required in the spec gets `NOT NULL` in SQL; fields left out of `required` (like `description`) stay nullable
- **`NUMERIC`, not `FLOAT`/`DOUBLE`, for money** — floating-point types introduce rounding errors that are unacceptable for financial amounts
- **`VARCHAR` with a length** (e.g. `VARCHAR(36)`, `VARCHAR(3)`) where the format is fixed or bounded (UUID length, ISO currency codes) — gives the database a sanity check for free
- **Foreign keys use `REFERENCES`** — `from_account_id` and `to_account_id` both reference `bank_account(id)`, so the database rejects a transaction pointing at an account that doesn't exist
- **Table creation order matters** — `bank_account` must be created before `transaction`, since `transaction` references it
- **Two foreign keys to the same table is fine** — `transaction` has both `from_account_id` and `to_account_id` pointing at `bank_account`, reflecting that a transaction moves money between two accounts
-- Don't forget ',' between columns in the table definition.
