import Link from 'next/link';

const reports = [
  { id: 1, title: 'Reporte 1: Ventas por Categoría', href: '/reports/report1'},
  { id: 2, title: 'Reporte 2: Ranking de Productos', href: '/reports/report2' },
  { id: 3, title: 'Reporte 3: Recopilación de Clientes', href: '/reports/report3'},
  { id: 4, title: 'Reporte 4: Inventario Crítico', href: '/reports/report4'},
  { id: 5, title: 'Reporte 5: Análisis de Precios', href: '/reports/report5'},
];

export default function HomePage() {
  return (
    <div>
      <div className="header">
        <h1>Reportes</h1>
        <p>Con PostgreSQL y Next.js</p>
      </div>

      <div className="report-grid">
        {reports.map((report) => (
          <Link key={report.id} href={report.href} className="report-card">
            <h3>{report.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}