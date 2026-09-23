import React, { useState } from 'react';
import openAiSchema from '../../../openai-bank-schema.json';

// Vi håller de mänskliga förklaringarna och exemplen här i React istället för i JSON-filen
const humanInterpretations = {
  action: { title: "Åtgärd", example: "list_transactions" },
  account_id: { title: "Konto-ID", example: "acc_12345" },
  search_query: { title: "Fritextsökning", example: "Netflix" },
  amount: { title: "Belopp", example: "450.00" },
  message: { title: "Meddelande / OCR", example: "OCR 8374922" }
};

export default function ApiSpec() {
  const [activeTab, setActiveTab] = useState('human');
  const [openParam, setOpenParam] = useState('action');
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(openAiSchema, null, 2);
  const properties = openAiSchema.function.parameters.properties;
  const requiredFields = openAiSchema.function.parameters.required || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto my-8 font-sans bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">Giltigt OpenAI Format</span>
          <h1 className="text-xl font-black text-slate-900 mt-1 font-mono">{openAiSchema.function.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{openAiSchema.function.description}</p>
        </div>
        
        {/* Flikar */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl shrink-0 h-fit self-start sm:self-center">
          <button 
            onClick={() => setActiveTab('human')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'human' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Mänsklig tolkning
          </button>
          <button 
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all ${activeTab === 'json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            JSON Schema (Ren)
          </button>
        </div>
      </div>

      {/* FLIK 1: MÄNSKLIG TOLKNING (+/-) */}
      {activeTab === 'human' && (
        <div className="p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Interaktiv parameterlista:</h3>
          
          <div className="space-y-3">
            {Object.entries(properties).map(([key, value]) => {
              const isOpen = openParam === key;
              const isRequired = requiredFields.includes(key);
              const humanData = humanInterpretations[key] || { title: key, example: "" };

              return (
                <div key={key} className={`border rounded-xl transition-all ${isOpen ? 'border-indigo-200 bg-indigo-50/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  
                  <button 
                    onClick={() => setOpenParam(isOpen ? null : key)}
                    className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">{key}</span>
                      <span className="text-xs text-slate-400 font-sans">({humanData.title})</span>
                      {isRequired ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-rose-50 text-rose-600 uppercase tracking-wide">Obligatorisk</span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-500 uppercase tracking-wide">Valfri</span>
                      )}
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-sm font-bold transition-colors ${isOpen ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      {isOpen ? '−' : '+'}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-dashed border-slate-100 text-sm text-slate-600">
                      <p className="leading-relaxed text-slate-700">{value.description}</p>
                      
                      {value.enum && (
                        <div className="mt-2 text-xs">
                          <span className="font-semibold text-slate-400 uppercase">Tillåtna värden:</span>
                          <div className="flex gap-1.5 mt-1">
                            {value.enum.map(val => (
                              <code key={val} className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">{val}</code>
                            ))}
                          </div>
                        </div>
                      )}

                      {humanData.example && (
                        <div className="mt-3 flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 w-fit">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider">Exempel på värde:</span>
                          <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">{humanData.example}</code>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FLIK 2: STRICKT JSON SCHEMA */}
      {activeTab === 'json' && (
        <div className="p-6 bg-slate-900 text-slate-300 relative">
          <div className="absolute right-10 top-10 z-10">
            <button
              onClick={handleCopy}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {copied ? 'Kopierat! ✓' : 'Kopiera schema'}
            </button>
          </div>
          <pre className="text-xs md:text-sm overflow-x-auto font-mono leading-relaxed select-all max-h-[500px] p-4 bg-slate-950 rounded-xl border border-slate-800">
            <code>{jsonString}</code>
          </pre>
        </div>
      )}

    </div>
  );
}
