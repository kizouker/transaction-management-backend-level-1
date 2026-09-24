-- DIN UPPGIFT: skriv tabellerna här.
--
-- Datan som ska finnas:
--   transaktion: id, konto-id, belopp, tidpunkt
--   konto:       id, saldo
--
-- Frågor att ta ställning till (jag frågar efteråt):
--   1. Behövs en kontotabell alls, eller räcker transaktionstabellen?
--   2. Vilken typ för ett uuid i SQLite? Varför?
--   3. Belopp är heltal i specen. Varför heltal och inte decimaltal för pengar?
--   4. Hur lagrar du tidpunkten så att sortering fungerar?
--   5. Behövs index? På vad?
--
-- Skriv CREATE TABLE-satserna nedanför den här raden.
-- ### Open API
-- Vad innehåller api:et och hur är det kopplat till REST, HTTP
-- - HTTP POST skapa ett konto // post // svar: 201 == OK
-- - svar :400 Ogiltig data
-- - svar : 404 Inget källkonto
-- - HTTP GET överföra mellan två konton
-- - 
-- - HTTP GET Lista transaktioner response: 200
-- - 
-- - HTTP GET hämtar en specifik transaktion, med ett ID, med format uuid
-- - svar: 200 OK
-- - svar: 404 finns inte


--- sqlite3 mydatabase.db < ./sql/schema.sql


DROP TABLE IF EXISTS money_transfer;
DROP TABLE IF EXISTS bank_account;

create table bank_account (
    id VARCHAR(36) PRIMARY KEY,
    owner_name VARCHAR(255) NOT NULL,
    balance NUMERIC NOT NULL,
    currency VARCHAR(3) NOT NULL
);


-- VARCHAR(36) because a UUID as text is always exactly 36 characters
-- (32 hex characters + 4 hyphens, e.g. 550e8400-e29b-41d4-a716-446655440000)
-- transaction is a reserved word in SQL, so we use money_transfer instead

create table money_transfer (
    id VARCHAR(36) PRIMARY KEY,
    from_account_id VARCHAR(36) NOT NULL REFERENCES bank_account(id),
    to_account_id VARCHAR(36) NOT NULL REFERENCES bank_account(id),
    amount NUMERIC NOT NULL,
    currency VARCHAR(3) NOT NULL
);

CREATE INDEX idx_transfer_from_account ON money_transfer(from_account_id);
CREATE INDEX idx_transfer_to_account ON money_transfer(to_account_id);