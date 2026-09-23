// transformer.js
export const transformTransactionData = (rawApiData) => {
  if (!rawApiData || !rawApiData.transactions) return [];

  const currency = rawApiData.currency || 'SEK';

  return rawApiData.transactions.map((tx) => {
    // 1. Formatera valuta enligt svensk standard
    const formattedAmount = new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: currency,
    }).format(tx.amount);

    // 2. Formatera datum till något mer lättläst
    const formattedDate = new Date(tx.date).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // 3. Mappa kategorier till svenska och tillfoga Tailwind-färgklasser
    const categoryMap = {
      'Software & Subscription': { label: 'Prenumeration', color: 'bg-purple-50 text-purple-700 border-purple-100' },
      'Income': { label: 'Inkomst', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      // Standardfall om kategori saknas eller är ny
      'default': { label: tx.category || 'Övrigt', color: 'bg-slate-100 text-slate-600 border-slate-200' }
    };

    const categoryInfo = categoryMap[tx.category] || categoryMap['default'];

    return {
      id: tx.transaction_id,
      description: tx.description,
      rawAmount: tx.amount, // Sparas om vi vill göra matematiska beräkningar senare
      amount: formattedAmount,
      date: formattedDate,
      isCredit: tx.type === 'credit',
      status: tx.status === 'completed' ? 'Bokförd' : 'Behandlas',
      category: categoryInfo,
    };
  });
};
