import { query } from '../../../../lib/db';
import KPICard from '../../report';

interface ProductosPrecio {
  nombre: string;
  categoria: string;
  precio: string;
  stock: number;
  veces_vendido: number;
  rango_precio: string;
}

async function getData() {
  const sql = 'SELECT * FROM productos_precio ORDER BY precio DESC';
  return await query<ProductosPrecio>(sql);
}

export default async function PreciosPage() {
  const data = await getData();
  
  const caros = data.filter(p => p.rango_precio === 'CARO').length;
  const economicos = data.filter(p => p.rango_precio === 'ECONOMICO').length;

  return (
    <div>
      <div className="header">
        <h1>Productos por rango de precio</h1>
        <p>Clasificacion de productos según precio</p>
      </div>

      <div className="kpi-grid">
        <KPICard title="Productos caros" value={caros} />
        <KPICard title="Productos económicos" value={economicos} />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Catalogo de productos</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoria</th>
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
                  <span className="badge">{row.rango_precio}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}