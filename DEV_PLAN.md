## Development pln


### spec
- openapi i json . påhittat av claude

### GitHub + repo — skapa repot, git init lokalt

### Github Actions?
- kör cI tester

### Python-projekt — venv, requirements.txt (fastapi, uvicorn, sqlalchemy, pytest, httpx)


### SQL/DB — schema för en transactions-tabell
- skapa create table för definitioner


### Skuggdata — seed-script som fyller tabellen med testdata
- seed script
- 

### FastAPI — POST-endpoint som tar emot data via curl och lagrar i DB

### E2E-test — POST:ar in data, verifierar via DB-fråga eller GET-endpoint
- jag har tagit tester från ert repo
- jag ska sätta upp så att github kör dessa varje gång jag checkar in

1.vad är cypress?
2.hur installerar man?
3.vad kan jag testa med det?

 npm install cypress --save-dev


 git push origin pre-test-transactions # skapar branchen remote