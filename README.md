# NewProjectApp

Sistema de gestión de negocios (reservas, clientes, servicios, agenda, cobros y portafolio).
Base limpia y desacoplada, lista para evolucionar como un producto nuevo.

## Stack

- **React 19 + Vite 8** (SPA con HMR)
- **TypeScript-ready** (proyecto en JS/JSX)
- **Tailwind CSS v4** (configuración CSS-first)
- **Firebase** (Auth, Firestore, Storage) — integración lista para configurar
- **Cloudinary** (subida directa de imágenes — módulo de trabajos)
- **TanStack Query** (datos y caché)
- **React Router v7** · **React Hook Form** + **Zod** · **Framer Motion** · **Oxlint**

## Scripts

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run preview # previsualizar build
npm run lint    # lint (oxlint)
```

## Configuración pendiente

1. **Firebase**: completá las variables `VITE_FIREBASE_*` en `.env.local`
   (Firebase Console → Configuración → Aplicaciones web).
2. **Cloudinary**: completá `VITE_CLOUDINARY_CLOUD_NAME` y
   `VITE_CLOUDINARY_UPLOAD_PRESET` en `.env.local` (con tu cuenta nueva).
3. **Hosting** (`.firebaserc` y `.github/workflows/firebase-hosting.yml`):
   definí el `projectId` de tu nuevo proyecto Firebase.
4. **Branding**: `src/constants/app.js` (`APP_NAME`, `APP_TAGLINE`),
   `index.html` (título / SEO) y `public/logo-placeholder.svg`.

## Estructura

```
src/
  assets/       # logo placeholder (reemplazar con el branding nuevo)
  components/   # UI común, layout, iconos, booking, notificaciones
  constants/    # configuración global (app, navigation, notifications)
  context/      # AuthContext
  firebase/     # config de Firebase
  hooks/        # hooks de datos y UI
  layouts/      # AppLayout
  lib/          # firestore realtime, queryClient, zod
  pages/        # páginas (Login, Register, Booking, Dashboard, ...)
  routes/       # router y rutas protegidas
  schemas/      # schemas Zod
  services/     # capas de acceso a datos / cloudinary
  types/        # tipos
  utils/        # utilidades
```