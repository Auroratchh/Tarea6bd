# **Tarea 6: Lab Reportes: Next.js Reports Dashboard (PostgreSQL + Views + Docker Compose)**

## Aplicación web de reportes SQL construida con Next.js que consume vistas de PostgreSQL. Se generaron 5 reportes con distintas visualizaciones de los datos.

### Reportes implementados
1. Ventas por categoría
2. Productos más vendidos
3. Clientes frecuentes
4. Inventario bajo
5. Productos por rango de precio

### Investigación y Justificaciones Técnicas

1. Common Table Expressions (CTE)

Las CTEs son consultas temporales nombradas que se definen dentro de una instrucción SELECT,
INSERT, UPDATE o DELETE. Mejoran la legibilidad del código SQL y permiten consultas recursivas.

2. Window Functions - Funciones de Ventana

Las funciones de ventana realizan cálculos sobre un conjunto de filas relacionadas con la
fila actual, sin colapsar las filas en un único resultado como GROUP BY.

3. Índices de Base de Datos

Los índices son estructuras de datos que mejoran la velocidad de recuperación de datos
en tablas a costa de espacio adicional y overhead en escritura.

4. Paginación Server-Side con LIMIT y OFFSET

Técnica para dividir grandes conjuntos de resultados en páginas más pequeñas, procesadas 
en el servidor antes de enviar al cliente.

5. Seguridad: Roles y Permisos Mínimos

Cada componente del sistema debe tener solo los permisos necesarios para realizar
su función, nada más.

### Instalación y Configuración

Paso 1: Levantar PostgreSQL

``` docker compose up -d ```

Paso 2: Verificar Base de Datos

 ``` docker compose ps ``` 
  ``` docker exec -it postgres_container psql -U postgres -d tarea6 ``` 

Paso 3: Configurar Next.js

``` cd reports ``` 
``` npm install ``` 

Crear archivo .env.local

``` DATABASE_URL=postgresql://[usuario]:[contraseña]@localhost:5433/[db] ```

Paso 4: Ejecutar la Aplicación

``` npm run dev ```






