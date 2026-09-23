import json
import os
from enum import Enum
from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import create_model

app = FastAPI(
    title="Dynamiskt Genererat Bank API",
    description="Detta API genereras live utifrån projektets OpenAI JSON-specifikation."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. LÄS IN SPECIFIKATIONEN LIVE FRÅN DIN JSON-FIL (Säker sökväg)
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
schema_path = os.path.join(base_dir, "openai-bank-schema.json")

try:
    with open(schema_path, "r", encoding="utf-8") as f:
        openai_spec = json.load(f)
except Exception as e:
    raise RuntimeError(f"Kunde inte ladda JSON-specifikationen på {schema_path}. Fel: {e}")

# Extrahera från OpenAI-strukturen (strikta sökvägar)
properties = openai_spec["function"]["parameters"]["properties"]
required_fields = openai_spec["function"]["parameters"]["required"]

# 2. GENERERA EN PYDANTIC-MODELL LIVE I MINNET
type_mapping = {
    "string": str,
    "number": float,
    "integer": int,
    "boolean": bool
}

model_fields = {}
for param_name, param_info in properties.items():
    json_type = param_info.get("type", "string")
    
    # Om parametern har en enum-lista, bygger vi en dynamisk Python Enum
    if "enum" in param_info:
        LiveEnum = Enum(f"Live{param_name.capitalize()}", {v: v for v in param_info["enum"]})
        python_type = LiveEnum
    else:
        python_type = type_mapping.get(json_type, Any)
        
    # Använd modern Python-syntax (Typ | None) för valfria fält istället för Optional
    if param_name in required_fields:
        model_fields[param_name] = (python_type, ...)
    else:
        model_fields[param_name] = (python_type | None, None)

# Skapa Pydantic-modellen live!
DynamicBankRequest = create_model(
    "DynamicBankRequest",
    **model_fields
)

# 3. EN ENDA DYNAMISK ENDPOINT
@app.post("/api/bank/execute")
async def execute_bank_action(request: DynamicBankRequest):
    """
    Tar emot data och validerar den LIVE mot de parametrar 
    som definierats i din openai-bank-schema.json.
    """
    data = request.model_dump()
    
    # Extrahera enum-strängvärdet om fältet är en Enum-klass i Python
    processed_data = {}
    for k, v in data.items():
        processed_data[k] = v.value if isinstance(v, Enum) else v

    return {
        "message": "Anrop validerat live mot JSON-specifikationen!",
        "received_action": processed_data.get("action"),
        "account_id": processed_data.get("account_id"),
        "echo_data": processed_data
    }
