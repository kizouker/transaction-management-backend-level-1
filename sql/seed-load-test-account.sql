INSERT INTO bank_account (id, owner_name, balance, currency)
VALUES ('acc-1', 'Test', 1000, 'SEK');

WITH RECURSIVE seq(x) AS (
  SELECT 1
  UNION ALL
  SELECT x+1 FROM seq WHERE x < 100000
)
INSERT INTO money_transfer (id, from_account_id, to_account_id, amount, currency)
SELECT 'transfer-' || x, 'acc-1', 'acc-1', 1, 'SEK' FROM seq;

.echo on
.timer on

-- from_account_id, utan index
DROP INDEX IF EXISTS idx_transfer_from_account;
SELECT COUNT(*) FROM money_transfer WHERE from_account_id = 'acc-1';

-- from_account_id, med index
CREATE INDEX idx_transfer_from_account ON money_transfer(from_account_id);
SELECT COUNT(*) FROM money_transfer WHERE from_account_id = 'acc-1';

-- to_account_id, utan index
DROP INDEX IF EXISTS idx_transfer_to_account;
SELECT COUNT(*) FROM money_transfer WHERE to_account_id = 'acc-1';

-- to_account_id, med index
CREATE INDEX idx_transfer_to_account ON money_transfer(to_account_id);
SELECT COUNT(*) FROM money_transfer WHERE to_account_id = 'acc-1';