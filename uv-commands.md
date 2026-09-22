uv venvv

uv pip install fastapi "uvicorn[standard]"

uv init
uv add fastapi "uvicorn[standard]"
uv run uvicorn app.main:app --reload

uv pip install -r requirements.txt


#1. Byt ut requirements.txt mot pyproject.toml:
cd ~/Alvalabs/transactions-dryrun-1
uv init --no-readme --no-workspace .
uv add fastapi "uvicorn[standard]"
rm requirements.txt

"scripts": {
  "build": "uv sync",
  "start": "uv run uvicorn app.main:app --host 0.0.0.0 --port 8080"
}

Obs: om du gör det här på riktiga testet, dubbelkolla att Alvas GitHub Actions-runner har uv installerat (annars måste build-scriptet först installera uv själv, t.ex. curl -LsSf https://astral.sh/uv/install.sh | sh && uv sync).