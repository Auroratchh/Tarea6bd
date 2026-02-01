import { query } from '../../../../lib/db';
import KPICard from '../../report';
import { z } from 'zod';
import Link from 'next/link';

const QuerySchema = z.object({
  rango: z.enum(['CARO', 'MEDIO', 'ECONOMICO', '']).optional().default(''),
  page: z.coerce.number().min(1).default(1),
});

interface ProductosPrecio {
  nombre: string;
  categoria: string;
  precio: string;
  stock: number;
  veces_vendido: number;
  rango_precio: string;
}

export default async function PreciosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  const decodedParams = await searchParams;
  const { rango, page } = QuerySchema.parse(decodedParams);
  
  const limit = 5;
  const offset = (page - 1) * limit;

  let sql = 'SELECT * FROM productos_precio';
  const params: any[] = [];

  if (rango) {
    sql += ' WHERE rango_precio = $1 ORDER BY precio DESC LIMIT $2 OFFSET $3';
    params.push(rango, limit, offset);
  } else {
    sql += ' ORDER BY precio DESC LIMIT $1 OFFSET $2';
    params.push(limit, offset);
  }

  const data = await query<ProductosPrecio>(sql, params);
  
  const caros = data.filter(p => p.rango_precio === 'CARO').length;
  const economicos = data.filter(p => p.rango_precio === 'ECONOMICO').length;

  return (
    <div className="container">
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
          className={`nav-link ${data.length < limit ? 'disabled' : ''}`}
        >
          Siguiente &rarr;
        </Link>
      </div>
    </div>
  );
}