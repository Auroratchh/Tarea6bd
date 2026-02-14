import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { z } from 'zod';

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');

    const { search: validatedSearch, page: validatedPage } = QuerySchema.parse({ search, page });
    
    const limit = 5;
    const offset = (validatedPage - 1) * limit;

    let sql = 'SELECT * FROM ventas_categoria';
    const params: any[] = [];

    if (validatedSearch && validatedSearch.trim() !== '') {
      sql += ' WHERE categoria ILIKE $1 ORDER BY ingresos_totales DESC LIMIT $2 OFFSET $3';
      params.push(`%${validatedSearch}%`, limit, offset);
    } else {
      sql += ' ORDER BY ingresos_totales DESC LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const data = await query<VentasCategoria>(sql, params);
    const totalIngresos = data.reduce((sum, row) => sum + parseFloat(row.ingresos_totales), 0);

    return NextResponse.json({
      data,
      totalIngresos,
      hasMore: data.length === limit,
    });
  } catch (error) {
    console.error('Error en API report1:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}