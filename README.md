## Development plan

### Requirements
- ```openanAPI``` i ```json``` 

<!-- ### GitHub + repo — skapa repot, git init lokalt -->

### Github Actions?
- kör cI tester V
- ger fel just nu men kommer nog fungera när jag får upp api:et

### Python-projekt — venv, requirements.txt (fastapi, uvicorn, sqlalchemy, pytest, httpx)
```uv pip install fastapi uvicorn```

### SQL/DB — schema för en transactions-tabell
- skapa create table för definitioner
 rm -f mydatabase.db
 sqlite3 mydatabase.db < ./sql/schema.sql

### Skuggdata — seed-script som fyller tabellen med testdata
- seed script
- 

### FastAPI — POST-endpoint som tar emot data via curl och lagrar i DB

```uvicorn app.main:app --reload --port 8080```

### E2E-test — POST:ar in data, verifierar via DB-fråga eller GET-endpoint
- jag har tagit tester från ert repo
- jag ska sätta upp så att github kör dessa varje gång jag checkar in

1.vad är cypress? 
2.hur installerar man?
3.vad kan jag testa med det?

``` npm install cypress --save-dev```

```npx cypress run --record --config-file test/cypress.config.js```
```   npx cypress open --config-file test/cypress.config.js ```
```npx cypress run --config-file test/cypress.config.js```
 git push origin pre-test-transactions # skapar branchen remote
 gh repo edit KIZOUKER/transaction-management-backend-level-1 --default-branch pre-test-transactions 

### Databaslager
## SQLlite
 `sqlite3 --version`

 ## Schema.sql
 - Skapa tabellerna
 - bestäm vilka fält kolumner
 - bestäm datatyper etc
```sqlite3 mydatabase.db < ./sql/schema.sql ```
``` sqlite3 alvalabs-kodtest.db ".tables"    ```
``` sqlite3 alvalabs-kodtest.db ".schema"    ```



## Seed.sql
- fyll tabellerna med data

## Ta bort tabellerna

## Queries
- mål kunna förklara och argumentera för val av design

### Open API
Vad innehåller api:et och hur är det kopplat till REST, HTTP

- HTTP POST skapa ett konto // post // svar: 201 == OK
- svar :400 Ogiltig data
- svar : 404 Inget källkonto
  
- HTTP GET överföra mellan två konton
- 
- HTTP GET Lista transaktioner response: 200
- 
- HTTP GET hämtar en specifik transaktion, med ett ID, med format uuid
- svar: 200 OK
- svar: 404 finns inte
  

- Account V
- type object
- id : string
- ownerName : String
- balance : number/double 
- currency : string 

- NewTransaction V
- type object
- Entiteter : Konto/Account  && Transactions V

## python
### db manager
    * hur hittar vi db.filen
    * skapa connection
    * stäng connection
    * context manager
    * row factory
    * class or not class
### routers
### 