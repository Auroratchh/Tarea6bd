import { query } from '../../../../lib/db';
import KPICard from '../../report';

interface VentasCategoria {
  categoria: string;
  total_productos_vendidos: number;
  ingresos_totales: string;
  precio_promedio: string;
}

async function getData() {
  const sql = 'SELECT * FROM ventas_categoria ORDER BY ingresos_totales DESC';
  return await query<VentasCategoria>(sql);
}

export default async function VentasCategoriaPage() {
  const data = await getData();
  
  const totalIngresos = data.reduce((sum, row) => sum + parseFloat(row.ingresos_totales), 0);

  return (
    <div>
      <div className="header">
        <h1>Ventas por Categoría</h1>
        <p>Análisis de ingresos por categoría de productos</p>
      </div>

      <div className="kpi-grid">
        <KPICard title="Ingresos Totales" value={`$${totalIngresos.toFixed(2)}`} />
        <KPICard title="Categorías" value={data.length} />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Detalle por categoria</h2>
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
    </div>
  );
}