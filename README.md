# Tarot aquí

Sitio web de Sofía para vender lecturas de tarot online. Ver el diseño completo en
`docs/superpowers/specs/2026-11-04-tarot-aqui-website-design.md`.

## Desarrollo local

1. `npm install`
2. Copiar `.env.example` a `.env.local` y completar las variables (ver abajo). Importante:
   `STRIPE_SECRET_KEY` y `MERCADOPAGO_ACCESS_TOKEN` tienen que tener *algún* valor (aunque
   sea de prueba) incluso para correr `npm run build` localmente — los SDKs de Stripe y
   Mercado Pago lanzan un error al importarse si la clave está vacía, y Next.js evalúa esos
   módulos durante el build al recolectar la configuración de las rutas de API.
3. Aplicar las migraciones: `npx drizzle-kit migrate`
4. `npm run dev` y abrir `http://localhost:3000`

## Tests

- `npm test` — tests unitarios (no requieren base de datos).
- `npm run test:db` — tests de `lib/db/orders.ts`, requieren `DATABASE_URL` apuntando
  a una base Postgres real (local o una rama de desarrollo en Neon).

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `DATABASE_URL` | Conexión a la base Postgres (Neon) |
| `MERCADOPAGO_ACCESS_TOKEN` | Credencial de la cuenta de Mercado Pago de Sofía |
| `STRIPE_SECRET_KEY` | Credencial de la cuenta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Firma para validar los webhooks de Stripe |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | Credenciales de la cuenta de Twilio usada para notificar a Sofía |
| `TWILIO_WHATSAPP_FROM` | Número de WhatsApp Business desde el que se manda la notificación |
| `SOFIA_WHATSAPP_NUMBER` | Número de WhatsApp de Sofía que recibe la notificación |
| `NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER` | Mismo número de Sofía, sin `whatsapp:` ni `+`, usado en los botones de contacto del sitio |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio, usada en los links de pago y webhooks |

## Probar webhooks en local

- **Stripe:** `stripe listen --forward-to localhost:3000/api/payments/stripe/webhook`
  (requiere la Stripe CLI) e imprime el `STRIPE_WEBHOOK_SECRET` a usar en local.
- **Mercado Pago:** no tiene CLI propia — exponer el servidor local con una URL
  pública (ej. `ngrok http 3000`) y usar esa URL como `NEXT_PUBLIC_SITE_URL` temporal
  para recibir las notificaciones.

## Deploy en Vercel

1. `vercel link` para conectar el proyecto.
2. Agregar una base de datos Postgres desde el Marketplace de Vercel (Neon).
3. Cargar todas las variables de entorno de la tabla de arriba con `vercel env add`.
4. Configurar la URL de notificaciones de Mercado Pago y el endpoint de webhook de
   Stripe apuntando a `https://<dominio>/api/payments/mercadopago/webhook` y
   `https://<dominio>/api/payments/stripe/webhook` respectivamente.
5. `vercel deploy --prod`

## Pendientes antes de lanzar

Ver la sección 10 del documento de diseño: definir el precio de la sesión en vivo,
dar de alta el número de WhatsApp Business para notificaciones, definir y comprar el
dominio final, y confirmar los textos/fotos definitivos de la sección "Sobre Sofía".
