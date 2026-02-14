import KPICard from '../../report';
import Link from 'next/link';

interface VentasCategoria {
  categoria: string;
  total_productos_vendidos: number;
  ingresos_totales: string;
  precio_promedio: string;
}

interface ApiResponse {
  data: VentasCategoria[];
  totalIngresos: number;
  hasMore: boolean;
}

async function getData(search: string, page: number): Promise<ApiResponse> {
  const url = `/api/reports/report1?search=${encodeURIComponent(search)}&page=${page}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function VentasCategoriaPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const decodedParams = await searchParams;
  const search = (decodedParams.search as string) || '';
  const page = parseInt((decodedParams.page as string) || '1');
  
  const { data, totalIngresos, hasMore } = await getData(search, page);
  const limit = 5;

  return (
    <div className="container">
      <div className="header">
        <h1>Ventas por Categoría</h1>
        <p>Análisis de ingresos filtrado y paginado desde el servidor</p>
        
        <form method="GET" className="filter-container">
          <input 
            name="search" 
            placeholder="Buscar categoría..." 
            defaultValue={search}
            className="search-input"
          />
          <button type="submit" className="btn-primary">Filtrar</button>
        </form>
      </div>

      <div className="kpi-grid">
        <KPICard title="Ingresos (Vista)" value={`$${totalIngresos.toFixed(2)}`} />
        <KPICard title="Categorías" value={data.length} />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Detalle por categoría</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Categoría</th>
              <th className="text-right">Productos vendidos</th>
              <th className="text-right">Ingresos totales</th>
              <th className="text-right">Precio promedio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.categoria}</td>
                <td className="text-right">{row.total_productos_vendidos}</td>
                <td className="text-right">${parseFloat(row.ingresos_totales).toFixed(2)}</td>
                <td className="text-right">${parseFloat(row.precio_promedio).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <Link href={`?page=${Math.max(1, page - 1)}&search=${search}`} className={`nav-link ${page <= 1 ? 'disabled' : ''}`}>
          &larr; Anterior
        </Link>
        <span className="page-number">Página {page}</span>
        <Link href={`?page=${page + 1}&search=${search}`} className={`nav-link ${!hasMore ? 'disabled' : ''}`}>
          Siguiente &rarr;
        </Link>
      </div>
    </div>
  );
}