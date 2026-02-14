import KPICard from '../../report';
import Link from 'next/link';

interface InventarioBajo {
  codigo: string;
  nombre: string;
  stock: number;
  total_vendido: number;
  estado: string;
}

interface ApiResponse {
  data: InventarioBajo[];
  agotados: number;
}

async function getData(): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/inventario`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function InventarioPage() {
  const { data, agotados } = await getData();

  return (
    <div>
      <Link href="/" className="back-link"> Volver a Reportes</Link>
      <div className="header">
        <h1>Inventario Bajo</h1>
        <p>Productos con stock bajo</p>
      </div>

      <div className="kpi-grid">
        <KPICard title="Productos agotados" value={agotados} />
        <KPICard title="Total productos" value={data.length} />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Productos con stock bajo</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Producto</th>
              <th className="text-right">Stock actual</th>
              <th className="text-right">Total vendido</th>
              <th className="text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.codigo}</td>
                <td>{row.nombre}</td>
                <td className="text-right">{row.stock}</td>
                <td className="text-right">{row.total_vendido}</td>
                <td className="text-center">
                  <span className="badge">{row.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}