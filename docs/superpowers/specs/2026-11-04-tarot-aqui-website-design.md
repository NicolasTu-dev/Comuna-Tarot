# Diseño: Sitio web "Tarot aquí" — Fase 1 (consultas de tarot)

**Fecha:** 2026-11-04
**Estado:** Aprobado para pasar a plan de implementación

## 1. Resumen y objetivo

Página web para Sofía ("Tarot aquí 🔑" en Instagram) para vender sus lecturas de tarot
online. Reemplaza la coordinación 100% manual actual por IG/WhatsApp con un sitio que
permite informarse, elegir un servicio, pagar online, y automáticamente avisarle a
Sofía del pedido nuevo por WhatsApp. La entrega de la lectura y la coordinación de
sesiones en vivo siguen siendo manuales, por WhatsApp, como ya lo hace hoy.

**Fuera de alcance de esta fase:** venta de cursos (1 a 1 por ahora, grupales más
adelante). La estructura del sitio debe permitir agregar una sección de cursos en una
fase futura sin rehacer lo construido ahora.

## 2. Servicios (contenido confirmado)

| Servicio | Modalidad | Precio | Entrega |
|---|---|---|---|
| Carta consejo | Asincrónica | $2000 ARS / 2 USD | Sofía responde por WhatsApp (foto/audio/video) |
| Lectura de 2+ cartas | Asincrónica | $4000 ARS / 4 USD | Sofía responde por WhatsApp (foto/audio/video) |
| Sesión en vivo (30-40 min, llamada/videollamada WhatsApp) | Sincrónica | A definir con Sofía | Coordinación de horario manual por WhatsApp |

**Nombre de marca (provisorio):** "Tarot aquí" (consistente con su Instagram). Dominio
a definir — no bloquea el desarrollo inicial (se puede empezar con un dominio
provisorio de Vercel y migrar después).

## 3. Arquitectura y stack

- **Framework:** Next.js (App Router), desplegado en Vercel.
- **Base de datos:** Postgres vía Neon (Vercel Marketplace) + Drizzle ORM. Solo
  persiste **pedidos** (orders) — los servicios y precios quedan como configuración
  estática en el código, ya que Nicolás mantiene el sitio directamente (no hay CMS).
- **Pagos:** Mercado Pago (Checkout Pro) y Stripe (Checkout), ambos vía redirect +
  webhook de confirmación server-side.
- **Notificación de pedidos:** WhatsApp Business API (ej. Twilio o Meta Cloud API) —
  mensaje automático a Sofía cuando se confirma un pago. Requiere dar de alta una
  cuenta/número de WhatsApp Business dedicado a notificaciones (tarea previa al
  desarrollo, no bloquea el diseño).
- **Diseño visual:** `shadcn/ui` como base de componentes + animaciones (tipo Framer
  Motion) para lograr un acabado premium (ver sección 6).

No se integra Google Calendar — ninguna modalidad de servicio requiere reserva de
horario automatizada; todo horario (de la sesión en vivo) se coordina manualmente por
WhatsApp después del pago.

## 4. Páginas y flujo de usuario

**Landing (`/`):**
- Hero con presentación de Sofía y llamado a la acción.
- Sección "Sobre Sofía" (bio).
- Sección de servicios (tabla de la sección 2), con botón "Pedir lectura" por cada uno.
- Footer con contacto / redes.

**Flujo de pedido (`/pedir`):**
1. El cliente elige el tipo de servicio (carta consejo, lectura de 2+ cartas, o sesión
   en vivo).
2. Completa un formulario: nombre, WhatsApp, y su pregunta/motivo de consulta.
3. Paga con Mercado Pago o Stripe (elige en el checkout).
4. Página de confirmación (`/pedir/confirmacion`):
   - Si es asincrónica: "Tu pedido fue recibido, Sofía te va a responder por WhatsApp
     en un plazo de X horas."
   - Si es sesión en vivo: "Tu pedido fue recibido, Sofía te va a escribir para
     coordinar día y horario."
5. Automáticamente, Sofía recibe un WhatsApp con los datos del pedido (nombre,
   teléfono, servicio, consulta).
6. Sofía responde/coordina directamente con el cliente por su WhatsApp personal —
   fuera del sitio, sin código involucrado.

## 5. Manejo de errores y casos límite

- **Pago fallido o abandonado:** el pedido queda en estado `pending` en la base; no se
  le avisa a Sofía hasta que el pago se confirme.
- **Webhook duplicado:** Mercado Pago y Stripe pueden reenviar la misma notificación
  más de una vez — se verifica el ID de transacción antes de procesar, para no avisarle
  dos veces a Sofía por el mismo pedido.
- **Falla al enviar el WhatsApp de aviso:** el pedido ya se guardó como `paid` antes de
  intentar notificar, así que un fallo de la API de WhatsApp no hace perder el pedido
  ni el pago. Se reintenta el envío y se loguea el error para revisión manual.
