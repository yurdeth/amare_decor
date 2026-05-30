# Amaré Decor - Sistema de Gestión de Decoración de Eventos

Sistema de gestión integral para Amaré Decor - Organiza cada detalle con amor.

## Características

- 👥 Gestión de clientes
- 💼 Sistema de cotizaciones inteligente con plantillas
- 📅 Gestión de eventos calendarizados
- 💰 Control financiero (ingresos y egresos)
- 📦 Inventario de productos y materiales
- 📊 Reportes con exportación a PDF
- 🔐 Sistema de autenticación con roles (admin/editor)
- 💾 Exportación/importación de datos (backup)

## Tecnologías

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Zod** - Validación de esquemas
- **bcryptjs** - Hash de contraseñas

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repo-url>
   cd amare-decor
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

4. **Genera hashes para los usuarios**
   ```bash
   npm run generate-hash
   ```

5. **Crea el archivo de usuarios**
   ```bash
   cp lib/data/users.json.example lib/data/users.json
   # Edita lib/data/users.json con tus usuarios y hashes generados
   ```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Comandos disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Linting
npm run generate-hash # Generar hash de contraseñas
```

## Usuarios por defecto

El proyecto incluye usuarios de ejemplo. Para generar tus propias contraseñas:

```bash
npm run generate-hash
```

Luego actualiza `lib/data/users.json` con los hashes generados.

## Backup de datos

El sistema utiliza localStorage para persistir datos. Para hacer backup:

1. Ve al Dashboard
2. Usa los botones "Exportar Datos" / "Importar Datos"
3. Los datos se guardan como archivos `.json`

## Estructura del proyecto

```
amare-decor/
├── app/              # Páginas Next.js (App Router)
├── components/       # Componentes React
├── lib/             # Lógica de negocio
│   ├── context/     # React Contexts
│   ├── validation/  # Schemas Zod
│   └── utils/       # Utilidades
├── types/           # Definiciones TypeScript
└── public/          # Archivos estáticos
```

## Deployment

### Vercel

La forma más fácil de desplegar es usando [Vercel](https://vercel.com/new).

### Otros proveedores

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod](https://zod.dev)

## License

MIT
