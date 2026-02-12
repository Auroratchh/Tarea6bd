# **Tarea 6: Lab Reportes: Next.js Reports Dashboard (PostgreSQL + Views + Docker Compose)**

## Aplicación web de reportes SQL construida con Next.js que consume vistas de PostgreSQL. Se generaron 5 reportes con distintas visualizaciones de los datos.

### Instalación y Configuración

#### Ejecución con Docker Compose

Para levantar el entorno completo, ejecuta:

``` docker-compose up --build ```

La aplicación estará disponible en http://localhost:3000.

### Trade-offs (SQL vs Next.js)

Lógica de Clasificación: Se decidió clasificar los productos por rango de precio (CARO, MEDIO, ECONOMICO) y el estatus de stock directamente en SQL mediante cláusulas CASE.

Razón: Esto garantiza que la lógica de negocio sea consistente independientemente de qué cliente consuma la base de datos y reduce la carga de procesamiento en el navegador del usuario.

Cálculo de Totales e Ingresos: Los cálculos financieros (SUM, AVG, ROUND) se realizan en las Views de PostgreSQL.

Razón: Es mucho más eficiente procesar miles de registros en el motor de base de datos que enviar datos crudos a Next.js para ser calculados en JavaScript, optimizando el ancho de banda.

Filtros de Búsqueda: Se optó por filtros combinados (Servidor + Cliente). Mientras que la búsqueda principal por texto se hace en la query SQL, los KPIs de resumen en la UI se calculan usando .reduce() y .filter() en Next.js.

### (EXPLAIN ANALYZE)
Evidencia 1: Optimización de Detalles de Orden

Query: SELECT ... FROM ordenes JOIN orden_detalles ... WHERE o.id = 1;

Sin Índice: Realizaba un Sequential Scan en ambas tablas.

Con Índice (idx_orden_detalles_orden_id): Al ejecutar EXPLAIN ANALYZE, se observa un Index Scan.

Resultado: Se redujo el costo de búsqueda de detalles de una orden específica, lo cual acelera los reportes de "Ventas por Categoría" y "Clientes".

Evidencia 2: Optimización de Ranking de Ventas

Query: Agrupación y suma de ventas por producto para el Reporte 2.

Evidencia: Index Scan using idx_orden_detalles_producto_id on orden_detalles

Explicación: El índice en la llave foránea producto_id permite que el motor encuentre rápidamente todas las ventas asociadas a un producto sin recorrer toda la tabla de detalles, mejorando drásticamente el tiempo de respuesta del ranking.

### Threat Model

 Se creó el rol user_nuevo en 06_roles.sql. Este usuario tiene permisos estrictamente limitados: solo puede conectarse y hacer SELECT sobre las vistas, teniendo prohibido el acceso directo a las tablas base.

 Todas las consultas en los Server Components de Next.js utilizan queries parametrizadas ($1, $2, $3), asegurando que las entradas del usuario (filtros de búsqueda) nunca se ejecuten como código SQL.

 Se implementó Zod para validar los searchParams antes de enviarlos a la base de datos, asegurando que el parámetro page sea siempre un número y el rango pertenezca a los valores permitidos (ENUM).

 Las credenciales de la base de datos se manejan mediante variables de entorno, evitando exponer datos sensibles en el código fuente.


Evidencia de Base de Datos

Comando ejecutado: \dv

tarea6=# \dv
                 List of relations
 Schema |         Name          | Type |   Owner    
--------+-----------------------+------+------------
 public | inventario_bajo       | view | user_nuevo
 public | productos_precio      | view | user_nuevo
 public | productos_ran         | view | user_nuevo
 public | recopilacion_clientes | view | user_nuevo
 public | ventas_categoria      | view | user_nuevo
(5 rows)

tarea6=# 







