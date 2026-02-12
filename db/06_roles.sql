-- ROLES.SQL

-- Nombre: Brittany Aurora Hernández Muñoz
-- Matricula: 243707
-- Grupo: C

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user_nuevo') THEN
    CREATE ROLE user_nuevo WITH LOGIN PASSWORD 'password_123';
  END IF;
END $$;

GRANT CONNECT ON DATABASE tarea6 TO user_nuevo;
GRANT USAGE ON SCHEMA public TO user_nuevo;
GRANT SELECT ON ventas_categoria TO user_nuevo;
GRANT SELECT ON productos_ran TO user_nuevo;
GRANT SELECT ON recopilacion_clientes TO user_nuevo;
GRANT SELECT ON productos_precio TO user_nuevo;
GRANT SELECT ON inventario_bajo TO user_nuevo;