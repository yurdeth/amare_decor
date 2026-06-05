# Guía de Despliegue en Producción

## Requisitos Previos

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar nginx
sudo apt install -y nginx

# Instalar PM2 globalmente
sudo npm install -g pm2
```

## Configuración Manual Paso a Paso

### 1. Preparar el Proyecto

```bash
cd /home/angel/PhpstormProjects/amare-decor

# Instalar dependencias de producción
npm install

# Crear archivos de configuración
cp .env.example .env.local
# EDITAR .env.local CON TUS VALORES REALES

cp lib/data/users.json.example lib/data/users.json
# GENERAR HASHES Y EDITAR users.json
npm run generate-hash
```

### 2. Build de Producción

```bash
npm run build
```

### 3. Configurar PM2

```bash
# Editar ecosystem.config.js con tu ruta real
nano ecosystem.config.js

# Iniciar aplicación
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
# Ejecuta el comando que te muestra
```

### 4. Configurar Nginx

```bash
# Copiar configuración
sudo cp nginx.conf /etc/nginx/sites-available/amare-decor

# Editar con tu dominio
sudo nano /etc/nginx/sites-available/amare-decor

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/amare-decor /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar nginx
sudo systemctl restart nginx
```

### 5. Configurar Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### 6. SSL Opcional (Let's Encrypt)

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

## Despliegue Automático

O usa el script automatizado:

```bash
chmod +x scripts/deploy.sh
sudo ./scripts/deploy.sh
```

## Comandos de Mantenimiento

### PM2
```bash
pm2 list              # Ver todas las apps
pm2 logs amare-decor  # Ver logs
pm2 restart amare-decor # Reiniciar
pm2 stop amare-decor  # Detener
pm2 monit            # Monitoreo en tiempo real
pm2 flush            # Limpiar logs
```

### Nginx
```bash
sudo systemctl status nginx
sudo systemctl restart nginx
sudo nginx -t         # Verificar configuración
```

### Actualizar Aplicación
```bash
git pull
npm install --production
npm run build
pm2 restart amare-decor
```

## Troubleshooting

### La app no inicia
```bash
pm2 logs amare-decor --lines 100
# Revisar logs de errores
```

### Nginx muestra 502
```bash
# Verificar que la app esté corriendo
pm2 status

# Verificar puerto 3000
netstat -tlnp | grep 3000
```

### Permisos de logs
```bash
sudo mkdir -p /var/log
sudo chown -R $USER:$USER /var/log
```

## Monitoreo

Para monitoreo en tiempo real:

```bash
pm2 monit
```

## URL en Producción

La aplicación estará disponible en:
- HTTP: `http://tu-dominio.com` o `http://tu-ip`
- HTTPS: `https://tu-dominio.com` (si configuraste SSL)
