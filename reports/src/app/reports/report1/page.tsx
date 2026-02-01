import { query } from '../../../../lib/db';
import KPICard from '../../report';
import { z } from 'zod';
import Link from 'next/link';

const QuerySchema = z.object({
  search: z.string().optional().default(''),
  page: z.coerce.number().min(1).default(1),
});

interface VentasCategoria {
  categoria: string;
  total_productos_vendidos: number;
  ingresos_totales: string;
  precio_promedio: string;
}

export default async function VentasCategoriaPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const decodedParams = await searchParams; 
  const { search, page } = QuerySchema.parse(decodedParams);
  
  const limit = 5; 
  const offset = (page - 1) * limit;

  let sql = 'SELECT * FROM ventas_categoria';
  const params: any[] = [];

  if (search && search.trim() !== '') {
    sql += ' WHERE categoria ILIKE $1 ORDER BY ingresos_totales DESC LIMIT $2 OFFSET $3';
    params.push(`%${search}%`, limit, offset);
  } else {
    sql += ' ORDER BY ingresos_totales DESC LIMIT $1 OFFSET $2';
    params.push(limit, offset);
  }

  const data = await query<VentasCategoria>(sql, params);
  const totalIngresos = data.reduce((sum, row) => sum + parseFloat(row.ingresos_totales), 0);

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
        <Link href={`?page=${page + 1}&search=${search}`} className={`nav-link ${data.length < limit ? 'disabled' : ''}`}>
          Siguiente &rarr;
        </Link>
      </div>
    </div>
  );
}