import KPICard from '../../report';
import Link from 'next/link';

interface ProductosPrecio {
  nombre: string;
  categoria: string;
  precio: string;
  stock: number;
  veces_vendido: number;
  rango_precio: string;
}

interface ApiResponse {
  data: ProductosPrecio[];
  caros: number;
  economicos: number;
  hasMore: boolean;
}

async function getData(rango: string, page: number): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/precios?rango=${encodeURIComponent(rango)}&page=${page}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function PreciosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const decodedParams = await searchParams;
  const rango = (decodedParams.rango as string) || '';
  const page = parseInt((decodedParams.page as string) || '1');
  
  const { data, caros, economicos, hasMore } = await getData(rango, page);

  return (
    <div className="container">
      <Link href="/" className="back-link"> Volver a Reportes</Link>
      <div className="header">
        <h1>Productos por rango de precio</h1>
        <p>Clasificación de productos según precio</p>
        
        <form method="GET" className="filter-container">
          <select name="rango" defaultValue={rango} className="search-input">
            <option value="">Todos los rangos</option>
            <option value="CARO">Caro</option>
            <option value="MEDIO">Medio</option>
            <option value="ECONOMICO">Económico</option>
          </select>
          <button type="submit" className="btn-primary">Filtrar</button>
        </form>
      </div>

      <div className="kpi-grid">
        <KPICard title="Caro" value={caros} />
        <KPICard title="Economico" value={economicos} />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Catálogo de productos</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th className="text-right">Precio</th>
              <th className="text-right">Stock</th>
              <th className="text-right">Veces vendido</th>
              <th className="text-center">Rango</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.nombre}</td>
                <td>{row.categoria}</td>
                <td className="text-right">${parseFloat(row.precio).toFixed(2)}</td>
                <td className="text-right">{row.stock}</td>
                <td className="text-right">{row.veces_vendido}</td>
                <td className="text-center">
                  <span className={`badge`}>{row.rango_precio}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <Link 
          href={`?page=${Math.max(1, page - 1)}&rango=${rango}`}
          className={`nav-link ${page <= 1 ? 'disabled' : ''}`}
        >
          &larr; Anterior
        </Link>
        
        <span className="page-number">Página {page}</span>
        <Link 
          href={`?page=${page + 1}&rango=${rango}`}
          className={`nav-link ${!hasMore ? 'disabled' : ''}`}
        >
          Siguiente &rarr;
        </Link>
      </div>
    </div>
  );
}