- **Datos de contacto inválidos:** se valida el formato del teléfono (WhatsApp) en el
  formulario antes de permitir el pago, para asegurar que Sofía pueda contactar al
  cliente.

## 6. Dirección visual

Objetivo: que el sitio transmita calidad premium ("como si costara 10 mil dólares"),
no una landing genérica.

- **Estética:** paisaje místico/elegante, paleta oscura con acentos cálidos (dorados,
  violetas, naranjas — en línea con la imagen de marca que ya usa en Instagram),
  tipografía con carácter, texturas sutiles (humo, estrellas, cartas).
- **Animación:** scroll animations, micro-interacciones en botones/cards, posible
  efecto de cartas de tarot animadas en el hero.
- **Calidad de ejecución:** layout cuidado, jerarquía visual clara, cada sección con
  identidad propia pero coherente entre sí. Imágenes optimizadas para que el sitio
  cargue rápido a pesar de las animaciones.
- Esta dirección se ejecuta durante la implementación con las skills de diseño
  correspondientes (no se invocan en esta etapa de brainstorming).

## 7. Testing y verificación

- Tests automatizados para el cálculo de precio según servicio elegido y la creación
  de pedidos.
- Tests de los webhooks de Mercado Pago y Stripe con payloads simulados, verificando
  que un pago confirmado actualiza el pedido y dispara el aviso de WhatsApp una sola
  vez (sin duplicar ante reintentos del webhook).
- Validación de formulario (teléfono/email mal formados).
- Prueba manual de punta a punta antes de lanzar, con tarjetas de prueba de ambos
  proveedores de pago, confirmando que el WhatsApp le llega a Sofía con los datos
  correctos.

## 8. Mantenimiento

Nicolás mantiene el sitio editando el código directamente (precios, servicios, textos).
No se construye panel de administración/CMS en esta fase.

## 9. Estructura del proyecto

Next.js (App Router) con nombres en español/inglés simple y consistente según el tipo
de archivo (rutas en español porque son URLs visibles al usuario; código interno en
inglés porque es la convención del ecosistema). Cada carpeta tiene una responsabilidad
única para que sea fácil ubicar y modificar cosas sin tocar lo demás.

```
tarot-aqui/
├── app/
│   ├── page.tsx                       # Landing ("/")
│   ├── layout.tsx
│   ├── globals.css
│   ├── pedir/
│   │   ├── page.tsx                   # Elegir servicio + formulario de pedido
│   │   └── confirmacion/
│   │       └── page.tsx               # Página post-pago
│   └── api/
│       ├── orders/
│       │   └── route.ts               # POST: crea un pedido en estado "pending"
│       └── payments/
│           ├── mercadopago/webhook/route.ts
│           └── stripe/webhook/route.ts
├── components/
│   ├── ui/                            # Componentes base de shadcn/ui
│   ├── landing/                       # hero, about-sofia, services, footer
│   └── order/                         # service-selector, order-form, payment-picker
├── lib/
│   ├── db/
│   │   ├── schema.ts                  # Tabla `orders` (Drizzle)
│   │   ├── client.ts                  # Conexión a Neon Postgres
│   │   └── orders.ts                  # createOrder, markOrderAsPaid, etc.
│   ├── payments/
│   │   ├── mercadopago.ts             # Crear preferencia / verificar webhook
│   │   └── stripe.ts                  # Crear checkout session / verificar webhook
│   ├── notifications/
│   │   └── whatsapp.ts                # Enviar aviso de pedido nuevo a Sofía
│   ├── services.ts                    # Config estática: tipos de lectura y precios
│   └── validation.ts                  # Esquemas (zod) del formulario de pedido
├── drizzle/                           # Migraciones generadas
├── docs/superpowers/specs/            # Specs de diseño (este documento)
├── drizzle.config.ts
├── .env.example
└── package.json
```

**Reglas de nombres:**
- Carpetas y archivos de rutas (`app/`) en minúsculas con guiones, en español para
  que coincida con la URL (`/pedir`, no `/order`).
- Componentes en `PascalCase` dentro de archivos `kebab-case.tsx` (convención estándar
  de Next.js/shadcn).
- Funciones y variables en inglés dentro de `lib/`, ya que es código interno sin
  exposición directa al usuario — mantiene consistencia con las librerías que se usan
  (Drizzle, Stripe SDK, etc.).

## 10. Pendientes antes de lanzar (no bloquean el desarrollo)

- Definir precio de la sesión en vivo de 30-40 min.
- Dar de alta la cuenta/número de WhatsApp Business API para las notificaciones.
- Definir y comprar el dominio final.
- Confirmar textos/fotos definitivos de Sofía para la sección "Sobre Sofía".
