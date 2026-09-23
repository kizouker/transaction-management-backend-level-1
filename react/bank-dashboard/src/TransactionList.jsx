import React, { useMemo } from 'react';
import { transformTransactionData } from './transformer';

const rawJsonFromOpenAI = {
  "account_id": "acc_12345",
  "currency": "SEK",
  "transactions": [
    { "transaction_id": "tx_987654", "date": "2026-09-22", "description": "OPENAI *CHATGPTPLUS", "amount": -250.00, "type": "debit", "category": "Software & Subscription", "status": "completed" },
    { "transaction_id": "tx_987655", "date": "2026-09-23", "description": "Löneutbetalning", "amount": 35000.00, "type": "credit", "category": "Income", "status": "completed" }
  ]
};

export default function TransactionList() {
  const transactions = useMemo(() => {
    return transformTransactionData(rawJsonFromOpenAI);
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden font-sans">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Transaktionshistorik</h1>
        <p className="text-sm text-slate-500 mt-1">Konto: <span className="font-mono bg-slate-200/60 px-1.5 py-0.5 rounded text-xs">{rawJsonFromOpenAI.account_id}</span></p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/30">
              <th className="py-4 px-6">Beskrivning & Datum</th>
              <th className="py-4 px-6 hidden sm:table-cell">Kategori</th>
              <th className="py-4 px-6 hidden sm:table-cell">Status</th>
              <th className="py-4 px-6 text-right">Belopp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-lg ${tx.isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.isCredit ? '+' : '−'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{tx.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 hidden sm:table-cell">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tx.category.color}`}>
                    {tx.category.label}
                  </span>
                </td>
                <td className="py-4 px-6 hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {tx.status}
                  </span>
                </td>
                <td className={`py-4 px-6 text-right font-semibold ${tx.isCredit ? 'text-emerald-600' : 'text-slate-950'}`}>
                  {tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
