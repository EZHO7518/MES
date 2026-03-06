'use client';

import { Nav } from '@/components/Nav';
import { Product, Quotation } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function QuotationsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([{ productId: '', quantity: 1 }]);
  const [health, setHealth] = useState<{ quotationWriteEnabled: boolean } | null>(null);

  async function load() {
    const [p, q, h] = await Promise.all([fetch('/api/products'), fetch('/api/quotations'), fetch('/api/ecount/health')]);
    if (p.ok) setProducts(await p.json());
    if (q.ok) setQuotations(await q.json());
    if (h.ok) setHealth(await h.json());
  }

  useEffect(() => { load(); }, []);

  async function saveQuotation() {
    const mapped = items
      .filter((i) => i.productId)
      .map((i) => ({ ...i, productName: products.find((p) => p.id === i.productId)?.productName ?? '' }));

    await fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, note, items: mapped }),
    });
    setCustomerName('');
    setNote('');
    setItems([{ productId: '', quantity: 1 }]);
    load();
  }

  return (
    <div>
      <Nav />
      <h1>Quotations</h1>
      <div className="card">
        <div>Quotation ECOUNT write: {health?.quotationWriteEnabled ? <span className="badge">enabled</span> : <span className="badge">disabled</span>}</div>
        <input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <textarea placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
        {items.map((item, idx) => (
          <div key={idx} className="row">
            <select value={item.productId} onChange={(e) => {
              const next = [...items];
              next[idx].productId = e.target.value;
              setItems(next);
            }}>
              <option value="">Select product</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.productName}</option>)}
            </select>
            <input type="number" value={item.quantity} onChange={(e) => {
              const next = [...items];
              next[idx].quantity = Number(e.target.value);
              setItems(next);
            }} />
          </div>
        ))}
        <button onClick={() => setItems([...items, { productId: '', quantity: 1 }])}>Add Item</button>
        <button onClick={saveQuotation}>Save Quotation</button>
      </div>

      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Items</th><th>Created</th></tr></thead>
        <tbody>
          {quotations.map((q) => (
            <tr key={q.id}><td>{q.id.slice(0, 8)}</td><td>{q.customerName}</td><td>{q.items.length}</td><td>{new Date(q.createdAt).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
