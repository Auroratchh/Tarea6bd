import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

interface ProductosRan {
  id: number;
  nombre: string;
  categoria: string;
  cantidad_vendida: number;
  ingresos: string;
  ranking: number;
}

export async function GET() {
  try {
    const sql = 'SELECT * FROM productos_ran ORDER BY ranking ASC';
    const data = await query<ProductosRan>(sql);
    
    const totalIngresos = data.reduce((sum, row) => sum + parseFloat(row.ingresos), 0);
    const totalCantidad = data.reduce((sum, row) => sum + row.cantidad_vendida, 0);

    return NextResponse.json({
      data,
      totalIngresos,
      totalCantidad,
    });
  } catch (error) {
    console.error('Error en API report2:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}