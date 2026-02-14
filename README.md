# **Tarea 6: Lab Reportes: Next.js Reports Dashboard (PostgreSQL + Views + Docker Compose)**

## Aplicación web de reportes SQL construida con Next.js que consume vistas de PostgreSQL. Se generaron 5 reportes con distintas visualizaciones de los datos.

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






