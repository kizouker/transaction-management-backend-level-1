INSERT INTO bank_account (id, owner_name, balance, currency)
VALUES ('acc-1', 'Test', 1000, 'SEK');

-- generera 100 000 transfers som alla pekar på samma konto
WITH RECURSIVE seq(x) AS (
  SELECT 1
  UNION ALL
  SELECT x+1 FROM seq WHERE x < 100000
)
INSERT INTO money_transfer (id, from_account_id, to_account_id, amount, currency)
SELECT 'transfer-' || x, 'acc-1', 'acc-1', 1, 'SEK' FROM seq;