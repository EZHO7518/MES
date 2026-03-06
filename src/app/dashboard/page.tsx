import { Nav } from '@/components/Nav';

export default function DashboardPage() {
  return (
    <div>
      <Nav />
      <h1>MES Dashboard</h1>
      {[
        '1) Register products and required parts (BOM-like).',
        '2) Create quotation with product quantities.',
        '3) Run server-side ECOUNT inventory fetch.',
        '4) Aggregate required parts and compare stock.',
        '5) Determine producibility and shortage.',
        '6) Optionally register quotation to ECOUNT.',
      ].map((step) => (
        <div key={step} className="card">{step}</div>
      ))}
    </div>
  );
}
