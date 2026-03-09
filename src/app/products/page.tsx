'use client';

import { Nav } from '@/components/Nav';
import { Product, RequiredPart } from '@/lib/types';
import { useEffect, useState } from 'react';

const blankPart = (): RequiredPart => ({ id: crypto.randomUUID(), partCode: '', partName: '', quantityPerProduct: 1 });

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  async function load() {
    const res = await fetch('/api/products');
    if (res.ok) setProducts(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    load();
  }

  return (
    <div>
      <Nav />
      <h1>Products</h1>
      <button onClick={() => setEditing({ id: '', productCode: '', productName: '', requiredParts: [blankPart()], createdAt: '', updatedAt: '' })}>New Product</button>
      {editing && (
        <div className="card">
          <input placeholder="Product code" value={editing.productCode ?? ''} onChange={(e) => setEditing({ ...editing, productCode: e.target.value })} />
          <input placeholder="Product name" value={editing.productName} onChange={(e) => setEditing({ ...editing, productName: e.target.value })} />
          {editing.requiredParts.map((part, idx) => (
            <div key={part.id} className="row">
              <input placeholder="Part code" value={part.partCode} onChange={(e) => {
                const next = [...editing.requiredParts];
                next[idx] = { ...part, partCode: e.target.value };
                setEditing({ ...editing, requiredParts: next });
              }} />
              <input placeholder="Part name" value={part.partName} onChange={(e) => {
                const next = [...editing.requiredParts];
                next[idx] = { ...part, partName: e.target.value };
                setEditing({ ...editing, requiredParts: next });
              }} />
              <input type="number" placeholder="Qty" value={part.quantityPerProduct} onChange={(e) => {
                const next = [...editing.requiredParts];
                next[idx] = { ...part, quantityPerProduct: Number(e.target.value) };
                setEditing({ ...editing, requiredParts: next });
              }} />
            </div>
          ))}
          <button onClick={() => setEditing({ ...editing, requiredParts: [...editing.requiredParts, blankPart()] })}>Add Part</button>
          <button onClick={save}>Save</button>
        </div>
      )}

      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Parts</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.productCode}</td><td>{p.productName}</td><td>{p.requiredParts.length}</td>
              <td>
                <button onClick={() => setEditing(p)}>Edit</button>
                <button onClick={async () => { await fetch(`/api/products?id=${p.id}`, { method: 'DELETE' }); load(); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
