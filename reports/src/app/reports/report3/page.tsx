import { query } from '../../../../lib/db';
import KPICard from '../../report';
import Link from 'next/link';

interface RecopilacionClientes {
  id: number;
  nombre: string;
  email: string;
  total_ordenes: number;
  total_gastado: string;
  ticket_promedio: string;
  tipo_cliente: string;
}

async function getData() {
  const sql = 'SELECT * FROM recopilacion_clientes ORDER BY total_gastado DESC';
  return await query<RecopilacionClientes>(sql);
}

export default async function ClientesPage() {
  const data = await getData();
  
  const totalGastado = data.reduce((sum, row) => sum + parseFloat(row.total_gastado), 0);
  const clientesAlto = data.filter(c => c.tipo_cliente === 'ALTO' || c.tipo_cliente === 'VIP').length;

  return (
    <div>
      <div className="header">
        <h1>Clientes</h1>
        <p>Clientes frecuentes</p>
      </div>

      <div className="kpi-grid">
        <KPICard title="Total clientes" value={data.length}/>
        <KPICard title="Cliente alto" value={clientesAlto}/>
        <KPICard title="Ingresos totales" value={`$${totalGastado.toFixed(2)}`}/>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Detalle de clientes</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th className="text-right">Ordenes</th>
              <th className="text-right">Total gastado</th>
              <th className="text-right">Ticket promedio</th>
              <th className="text-center">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="font-bold">{row.nombre}</td>
                <td className="text-gray">{row.email}</td>
                <td className="text-right">{row.total_ordenes}</td>
                <td className="text-right text-green">${parseFloat(row.total_gastado).toFixed(2)}</td>
                <td className="text-right">${parseFloat(row.ticket_promedio).toFixed(2)}</td>
                <td className="text-center">
                  <span className={`badge badge-${row.tipo_cliente.toLowerCase()}`}>
                    {row.tipo_cliente}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}