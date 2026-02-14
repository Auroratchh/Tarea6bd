import KPICard from '../../report';

interface ProductosRan {
  id: number;
  nombre: string;
  categoria: string;
  cantidad_vendida: number;
  ingresos: string;
  ranking: number;
}

interface ApiResponse {
  data: ProductosRan[];
  totalIngresos: number;
  totalCantidad: number;
}

async function getData(): Promise<ApiResponse> {
  const res = await fetch('/api/reports/report2', { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function ProductosTopPage() {
  const { data, totalIngresos, totalCantidad } = await getData();

  return (
    <div>
      <div className="header">
        <h1>Productos Más Vendidos</h1>
        <p>TRanking de productos</p>
      </div>

      <div className="kpi-grid">
        <KPICard title="Producto top" value={data[0]?.nombre || 'N/A'}/>
        <KPICard title="Ingresos total" value={`$${totalIngresos.toFixed(2)}`}/>
        <KPICard title="Unidades Vendidas" value={totalCantidad}/>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Top 10 productos</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Producto</th>
              <th>Categoria</th>
              <th className="text-right">Cantidad vendida</th>
              <th className="text-right">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>
                  <span className={`ranking-badge ranking-${row.ranking <= 3 ? row.ranking : 'other'}`}>
                    {row.ranking === 1 ? '#1' : row.ranking === 2 ? '#2' : row.ranking === 3 ? '#3' : `#${row.ranking}`}
                  </span>
                </td>
                <td className="font-bold">{row.nombre}</td>
                <td>{row.categoria}</td>
                <td className="text-right font-bold">{row.cantidad_vendida}</td>
                <td className="text-right text-green">${parseFloat(row.ingresos).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}