'use client';

import { Nav } from '@/components/Nav';
import { InventoryCheckResult, Quotation } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function ChecksPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState<InventoryCheckResult | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/quotations').then(async (r) => r.ok && setQuotations(await r.json()));
  }, []);

  async function check() {
    setMessage('');
    const res = await fetch('/api/ecount/inventory-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quotationId: selectedId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'check failed');
      return;
    }
    setResult(data);
  }

  async function registerQuotation() {
    const res = await fetch('/api/ecount/quotation-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quotationId: selectedId }),
    });
    const data = await res.json();
    setMessage(res.ok ? 'quotation registered successfully' : data.error || 'registration failed');
  }

  return (
    <div>
      <Nav />
      <h1>Inventory Checks</h1>
      <div className="card">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select quotation</option>
          {quotations.map((q) => <option key={q.id} value={q.id}>{q.customerName} - {q.id.slice(0, 8)}</option>)}
        </select>
        <div className="row">
          <button onClick={check} disabled={!selectedId}>Check producibility with ECOUNT stock</button>
          <button onClick={registerQuotation} disabled={!selectedId}>Register quotation to ECOUNT</button>
        </div>
        {message && <p>{message}</p>}
      </div>

      {result && (
        <div className="card">
          <div>Status: <span className="badge">{result.summaryStatus}</span> Producible: {String(result.producible)}</div>
          <table>
            <thead><tr><th>Part code</th><th>Part name</th><th>Required</th><th>Stock</th><th>Shortage</th><th>Result</th></tr></thead>
            <tbody>
              {result.detailRows.map((row) => (
                <tr key={row.partCode}>
                  <td>{row.partCode}</td><td>{row.partName}</td><td>{row.requiredQty}</td><td>{row.stockQty}</td><td>{row.shortageQty}</td><td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
