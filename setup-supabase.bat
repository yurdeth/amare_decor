@echo off
echo ================================================
echo CONFIGURACIÓN AUTOMÁTICA DE AMARE DECOR
echo ================================================
echo.
echo Este script configurará automáticamente tu sistema
echo ================================================
echo.

echo PASO 1: Crear archivo .env.local
echo ----------------------------------------
echo.
set /p SUPABASE_URL="Ingresa tu Project URL de Supabase (ej: https://tu-proyecto.supabase.co): "
echo.
set /p SUPABASE_KEY="Ingresa tu anon public key de Supabase: "
echo.
set /p SUPABASE_SERVICE="Ingresa tu service_role key de Supabase: "
echo.

echo Creando archivo .env.local...
(
echo # Supabase Configuration for Amaré Decor
echo NEXT_PUBLIC_SUPABASE_URL=%SUPABASE_URL%
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=%SUPABASE_KEY%
echo SUPABASE_SERVICE_ROLE_KEY=%SUPABASE_SERVICE%
) > .env.local

echo ✅ Archivo .env.local creado correctamente!
echo.

echo ================================================
echo CONFIGURACIÓN COMPLETADA
echo ================================================
echo.
echo Tu sistema está configurado con Supabase!
echo.
echo PASOS FINALES:
echo 1. Ve a: https://supabase.com/dashboard
echo 2. Entra a tu proyecto
echo 3. Ve a SQL Editor
echo 4. Abre el archivo: supabase-schema.sql
echo 5. Copia y pega TODO el contenido en el SQL Editor
echo 6. Haz clic en "Run"
echo 7. Ve a Authentication > Users > "Add user"
echo 8. Crea usuario: amare.2520mp@gmail.com
echo 9. Reinicia este servidor y listo!
echo.
echo ================================================
echo.

pause