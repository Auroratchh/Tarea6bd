import { query } from '../../../../lib/db';
import KPICard from '../../report';

interface InventarioBajo {
  codigo: string;
  nombre: string;
  stock: number;
  total_vendido: number;
  estado: string;
}

async function getData() {
  const sql = 'SELECT * FROM inventario_bajo ORDER BY stock ASC';
  return await query<InventarioBajo>(sql);
}

export default async function InventarioPage() {
  const data = await getData();
  
  const agotados = data.filter(p => p.estado === 'AGOTADO').length;

  return (
    <div>
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