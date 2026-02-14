import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { z } from 'zod';

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rango = searchParams.get('rango') || '';
    const page = parseInt(searchParams.get('page') || '1');

    const { rango: validatedRango, page: validatedPage } = QuerySchema.parse({ rango, page });
    
    const limit = 5;
    const offset = (validatedPage - 1) * limit;

    let sql = 'SELECT * FROM productos_precio';
    const params: any[] = [];

    if (validatedRango) {
      sql += ' WHERE rango_precio = $1 ORDER BY precio DESC LIMIT $2 OFFSET $3';
      params.push(validatedRango, limit, offset);
    } else {
      sql += ' ORDER BY precio DESC LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const data = await query<ProductosPrecio>(sql, params);
    
    const caros = data.filter(p => p.rango_precio === 'CARO').length;
    const economicos = data.filter(p => p.rango_precio === 'ECONOMICO').length;

    return NextResponse.json({
      data,
      caros,
      economicos,
      hasMore: data.length === limit,
    });
  } catch (error) {
    console.error('Error en API report5:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}