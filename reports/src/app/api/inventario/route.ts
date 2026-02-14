import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

interface InventarioBajo {
  codigo: string;
  nombre: string;
  stock: number;
  total_vendido: number;
  estado: string;
}

export async function GET() {
  try {
    const sql = 'SELECT * FROM inventario_bajo ORDER BY stock ASC';
    const data = await query<InventarioBajo>(sql);
    
    const agotados = data.filter(p => p.estado === 'AGOTADO').length;

    return NextResponse.json({
      data,
      agotados,
    });
  } catch (error) {
    console.error('Error en API report4:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}