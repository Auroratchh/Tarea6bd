# Tarea 6: Next.js Reports Dashboard

Dashboard de reportes con PostgreSQL views, Next.js 16 App Router, y Docker Compose.

## Instalación

```bash
docker compose up --build
```

Acceder a: http://localhost:3000

## Arquitectura

- **Backend**: PostgreSQL 16 con 5 views analíticas
- **Frontend**: Next.js 16 (App Router) + Server Components
- **Deploy**: Docker Compose con healthcheck

## Trade-offs (SQL vs Next.js)

- **Agregaciones en SQL** (SUM, AVG, COUNT): PostgreSQL optimiza mejor que JavaScript
- **Paginación server-side** (LIMIT/OFFSET): Evita cargar miles de registros en memoria
- **Validación en Next.js** (Zod): Valida parámetros antes de queries SQL
- **Totales en API routes**: Suma en TypeScript sobre datos ya filtrados

## Performance Evidence

### 1. Índice en `orden_detalles.producto_id`
```sql
EXPLAIN ANALYZE
SELECT p.nombre, SUM(od.cantidad) 
FROM productos p
LEFT JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY p.nombre;
```

### 2. Índice en `ordenes.usuario_id`
```sql
EXPLAIN ANALYZE
SELECT u.nombre, COUNT(o.id)
FROM usuarios u
JOIN ordenes o ON u.id = o.usuario_id
GROUP BY u.nombre;
```

## Threat Model

**Prevención de ataques:**

1. **SQL Injection**: Queries parametrizadas (`$1, $2, $3`) + validación Zod
2. **Credenciales expuestas**: Variables de entorno + conexión solo server-side
3. **Permisos mínimos**: Usuario DB solo tiene SELECT en views (no tablas)
4. **Whitelist de inputs**: Zod enum para parámetros ('CARO' | 'MEDIO' | 'ECONOMICO')
5. **No acceso directo a tablas**: Aplicación usa solo views (capa de abstracción)

## Bitácora de IA

**Prompts clave:**

1. "Crea views PostgreSQL con CTE y window functions"
   - Validé: Sintaxis OVER(), agregaciones correctas
   - Corregí: Agregué COALESCE para manejar NULL

2. "API routes Next.js con Zod y paginación"
   - Validé: Tipos TypeScript, queries parametrizadas
   - Corregí: `parseFloat()` antes de sumar strings de PostgreSQL

3. "Fix fetch en Server Components"
   - Problema: Rutas relativas fallan en SSR
   - Solución: `NEXT_PUBLIC_API_URL` con URL completa

## Estructura
```
.
├── db/
│   ├── 01_schema.sql        
│   ├── 03_seed.sql          
│   ├── 04_indexes.sql       
│   ├── 05_reports_vw.sql    
│   └── 06_roles.sql         
├── reports/
│   ├── src/app/
│   │   ├── api/             
│   │   └── reports/         
│   └── lib/db.ts           
└── docker-compose.yml
```

## Reportes

1. **Ventas por Categoría**: Filtrado + paginación
2. **Top Productos**: Window function (ROW_NUMBER)
3. **Clientes**: CTE para cálculos
4. **Inventario Bajo**: CASE para estados
5. **Análisis Precios**: Filtro por rango + paginación





