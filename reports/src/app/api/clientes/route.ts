import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

interface RecopilacionClientes {
  id: number;
  nombre: string;
  email: string;
  total_ordenes: number;
  total_gastado: string;
  ticket_promedio: string;
  tipo_cliente: string;
}

export async function GET() {
  try {
    const sql = 'SELECT * FROM recopilacion_clientes ORDER BY total_gastado DESC';
    const data = await query<RecopilacionClientes>(sql);
    
    const totalGastado = data.reduce((sum, row) => sum + parseFloat(row.total_gastado), 0);
    const clientesAlto = data.filter(c => c.tipo_cliente === 'ALTO' || c.tipo_cliente === 'VIP').length;

    return NextResponse.json({
      data,
      totalGastado,
      clientesAlto,
    });
  } catch (error) {
    console.error('Error en API report3:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}