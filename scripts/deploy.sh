#!/bin/bash

# Script de despliegue para Amaré Decor en producción
# Uso: sudo ./scripts/deploy.sh

set -e

echo "🚀 Iniciando despliegue de Amaré Decor..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si es root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}⚠️  Ejecuta como root (sudo)${NC}"
    exit 1
fi

# 1. Instalar dependencias si no están instaladas
echo -e "${YELLOW}📦 Verificando dependencias...${NC}"
npm install --production

# 2. Crear variables de entorno si no existen
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚙️  Creando .env.local desde .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${RED}⚠️  EDITA .env.local CON TUS VALORES REALES ANTES DE CONTINUAR${NC}"
    echo "Presiona Enter cuando hayas editado el archivo..."
    read
fi

# 3. Crear archivo de usuarios si no existe
if [ ! -f lib/data/users.json ]; then
    echo -e "${YELLOW}👤 Creando archivo de usuarios...${NC}"
    cp lib/data/users.json.example lib/data/users.json
    echo -e "${RED}⚠️  GENERA HASHES Y EDITA lib/data/users.json ANTES DE CONTINUAR${NC}"
    echo "Ejecuta: npm run generate-hash"
    echo "Presiona Enter cuando hayas configurado los usuarios..."
    read
fi

# 4. Build de producción
echo -e "${YELLOW}🔨 Construyendo para producción...${NC}"
npm run build

# 5. Verificar PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando PM2...${NC}"
    npm install -g pm2
fi

# 6. Detener instancia anterior si existe
if pm2 list | grep -q "amare-decor"; then
    echo -e "${YELLOW}🛑 Deteniendo instancia anterior...${NC}"
    pm2 stop amare-decor
    pm2 delete amare-decor
fi

# 7. Iniciar con PM2
echo -e "${GREEN}▶️  Iniciando aplicación con PM2...${NC}"
pm2 start ecosystem.config.js

# 8. Guardar configuración de PM2
pm2 save

# 9. Configurar PM2 para iniciar en boot
if ! pm2 startup | grep -q "sudo"; then
    echo -e "${YELLOW}⚠️  Ejecuta 'pm2 startup' y sigue las instrucciones${NC}"
fi

# 10. Configurar nginx
echo -e "${YELLOW}🌐 Configurando nginx...${NC}"
NGINX_CONF="/etc/nginx/sites-available/amare-decor"

if [ ! -f "$NGINX_CONF" ]; then
    cp nginx.conf "$NGINX_CONF"
    sed -i "s|tu-dominio.com|$(hostname -f)|g" "$NGINX_CONF"
    ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/

    # Verificar configuración de nginx
    nginx -t

    # Reiniciar nginx
    systemctl restart nginx
else
    echo -e "${GREEN}✅ Configuración de nginx ya existe${NC}"
fi

# 11. Configurar firewall (ufw)
echo -e "${YELLOW}🔒 Configurando firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 'Nginx Full'
    ufw allow ssh
    echo -e "${GREEN}✅ Firewall configurado${NC}"
fi

# 12. Crear directorio de logs si no existe
mkdir -p /var/log
chown -R $USER:$USER /var/log

echo -e "${GREEN}✅ Despliegue completado!${NC}"
echo ""
echo "📊 Estado de PM2:"
pm2 status
echo ""
echo "🌐 Aplicación disponible en: http://$(hostname -f)"
echo ""
echo "📝 Comandos útiles:"
echo "  pm2 logs amare-decor    - Ver logs"
echo "  pm2 restart amare-decor - Reiniciar"
echo "  pm2 stop amare-decor     - Detener"
echo "  pm2 monit               - Monitoreo en tiempo real"
