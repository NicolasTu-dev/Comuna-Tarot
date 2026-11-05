# Tarot aquí — Sitio web (Fase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Phase 1 "Tarot aquí" website — a Next.js site where clients browse Sofía's tarot reading services, pay online (Mercado Pago or Stripe), and Sofía is automatically notified by WhatsApp to deliver the reading manually.

**Architecture:** Next.js (App Router) on Vercel with a small Postgres (Neon) database holding only `orders`. Service catalog and prices are static config in code (no CMS). Two payment providers create a pending order then redirect to checkout; their webhooks confirm payment, mark the order paid, and trigger a WhatsApp notification to Sofía via Twilio. No calendar integration — the one service without a fixed price (live session) bypasses the paid flow entirely via a direct WhatsApp link.

**Tech Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, shadcn/ui, Framer Motion, Drizzle ORM + Neon Postgres, Mercado Pago SDK, Stripe SDK, Zod, React Hook Form, Vitest + Testing Library.

## Global Constraints

- Stack: Next.js (App Router) + TypeScript + Tailwind v4, deployed on Vercel.
- Database: Postgres via Neon (Vercel Marketplace) + Drizzle ORM. Only the `orders` table is persisted — services/prices are static config in code, no CMS/admin panel (spec §3, §8).
- Payments: both Mercado Pago (Checkout Pro) and Stripe (Checkout) must be supported (spec §3).
- Notifications: WhatsApp Business API (Twilio) sends an automatic message to Sofía only, when a payment is confirmed. Delivery of the reading to the client is manual, outside the app (spec §3, §4).
- No Google Calendar integration — no scheduling UI anywhere in this phase (spec §3).
- Out of scope: cursos / Phase 2 — do not build course-related pages or data models (spec §1).
- Visual design: dark, mystical, premium aesthetic with animation (spec §6).
- Package manager: npm.
- `tailwindcss` and `@tailwindcss/postcss` must stay pinned to exact `4.1.18` — later 4.x releases break Next.js builds with `ERR_REQUIRE_ESM` (see Task 1 note). If any later task's tooling (e.g. `shadcn init`) bumps them, pin back to `4.1.18` and re-verify `npm run build`.
- Services and prices (spec §2): Carta consejo $2000 ARS / 2 USD (asincrónica); Lectura de 2+ cartas $4000 ARS / 4 USD (asincrónica); Sesión en vivo 30-40 min (sin precio fijo aún — no pasa por el flujo de pago).

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Create: `.gitignore`

**Interfaces:**
- Produces: a buildable Next.js App Router project (`npm run dev`, `npm run build`) that all later tasks add files to.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "tarot-aqui",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:db": "vitest run --config vitest.db.config.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "4.1.18",
    "@tailwindcss/postcss": "4.1.18"
  }
}
```

`tailwindcss`/`@tailwindcss/postcss` are pinned to the exact `4.1.18` (not a `^4.0.0` range): versions 4.2.0+ bundle a `magic-string@1.x` (pure ESM) dependency that Next.js's synchronous PostCSS plugin loader cannot `require()`, breaking every build with `Error [ERR_REQUIRE_ESM]`. `4.1.18` is the last release on the dual CJS/ESM `magic-string@0.30.x` line and builds cleanly.

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Create `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 5: Create `app/globals.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 6: Create `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tarot aquí",
  description: "Lecturas de tarot online con Sofía",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create `app/page.tsx`**

```tsx
export default function Home() {
  return <main>Tarot aquí</main>;
}
```

- [ ] **Step 8: Create `.gitignore`**

```
node_modules
.next
.env
.env.local
*.log
```

- [ ] **Step 9: Install and build**

Run: `npm install`
Run: `npm run build`
Expected: build completes with "Compiled successfully" and no TypeScript errors.

- [ ] **Step 10: Commit**

```bash
git add package.json tsconfig.json next.config.ts postcss.config.mjs app .gitignore package-lock.json
git commit -m "chore: scaffold Next.js project"
```

---

### Task 2: Install and configure shadcn/ui

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/textarea.tsx`
- Create: `components/ui/label.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/radio-group.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `cn()` from `lib/utils.ts`, and shadcn `Button`, `Input`, `Textarea`, `Label`, `Card`, `RadioGroup`/`RadioGroupItem` from `components/ui/*`, used by Task 16 and Task 17.

- [ ] **Step 1: Initialize shadcn/ui with defaults**

Run: `npx shadcn@latest init -d -y`
Expected: creates `components.json`, `lib/utils.ts`, updates `app/globals.css`, and adds `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react` to `package.json`.

- [ ] **Step 2: Add the components this project needs**

Run: `npx shadcn@latest add button input textarea label card radio-group -y`
Expected: creates `components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `card.tsx`, `radio-group.tsx`, and adds `@radix-ui/react-radio-group`, `@radix-ui/react-label` to `package.json`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add components.json lib/utils.ts components/ui app/globals.css package.json package-lock.json
git commit -m "chore: install shadcn/ui base components"
```

---

### Task 3: Dark mystical theme, fonts, and Framer Motion

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: CSS variables (`--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, etc.) and font variables (`--font-cormorant`, `--font-manrope`) consumed by every component in Tasks 16-17. `framer-motion`'s `motion` import available project-wide.

- [ ] **Step 1: Install Framer Motion and the animation utility shadcn relies on**

Run: `npm install framer-motion tw-animate-css`

- [ ] **Step 2: Replace `app/globals.css` with the full themed stylesheet**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.75rem;
  --background: oklch(0.08 0.02 300);
  --foreground: oklch(0.96 0.02 80);
  --card: oklch(0.12 0.03 300);
  --card-foreground: oklch(0.96 0.02 80);
  --popover: oklch(0.12 0.03 300);
  --popover-foreground: oklch(0.96 0.02 80);
  --primary: oklch(0.78 0.14 85);
  --primary-foreground: oklch(0.15 0.02 300);
  --secondary: oklch(0.32 0.12 300);
  --secondary-foreground: oklch(0.96 0.02 80);
  --muted: oklch(0.2 0.03 300);
  --muted-foreground: oklch(0.7 0.03 80);
  --accent: oklch(0.65 0.18 40);
  --accent-foreground: oklch(0.15 0.02 300);
  --destructive: oklch(0.6 0.22 25);
  --border: oklch(0.25 0.04 300);
  --input: oklch(0.25 0.04 300);
  --ring: oklch(0.78 0.14 85);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --font-display: var(--font-cormorant);
  --font-sans: var(--font-manrope);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}
```

- [ ] **Step 3: Load fonts in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Tarot aquí",
  description: "Lecturas de tarot online con Sofía",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify manually**

Run: `npm run dev`
Open `http://localhost:3000` in a browser and confirm the page has a dark background and the fonts are loading (check DevTools → Network for the font files, or Elements → computed `font-family`).
Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx package.json package-lock.json
git commit -m "feat: add dark mystical theme, fonts, and Framer Motion"
```

---

### Task 4: Set up Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/smoke.test.ts`

**Interfaces:**
- Produces: `npm test` running all `*.test.ts(x)` files except `*.db.test.ts`, with the `@/` path alias resolved and `@testing-library/jest-dom` matchers available.

- [ ] **Step 1: Install test dependencies**

Run: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    exclude: ["node_modules", "**/*.db.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Write the smoke test**

Create `lib/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run it and confirm it passes**

Run: `npm test`
Expected: `lib/smoke.test.ts` passes, 1 test total.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts vitest.setup.ts lib/smoke.test.ts package.json package-lock.json
git commit -m "chore: set up Vitest"
```

---

### Task 5: Drizzle schema and Neon client

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/client.ts`
- Create: `drizzle.config.ts`
- Create: `.env.example` (started here, completed in Task 18)

**Interfaces:**
- Produces: `orders` table, `OrderStatus`, `PaymentProvider` types, and `db` (Drizzle instance) from `lib/db/client.ts`, consumed by Task 12 (`lib/db/orders.ts`).

- [ ] **Step 1: Install dependencies**

Run: `npm install drizzle-orm @neondatabase/serverless`
Run: `npm install -D drizzle-kit dotenv`

- [ ] **Step 2: Create `lib/db/schema.ts`**

```ts
import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
]);

export const paymentProviderEnum = pgEnum("payment_provider", [
  "mercadopago",
  "stripe",
]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerWhatsapp: text("customer_whatsapp").notNull(),
  serviceId: text("service_id").notNull(),
  question: text("question").notNull(),
  paymentProvider: paymentProviderEnum("payment_provider").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type PaymentProvider = (typeof paymentProviderEnum.enumValues)[number];
```

- [ ] **Step 3: Create `lib/db/client.ts`**

```ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
```

- [ ] **Step 4: Create `drizzle.config.ts`**

```ts
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 5: Start `.env.example`**

Create `.env.example`:

```
# Base de datos (Neon Postgres)
DATABASE_URL=
```

- [ ] **Step 6: Generate the migration**

Run: `npx drizzle-kit generate --name create_orders_table`
Expected: a new file under `drizzle/` (e.g. `drizzle/0000_create_orders_table.sql`) containing `CREATE TABLE "orders" (...)`.

- [ ] **Step 7: Verify the project still builds**

Run: `npm run build`
Expected: build completes with no errors (no `DATABASE_URL` is required at build time since `neon()` only connects lazily on first query).

- [ ] **Step 8: Commit**

```bash
git add lib/db drizzle.config.ts drizzle .env.example package.json package-lock.json
git commit -m "feat: add Drizzle schema and Neon client for orders"
```

---

### Task 6: Service catalog (`lib/services.ts`)

**Files:**
- Create: `lib/services.ts`
- Test: `lib/services.test.ts`

**Interfaces:**
- Produces: `SERVICE_IDS`, `ServiceId`, `PAYABLE_SERVICE_IDS`, `PayableServiceId`, `Service`, `SERVICES`, `getService(id: string): Service | undefined`, `listServices(): Service[]`, `listPayableServices(): (Service & { priceArs: number; priceUsd: number })[]`, `isPayable(service: Service): boolean`. Consumed by Tasks 7, 13, 14, 15, 16, 17.

- [ ] **Step 1: Write the failing tests**

Create `lib/services.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getService, listServices, listPayableServices, isPayable, SERVICES } from "./services";

describe("getService", () => {
  it("returns the service for a known id", () => {
    const service = getService("carta-consejo");
    expect(service?.name).toBe("Carta consejo");
    expect(service?.priceArs).toBe(2000);
    expect(service?.priceUsd).toBe(2);
  });

  it("returns undefined for an unknown id", () => {
    expect(getService("servicio-inexistente")).toBeUndefined();
  });
});

describe("listServices", () => {
  it("returns all three services in a stable order", () => {
    const services = listServices();
    expect(services.map((s) => s.id)).toEqual([
      "carta-consejo",
      "lectura-2-cartas",
      "sesion-en-vivo",
    ]);
  });
});

describe("listPayableServices", () => {
  it("excludes services without a fixed price", () => {
    const services = listPayableServices();
    expect(services.map((s) => s.id)).toEqual(["carta-consejo", "lectura-2-cartas"]);
  });
});

describe("isPayable", () => {
  it("is true for services with a fixed price", () => {
    expect(isPayable(SERVICES["carta-consejo"])).toBe(true);
  });

  it("is false for services without a fixed price yet", () => {
    expect(isPayable(SERVICES["sesion-en-vivo"])).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/services.test.ts`
Expected: FAIL with "Cannot find module './services'".

- [ ] **Step 3: Implement `lib/services.ts`**

```ts
export const SERVICE_IDS = [
  "carta-consejo",
  "lectura-2-cartas",
  "sesion-en-vivo",
] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

export const PAYABLE_SERVICE_IDS = ["carta-consejo", "lectura-2-cartas"] as const;
export type PayableServiceId = (typeof PAYABLE_SERVICE_IDS)[number];

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  modality: "asincronica" | "en-vivo";
  priceArs: number | null;
  priceUsd: number | null;
  durationMinutes: number | null;
}

export const SERVICES: Record<ServiceId, Service> = {
  "carta-consejo": {
    id: "carta-consejo",
    name: "Carta consejo",
    description:
      "Una carta para responder una pregunta puntual. Lectura asincrónica: Sofía te responde por WhatsApp con la foto de la carta y su interpretación.",
    modality: "asincronica",
    priceArs: 2000,
    priceUsd: 2,
    durationMinutes: null,
  },
  "lectura-2-cartas": {
    id: "lectura-2-cartas",
    name: "Lectura de 2 o más cartas",
    description:
      "Una lectura más completa con dos o más cartas. Lectura asincrónica: Sofía te responde por WhatsApp con la foto de las cartas y su interpretación.",
    modality: "asincronica",
    priceArs: 4000,
    priceUsd: 4,
    durationMinutes: null,
  },
  "sesion-en-vivo": {
    id: "sesion-en-vivo",
    name: "Sesión en vivo",
    description:
      "Llamada o videollamada por WhatsApp de 30 a 40 minutos para responder tus consultas en vivo con Sofía.",
    modality: "en-vivo",
    priceArs: null,
    priceUsd: null,
    durationMinutes: 35,
  },
};

export function getService(id: string): Service | undefined {
  return SERVICES[id as ServiceId];
}

export function listServices(): Service[] {
  return SERVICE_IDS.map((id) => SERVICES[id]);
}

export function isPayable(
  service: Service
): service is Service & { priceArs: number; priceUsd: number } {
  return service.priceArs !== null && service.priceUsd !== null;
}

export function listPayableServices(): (Service & {
  priceArs: number;
  priceUsd: number;
})[] {
  return listServices().filter(isPayable);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/services.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/services.ts lib/services.test.ts
git commit -m "feat: add service catalog"
```

---

### Task 7: Order form validation (`lib/validation.ts`)

**Files:**
- Create: `lib/validation.ts`
- Test: `lib/validation.test.ts`

**Interfaces:**
- Consumes: `PAYABLE_SERVICE_IDS` from `lib/services.ts` (Task 6).
- Produces: `orderFormSchema` (Zod schema), `OrderFormInput` type. Consumed by Task 13 (`app/api/orders/route.ts`) and Task 17 (`app/pedir/pedir-form.tsx`).

- [ ] **Step 1: Install Zod**

Run: `npm install zod`

- [ ] **Step 2: Write the failing tests**

Create `lib/validation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { orderFormSchema } from "./validation";

const validInput = {
  name: "María López",
  whatsapp: "+5491122334455",
  serviceId: "carta-consejo",
  question: "¿Cómo me va a ir en el trabajo este mes?",
  paymentProvider: "mercadopago",
};

describe("orderFormSchema", () => {
  it("accepts a valid order", () => {
    const result = orderFormSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a name that is too short", () => {
    const result = orderFormSchema.safeParse({ ...validInput, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid WhatsApp number", () => {
    const result = orderFormSchema.safeParse({ ...validInput, whatsapp: "no-es-un-telefono" });
    expect(result.success).toBe(false);
  });

  it("rejects a serviceId that isn't payable", () => {
    const result = orderFormSchema.safeParse({ ...validInput, serviceId: "sesion-en-vivo" });
    expect(result.success).toBe(false);
  });

  it("rejects a question that is too short", () => {
    const result = orderFormSchema.safeParse({ ...validInput, question: "Hola" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown payment provider", () => {
    const result = orderFormSchema.safeParse({ ...validInput, paymentProvider: "paypal" });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run lib/validation.test.ts`
Expected: FAIL with "Cannot find module './validation'".

- [ ] **Step 4: Implement `lib/validation.ts`**

```ts
import { z } from "zod";
import { PAYABLE_SERVICE_IDS } from "./services";

export const orderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre completo")
    .max(100, "El nombre es demasiado largo"),
  whatsapp: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9]{8,15}$/,
      "Ingresá un número de WhatsApp válido, con código de país (ej. +5491122334455)"
    ),
  serviceId: z.enum(PAYABLE_SERVICE_IDS, {
    errorMap: () => ({ message: "Elegí un servicio válido" }),
  }),
  question: z
    .string()
    .trim()
    .min(5, "Contanos un poco más sobre tu consulta")
    .max(1000, "Tu consulta es demasiado larga"),
  paymentProvider: z.enum(["mercadopago", "stripe"], {
    errorMap: () => ({ message: "Elegí un método de pago" }),
  }),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run lib/validation.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add lib/validation.ts lib/validation.test.ts package.json package-lock.json
git commit -m "feat: add order form validation schema"
```

---

### Task 8: Payment confirmation idempotency logic

**Files:**
- Create: `lib/payments/confirm-order.ts`
- Test: `lib/payments/confirm-order.test.ts`

**Interfaces:**
- Produces: `OrderStatusSnapshot`, `PaymentConfirmationDecision`, `evaluatePaymentConfirmation(order: OrderStatusSnapshot): PaymentConfirmationDecision`. Consumed by Task 14 (Mercado Pago webhook) and Task 15 (Stripe webhook).

- [ ] **Step 1: Write the failing tests**

Create `lib/payments/confirm-order.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { evaluatePaymentConfirmation } from "./confirm-order";

describe("evaluatePaymentConfirmation", () => {
  it("marks paid and notifies for a pending order", () => {
    const decision = evaluatePaymentConfirmation({ status: "pending" });
    expect(decision).toEqual({
      shouldMarkPaid: true,
      shouldNotify: true,
      alreadyProcessed: false,
    });
  });

  it("does nothing for an order that is already paid", () => {
    const decision = evaluatePaymentConfirmation({ status: "paid" });
    expect(decision).toEqual({
      shouldMarkPaid: false,
      shouldNotify: false,
      alreadyProcessed: true,
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/payments/confirm-order.test.ts`
Expected: FAIL with "Cannot find module './confirm-order'".

- [ ] **Step 3: Implement `lib/payments/confirm-order.ts`**

```ts
export interface OrderStatusSnapshot {
  status: "pending" | "paid" | "failed";
}

export interface PaymentConfirmationDecision {
  shouldMarkPaid: boolean;
  shouldNotify: boolean;
  alreadyProcessed: boolean;
}

export function evaluatePaymentConfirmation(
  order: OrderStatusSnapshot
): PaymentConfirmationDecision {
  if (order.status === "paid") {
    return { shouldMarkPaid: false, shouldNotify: false, alreadyProcessed: true };
  }

  return { shouldMarkPaid: true, shouldNotify: true, alreadyProcessed: false };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/payments/confirm-order.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/payments/confirm-order.ts lib/payments/confirm-order.test.ts
git commit -m "feat: add payment confirmation idempotency logic"
```

---

### Task 9: WhatsApp notification to Sofía

**Files:**
- Create: `lib/notifications/whatsapp.ts`
- Test: `lib/notifications/whatsapp.test.ts`

**Interfaces:**
- Produces: `OrderNotificationInput`, `buildOrderNotificationMessage(input: OrderNotificationInput): string`, `sendOrderNotification(input: OrderNotificationInput): Promise<void>`. Consumed by Task 14 and Task 15.
- Requires env vars: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `SOFIA_WHATSAPP_NUMBER`.

- [ ] **Step 1: Write the failing tests**

Create `lib/notifications/whatsapp.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { buildOrderNotificationMessage, sendOrderNotification } from "./whatsapp";

const input = {
  customerName: "Ana",
  customerWhatsapp: "+5491122334455",
  serviceName: "Carta consejo",
  question: "¿Cómo me va a ir en el trabajo?",
};

describe("buildOrderNotificationMessage", () => {
  it("includes the customer name, whatsapp, service and question", () => {
    const message = buildOrderNotificationMessage(input);
    expect(message).toContain("Ana");
    expect(message).toContain("+5491122334455");
    expect(message).toContain("Carta consejo");
    expect(message).toContain("¿Cómo me va a ir en el trabajo?");
  });
});

describe("sendOrderNotification", () => {
  beforeEach(() => {
    process.env.TWILIO_ACCOUNT_SID = "ACxxxx";
    process.env.TWILIO_AUTH_TOKEN = "secret";
    process.env.TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886";
    process.env.SOFIA_WHATSAPP_NUMBER = "whatsapp:+5491100000000";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the message to the Twilio API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    await sendOrderNotification(input);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.twilio.com/2010-04-01/Accounts/ACxxxx/Messages.json");
    expect(options.method).toBe("POST");
    expect(options.body.toString()).toContain("Ana");
  });

  it("throws when the Twilio API responds with an error", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 401, text: async () => "Unauthorized" });
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendOrderNotification(input)).rejects.toThrow(/WhatsApp/);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/notifications/whatsapp.test.ts`
Expected: FAIL with "Cannot find module './whatsapp'".

- [ ] **Step 3: Implement `lib/notifications/whatsapp.ts`**

```ts
export interface OrderNotificationInput {
  customerName: string;
  customerWhatsapp: string;
  serviceName: string;
  question: string;
}

export function buildOrderNotificationMessage(input: OrderNotificationInput): string {
  return `Nuevo pedido en Tarot aquí 🔮

Servicio: ${input.serviceName}
Cliente: ${input.customerName}
WhatsApp: ${input.customerWhatsapp}
Consulta: ${input.question}`;
}

export async function sendOrderNotification(
  input: OrderNotificationInput
): Promise<void> {
  const message = buildOrderNotificationMessage(input);
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM!;
  const toNumber = process.env.SOFIA_WHATSAPP_NUMBER!;

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: fromNumber, To: toNumber, Body: message }),
    }
  );

  if (!response.ok) {
    throw new Error(`WhatsApp notification failed: ${response.status} ${await response.text()}`);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/notifications/whatsapp.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/notifications/whatsapp.ts lib/notifications/whatsapp.test.ts
git commit -m "feat: add WhatsApp order notification"
```

---

### Task 10: Mercado Pago integration

**Files:**
- Create: `lib/payments/mercadopago.ts`
- Test: `lib/payments/mercadopago.test.ts`

**Interfaces:**
- Produces: `CreateMercadoPagoPreferenceInput`, `createMercadoPagoPreference(input): Promise<string>`, `MercadoPagoWebhookBody`, `extractMercadoPagoPaymentId(body): string | null`, `MercadoPagoPaymentDetails`, `getMercadoPagoPayment(paymentId: string): Promise<MercadoPagoPaymentDetails>`. Consumed by Task 13 and Task 14.
- Requires env vars: `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`.

- [ ] **Step 1: Install the Mercado Pago SDK**

Run: `npm install mercadopago`

- [ ] **Step 2: Write the failing tests**

Create `lib/payments/mercadopago.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const preferenceCreateMock = vi.fn();
const paymentGetMock = vi.fn();

vi.mock("mercadopago", () => ({
  MercadoPagoConfig: vi.fn(),
  Preference: vi.fn().mockImplementation(() => ({ create: preferenceCreateMock })),
  Payment: vi.fn().mockImplementation(() => ({ get: paymentGetMock })),
}));

import {
  createMercadoPagoPreference,
  extractMercadoPagoPaymentId,
  getMercadoPagoPayment,
} from "./mercadopago";

beforeEach(() => {
  preferenceCreateMock.mockReset();
  paymentGetMock.mockReset();
  process.env.NEXT_PUBLIC_SITE_URL = "https://tarot-aqui.vercel.app";
});

describe("createMercadoPagoPreference", () => {
  it("returns the init_point and sends the right body", async () => {
    preferenceCreateMock.mockResolvedValue({
      init_point: "https://mercadopago.com/checkout/123",
    });

    const url = await createMercadoPagoPreference({
      id: 42,
      serviceName: "Carta consejo",
      priceArs: 2000,
    });

    expect(url).toBe("https://mercadopago.com/checkout/123");
    expect(preferenceCreateMock).toHaveBeenCalledWith({
      body: expect.objectContaining({
        external_reference: "42",
        items: [expect.objectContaining({ unit_price: 2000, currency_id: "ARS" })],
      }),
    });
  });
});

describe("extractMercadoPagoPaymentId", () => {
  it("returns the payment id for a payment notification", () => {
    expect(extractMercadoPagoPaymentId({ type: "payment", data: { id: "999" } })).toBe("999");
  });

  it("returns null for other notification types", () => {
    expect(extractMercadoPagoPaymentId({ type: "merchant_order" })).toBeNull();
  });
});

describe("getMercadoPagoPayment", () => {
  it("maps the payment status and external reference", async () => {
    paymentGetMock.mockResolvedValue({ status: "approved", external_reference: "42" });

    const result = await getMercadoPagoPayment("999");

    expect(result).toEqual({ status: "approved", externalReference: "42" });
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run lib/payments/mercadopago.test.ts`
Expected: FAIL with "Cannot find module './mercadopago'".

- [ ] **Step 4: Implement `lib/payments/mercadopago.ts`**

```ts
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export interface CreateMercadoPagoPreferenceInput {
  id: number;
  serviceName: string;
  priceArs: number;
}

export async function createMercadoPagoPreference(
  input: CreateMercadoPagoPreferenceInput
): Promise<string> {
  const preference = new Preference(client);
  const result = await preference.create({
    body: {
      items: [
        {
          id: String(input.id),
          title: input.serviceName,
          quantity: 1,
          unit_price: input.priceArs,
          currency_id: "ARS",
        },
      ],
      external_reference: String(input.id),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedir/confirmacion?order=${input.id}`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedir?error=pago_fallido`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/mercadopago/webhook`,
    },
  });

  return result.init_point!;
}

export interface MercadoPagoWebhookBody {
  type?: string;
  data?: { id?: string };
}

export function extractMercadoPagoPaymentId(
  body: MercadoPagoWebhookBody
): string | null {
  if (body.type === "payment" && body.data?.id) {
    return body.data.id;
  }
  return null;
}

export interface MercadoPagoPaymentDetails {
  status: string;
  externalReference: string;
}

export async function getMercadoPagoPayment(
  paymentId: string
): Promise<MercadoPagoPaymentDetails> {
  const payment = new Payment(client);
  const result = await payment.get({ id: paymentId });
  return {
    status: result.status!,
    externalReference: result.external_reference!,
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run lib/payments/mercadopago.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add lib/payments/mercadopago.ts lib/payments/mercadopago.test.ts package.json package-lock.json
git commit -m "feat: add Mercado Pago integration"
```

---

### Task 11: Stripe integration

**Files:**
- Create: `lib/payments/stripe.ts`
- Test: `lib/payments/stripe.test.ts`

**Interfaces:**
- Produces: `CreateStripeCheckoutSessionInput`, `createStripeCheckoutSession(input): Promise<string>`, `constructStripeEvent(payload, signature): Stripe.Event`, `extractStripeOrderId(event): number | null`. Consumed by Task 13 and Task 15.
- Requires env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`.

- [ ] **Step 1: Install the Stripe SDK**

Run: `npm install stripe`

- [ ] **Step 2: Write the failing tests**

Create `lib/payments/stripe.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sessionsCreateMock = vi.fn();
const constructEventMock = vi.fn();

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    checkout: { sessions: { create: sessionsCreateMock } },
    webhooks: { constructEvent: constructEventMock },
  })),
}));

import {
  createStripeCheckoutSession,
  constructStripeEvent,
  extractStripeOrderId,
} from "./stripe";

beforeEach(() => {
  sessionsCreateMock.mockReset();
  constructEventMock.mockReset();
  process.env.NEXT_PUBLIC_SITE_URL = "https://tarot-aqui.vercel.app";
});

describe("createStripeCheckoutSession", () => {
  it("returns the session url and sends the right line item", async () => {
    sessionsCreateMock.mockResolvedValue({ url: "https://checkout.stripe.com/session123" });

    const url = await createStripeCheckoutSession({
      id: 42,
      serviceName: "Carta consejo",
      priceUsd: 2,
    });

    expect(url).toBe("https://checkout.stripe.com/session123");
    expect(sessionsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: { orderId: "42" },
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({
              currency: "usd",
              unit_amount: 200,
            }),
          }),
        ],
      })
    );
  });
});

describe("extractStripeOrderId", () => {
  it("returns the order id for a completed checkout session", () => {
    const event = {
      type: "checkout.session.completed",
      data: { object: { id: "cs_123", metadata: { orderId: "42" } } },
    } as any;

    expect(extractStripeOrderId(event)).toBe(42);
  });

  it("returns null for other event types", () => {
    const event = { type: "payment_intent.created", data: { object: {} } } as any;
    expect(extractStripeOrderId(event)).toBeNull();
  });

  it("returns null when the session has no orderId in metadata", () => {
    const event = {
      type: "checkout.session.completed",
      data: { object: { id: "cs_123", metadata: {} } },
    } as any;

    expect(extractStripeOrderId(event)).toBeNull();
  });
});

describe("constructStripeEvent", () => {
  it("delegates to the Stripe SDK", () => {
    constructEventMock.mockReturnValue({ type: "checkout.session.completed" });
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

    const event = constructStripeEvent("raw-payload", "sig_header");

    expect(event).toEqual({ type: "checkout.session.completed" });
    expect(constructEventMock).toHaveBeenCalledWith("raw-payload", "sig_header", "whsec_test");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run lib/payments/stripe.test.ts`
Expected: FAIL with "Cannot find module './stripe'".

- [ ] **Step 4: Implement `lib/payments/stripe.ts`**

```ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface CreateStripeCheckoutSessionInput {
  id: number;
  serviceName: string;
  priceUsd: number;
}

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutSessionInput
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: input.serviceName },
          unit_amount: Math.round(input.priceUsd * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: String(input.id) },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pedir/confirmacion?order=${input.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pedir?error=pago_cancelado`,
  });

  return session.url!;
}

export function constructStripeEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export function extractStripeOrderId(event: Stripe.Event): number | null {
  if (event.type !== "checkout.session.completed") {
    return null;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    return null;
  }

  return Number(orderId);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run lib/payments/stripe.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add lib/payments/stripe.ts lib/payments/stripe.test.ts package.json package-lock.json
git commit -m "feat: add Stripe integration"
```

---

### Task 12: Order database queries

**Files:**
- Create: `lib/db/orders.ts`
- Test: `lib/db/orders.db.test.ts`
- Create: `vitest.db.config.ts`

**Interfaces:**
- Consumes: `db`, `orders`, `OrderStatus`, `PaymentProvider` from `lib/db/client.ts` / `lib/db/schema.ts` (Task 5).
- Produces: `CreateOrderInput`, `OrderRecord`, `createOrder(input): Promise<OrderRecord>`, `getOrderById(id): Promise<OrderRecord | undefined>`, `markOrderPaid(id): Promise<OrderRecord | undefined>`. Consumed by Task 13, 14, 15.
- Requires: a reachable Postgres database at `DATABASE_URL` with the Task 5 migration applied (`npx drizzle-kit migrate`). Run `npm run test:db` only after that's set up.

- [ ] **Step 1: Create `vitest.db.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import "dotenv/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.db.test.ts"],
  },
});
```

- [ ] **Step 2: Write the failing tests**

Create `lib/db/orders.db.test.ts`:

```ts
import { describe, it, expect, afterEach, beforeAll } from "vitest";
import { db } from "./client";
import { orders } from "./schema";
import { createOrder, getOrderById, markOrderPaid } from "./orders";

beforeAll(() => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set to a test Postgres database to run lib/db tests"
    );
  }
});

afterEach(async () => {
  await db.delete(orders);
});

describe("createOrder", () => {
  it("creates an order with status pending", async () => {
    const order = await createOrder({
      customerName: "María",
      customerWhatsapp: "+5491122334455",
      serviceId: "carta-consejo",
      question: "¿Cómo me va a ir en el trabajo?",
      paymentProvider: "mercadopago",
    });

    expect(order.id).toBeGreaterThan(0);
    expect(order.status).toBe("pending");
  });
});

describe("getOrderById", () => {
  it("retrieves the order that was just created", async () => {
    const created = await createOrder({
      customerName: "Juan",
      customerWhatsapp: "+5491122334456",
      serviceId: "lectura-2-cartas",
      question: "¿Qué me espera este mes?",
      paymentProvider: "stripe",
    });

    const found = await getOrderById(created.id);

    expect(found?.id).toBe(created.id);
    expect(found?.customerName).toBe("Juan");
  });

  it("returns undefined for a non-existent id", async () => {
    const found = await getOrderById(999999);
    expect(found).toBeUndefined();
  });
});

describe("markOrderPaid", () => {
  it("sets the order status to paid", async () => {
    const created = await createOrder({
      customerName: "Lucía",
      customerWhatsapp: "+5491122334457",
      serviceId: "carta-consejo",
      question: "¿Debo mudarme este año?",
      paymentProvider: "mercadopago",
    });

    const paid = await markOrderPaid(created.id);

    expect(paid?.status).toBe("paid");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test:db`
Expected: FAIL with "Cannot find module './orders'" (assuming `DATABASE_URL` is already set to a reachable test Postgres database; if not, set it first — see Task 18 README).

- [ ] **Step 4: Implement `lib/db/orders.ts`**

```ts
import { eq } from "drizzle-orm";
import { db } from "./client";
import { orders, type OrderStatus, type PaymentProvider } from "./schema";

export interface CreateOrderInput {
  customerName: string;
  customerWhatsapp: string;
  serviceId: string;
  question: string;
  paymentProvider: PaymentProvider;
}

export interface OrderRecord {
  id: number;
  customerName: string;
  customerWhatsapp: string;
  serviceId: string;
  question: string;
  paymentProvider: PaymentProvider;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRecord> {
  const [order] = await db.insert(orders).values(input).returning();
  return order;
}

export async function getOrderById(id: number): Promise<OrderRecord | undefined> {
  return db.query.orders.findFirst({ where: eq(orders.id, id) });
}

export async function markOrderPaid(id: number): Promise<OrderRecord | undefined> {
  const [order] = await db
    .update(orders)
    .set({ status: "paid", updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();
  return order;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test:db`
Expected: PASS, 4 tests. (Requires `DATABASE_URL` set to a reachable Postgres database with the Task 5 migration applied via `npx drizzle-kit migrate`.)

- [ ] **Step 6: Commit**

```bash
git add lib/db/orders.ts lib/db/orders.db.test.ts vitest.db.config.ts package.json
git commit -m "feat: add order database queries"
```

---

### Task 13: `POST /api/orders` route

**Files:**
- Create: `app/api/orders/route.ts`
- Test: `app/api/orders/route.test.ts`

**Interfaces:**
- Consumes: `orderFormSchema` (Task 7), `getService` (Task 6), `createOrder` (Task 12), `createMercadoPagoPreference` (Task 10), `createStripeCheckoutSession` (Task 11).
- Produces: `POST` handler returning `{ redirectUrl: string }` (200) or `{ error }` (400). Consumed by Task 17 (`app/pedir/pedir-form.tsx`).

- [ ] **Step 1: Write the failing tests**

Create `app/api/orders/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db/orders", () => ({ createOrder: vi.fn() }));
vi.mock("@/lib/payments/mercadopago", () => ({ createMercadoPagoPreference: vi.fn() }));
vi.mock("@/lib/payments/stripe", () => ({ createStripeCheckoutSession: vi.fn() }));

import { POST } from "./route";
import { createOrder } from "@/lib/db/orders";
import { createMercadoPagoPreference } from "@/lib/payments/mercadopago";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Ana",
  whatsapp: "+5491122334455",
  serviceId: "carta-consejo",
  question: "¿Cómo me va a ir?",
  paymentProvider: "mercadopago",
};

beforeEach(() => {
  vi.mocked(createOrder).mockReset();
  vi.mocked(createMercadoPagoPreference).mockReset();
  vi.mocked(createStripeCheckoutSession).mockReset();
});

describe("POST /api/orders", () => {
  it("creates an order and returns the Mercado Pago redirect URL", async () => {
    vi.mocked(createOrder).mockResolvedValue({
      id: 1,
      customerName: "Ana",
      customerWhatsapp: "+5491122334455",
      serviceId: "carta-consejo",
      question: "¿Cómo me va a ir?",
      paymentProvider: "mercadopago",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(createMercadoPagoPreference).mockResolvedValue(
      "https://mercadopago.com/checkout/1"
    );

    const response = await POST(makeRequest(validBody));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.redirectUrl).toBe("https://mercadopago.com/checkout/1");
  });

  it("creates an order and returns the Stripe redirect URL", async () => {
    vi.mocked(createOrder).mockResolvedValue({
      id: 2,
      customerName: "Ana",
      customerWhatsapp: "+5491122334455",
      serviceId: "carta-consejo",
      question: "¿Cómo me va a ir?",
      paymentProvider: "stripe",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(createStripeCheckoutSession).mockResolvedValue(
      "https://checkout.stripe.com/session2"
    );

    const response = await POST(makeRequest({ ...validBody, paymentProvider: "stripe" }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.redirectUrl).toBe("https://checkout.stripe.com/session2");
  });

  it("rejects an invalid payload with 400", async () => {
    const response = await POST(makeRequest({ name: "a" }));
    expect(response.status).toBe(400);
    expect(createOrder).not.toHaveBeenCalled();
  });

  it("rejects a serviceId that isn't payable (sesion-en-vivo) via schema validation", async () => {
    const response = await POST(makeRequest({ ...validBody, serviceId: "sesion-en-vivo" }));
    expect(response.status).toBe(400);
    expect(createOrder).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run app/api/orders/route.test.ts`
Expected: FAIL with "Cannot find module './route'".

- [ ] **Step 3: Implement `app/api/orders/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { orderFormSchema } from "@/lib/validation";
import { getService } from "@/lib/services";
import { createOrder } from "@/lib/db/orders";
import { createMercadoPagoPreference } from "@/lib/payments/mercadopago";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = orderFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const service = getService(parsed.data.serviceId)!;

  const order = await createOrder({
    customerName: parsed.data.name,
    customerWhatsapp: parsed.data.whatsapp,
    serviceId: service.id,
    question: parsed.data.question,
    paymentProvider: parsed.data.paymentProvider,
  });

  const redirectUrl =
    parsed.data.paymentProvider === "mercadopago"
      ? await createMercadoPagoPreference({
          id: order.id,
          serviceName: service.name,
          priceArs: service.priceArs!,
        })
      : await createStripeCheckoutSession({
          id: order.id,
          serviceName: service.name,
          priceUsd: service.priceUsd!,
        });

  return NextResponse.json({ redirectUrl });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run app/api/orders/route.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add app/api/orders/route.ts app/api/orders/route.test.ts
git commit -m "feat: add POST /api/orders route"
```

---

### Task 14: Mercado Pago webhook route

**Files:**
- Create: `app/api/payments/mercadopago/webhook/route.ts`
- Test: `app/api/payments/mercadopago/webhook/route.test.ts`

**Interfaces:**
- Consumes: `extractMercadoPagoPaymentId`, `getMercadoPagoPayment` (Task 10), `getOrderById`, `markOrderPaid` (Task 12), `evaluatePaymentConfirmation` (Task 8), `sendOrderNotification` (Task 9), `getService` (Task 6).

- [ ] **Step 1: Write the failing tests**

Create `app/api/payments/mercadopago/webhook/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/payments/mercadopago", () => ({
  extractMercadoPagoPaymentId: vi.fn(),
  getMercadoPagoPayment: vi.fn(),
}));
vi.mock("@/lib/db/orders", () => ({ getOrderById: vi.fn(), markOrderPaid: vi.fn() }));
vi.mock("@/lib/notifications/whatsapp", () => ({ sendOrderNotification: vi.fn() }));

import { POST } from "./route";
import { extractMercadoPagoPaymentId, getMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { getOrderById, markOrderPaid } from "@/lib/db/orders";
import { sendOrderNotification } from "@/lib/notifications/whatsapp";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/payments/mercadopago/webhook", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const order = {
  id: 42,
  customerName: "Ana",
  customerWhatsapp: "+5491122334455",
  serviceId: "carta-consejo",
  question: "¿Cómo me va a ir?",
  paymentProvider: "mercadopago" as const,
  status: "pending" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.mocked(extractMercadoPagoPaymentId).mockReset();
  vi.mocked(getMercadoPagoPayment).mockReset();
  vi.mocked(getOrderById).mockReset();
  vi.mocked(markOrderPaid).mockReset();
  vi.mocked(sendOrderNotification).mockReset();
});

describe("POST /api/payments/mercadopago/webhook", () => {
  it("marks the order paid and notifies Sofía on an approved payment", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue("999");
    vi.mocked(getMercadoPagoPayment).mockResolvedValue({
      status: "approved",
      externalReference: "42",
    });
    vi.mocked(getOrderById).mockResolvedValue(order);

    const response = await POST(makeRequest({ type: "payment", data: { id: "999" } }));

    expect(response.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith(42);
    expect(sendOrderNotification).toHaveBeenCalledWith({
      customerName: "Ana",
      customerWhatsapp: "+5491122334455",
      serviceName: "Carta consejo",
      question: "¿Cómo me va a ir?",
    });
  });

  it("ignores notifications that aren't payments", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue(null);

    const response = await POST(makeRequest({ type: "merchant_order" }));

    expect(response.status).toBe(200);
    expect(getMercadoPagoPayment).not.toHaveBeenCalled();
  });

  it("ignores payments that aren't approved", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue("999");
    vi.mocked(getMercadoPagoPayment).mockResolvedValue({
      status: "pending",
      externalReference: "42",
    });

    const response = await POST(makeRequest({ type: "payment", data: { id: "999" } }));

    expect(response.status).toBe(200);
    expect(markOrderPaid).not.toHaveBeenCalled();
  });

  it("does not notify twice for an order that is already paid", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue("999");
    vi.mocked(getMercadoPagoPayment).mockResolvedValue({
      status: "approved",
      externalReference: "42",
    });
    vi.mocked(getOrderById).mockResolvedValue({ ...order, status: "paid" });

    const response = await POST(makeRequest({ type: "payment", data: { id: "999" } }));

    expect(response.status).toBe(200);
    expect(markOrderPaid).not.toHaveBeenCalled();
    expect(sendOrderNotification).not.toHaveBeenCalled();
  });

  it("logs and still returns 200 when the WhatsApp notification fails", async () => {
    vi.mocked(extractMercadoPagoPaymentId).mockReturnValue("999");
    vi.mocked(getMercadoPagoPayment).mockResolvedValue({
      status: "approved",
      externalReference: "42",
    });
    vi.mocked(getOrderById).mockResolvedValue(order);
    vi.mocked(sendOrderNotification).mockRejectedValue(new Error("Twilio down"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(makeRequest({ type: "payment", data: { id: "999" } }));

    expect(response.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith(42);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run app/api/payments/mercadopago/webhook/route.test.ts`
Expected: FAIL with "Cannot find module './route'".

- [ ] **Step 3: Implement `app/api/payments/mercadopago/webhook/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { extractMercadoPagoPaymentId, getMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { getOrderById, markOrderPaid } from "@/lib/db/orders";
import { evaluatePaymentConfirmation } from "@/lib/payments/confirm-order";
import { sendOrderNotification } from "@/lib/notifications/whatsapp";
import { getService } from "@/lib/services";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const paymentId = extractMercadoPagoPaymentId(body);

  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  const payment = await getMercadoPagoPayment(paymentId);

  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const orderId = Number(payment.externalReference);
  const order = await getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ ok: true });
  }

  const decision = evaluatePaymentConfirmation({ status: order.status });

  if (decision.alreadyProcessed) {
    return NextResponse.json({ ok: true });
  }

  await markOrderPaid(order.id);

  if (decision.shouldNotify) {
    const service = getService(order.serviceId)!;
    try {
      await sendOrderNotification({
        customerName: order.customerName,
        customerWhatsapp: order.customerWhatsapp,
        serviceName: service.name,
        question: order.question,
      });
    } catch (error) {
      console.error(`Failed to notify Sofía for order ${order.id}:`, error);
    }
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run app/api/payments/mercadopago/webhook/route.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add app/api/payments/mercadopago/webhook/route.ts app/api/payments/mercadopago/webhook/route.test.ts
git commit -m "feat: add Mercado Pago webhook route"
```

---

### Task 15: Stripe webhook route

**Files:**
- Create: `app/api/payments/stripe/webhook/route.ts`
- Test: `app/api/payments/stripe/webhook/route.test.ts`

**Interfaces:**
- Consumes: `constructStripeEvent`, `extractStripeOrderId` (Task 11), `getOrderById`, `markOrderPaid` (Task 12), `evaluatePaymentConfirmation` (Task 8), `sendOrderNotification` (Task 9), `getService` (Task 6).

- [ ] **Step 1: Write the failing tests**

Create `app/api/payments/stripe/webhook/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/payments/stripe", () => ({
  constructStripeEvent: vi.fn(),
  extractStripeOrderId: vi.fn(),
}));
vi.mock("@/lib/db/orders", () => ({ getOrderById: vi.fn(), markOrderPaid: vi.fn() }));
vi.mock("@/lib/notifications/whatsapp", () => ({ sendOrderNotification: vi.fn() }));

import { POST } from "./route";
import { constructStripeEvent, extractStripeOrderId } from "@/lib/payments/stripe";
import { getOrderById, markOrderPaid } from "@/lib/db/orders";
import { sendOrderNotification } from "@/lib/notifications/whatsapp";

function makeRequest(body: string, signature: string | null) {
  const headers = new Headers();
  if (signature) headers.set("stripe-signature", signature);
  return new NextRequest("http://localhost/api/payments/stripe/webhook", {
    method: "POST",
    body,
    headers,
  });
}

const order = {
  id: 42,
  customerName: "Ana",
  customerWhatsapp: "+5491122334455",
  serviceId: "carta-consejo",
  question: "¿Cómo me va a ir?",
  paymentProvider: "stripe" as const,
  status: "pending" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.mocked(constructStripeEvent).mockReset();
  vi.mocked(extractStripeOrderId).mockReset();
  vi.mocked(getOrderById).mockReset();
  vi.mocked(markOrderPaid).mockReset();
  vi.mocked(sendOrderNotification).mockReset();
});

describe("POST /api/payments/stripe/webhook", () => {
  it("rejects a request without a signature header", async () => {
    const response = await POST(makeRequest("{}", null));
    expect(response.status).toBe(400);
  });

  it("rejects a request with an invalid signature", async () => {
    vi.mocked(constructStripeEvent).mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const response = await POST(makeRequest("{}", "bad-signature"));
    expect(response.status).toBe(400);
  });

  it("marks the order paid and notifies Sofía on checkout.session.completed", async () => {
    vi.mocked(constructStripeEvent).mockReturnValue({ type: "checkout.session.completed" } as any);
    vi.mocked(extractStripeOrderId).mockReturnValue(42);
    vi.mocked(getOrderById).mockResolvedValue(order);

    const response = await POST(makeRequest("{}", "good-signature"));

    expect(response.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith(42);
    expect(sendOrderNotification).toHaveBeenCalledWith({
      customerName: "Ana",
      customerWhatsapp: "+5491122334455",
      serviceName: "Carta consejo",
      question: "¿Cómo me va a ir?",
    });
  });

  it("does not notify twice for an order that is already paid", async () => {
    vi.mocked(constructStripeEvent).mockReturnValue({ type: "checkout.session.completed" } as any);
    vi.mocked(extractStripeOrderId).mockReturnValue(42);
    vi.mocked(getOrderById).mockResolvedValue({ ...order, status: "paid" });

    const response = await POST(makeRequest("{}", "good-signature"));

    expect(response.status).toBe(200);
    expect(markOrderPaid).not.toHaveBeenCalled();
    expect(sendOrderNotification).not.toHaveBeenCalled();
  });

  it("ignores irrelevant event types", async () => {
    vi.mocked(constructStripeEvent).mockReturnValue({ type: "payment_intent.created" } as any);
    vi.mocked(extractStripeOrderId).mockReturnValue(null);

    const response = await POST(makeRequest("{}", "good-signature"));

    expect(response.status).toBe(200);
    expect(getOrderById).not.toHaveBeenCalled();
  });

  it("logs and still returns 200 when the WhatsApp notification fails", async () => {
    vi.mocked(constructStripeEvent).mockReturnValue({ type: "checkout.session.completed" } as any);
    vi.mocked(extractStripeOrderId).mockReturnValue(42);
    vi.mocked(getOrderById).mockResolvedValue(order);
    vi.mocked(sendOrderNotification).mockRejectedValue(new Error("Twilio down"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(makeRequest("{}", "good-signature"));

    expect(response.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith(42);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run app/api/payments/stripe/webhook/route.test.ts`
Expected: FAIL with "Cannot find module './route'".

- [ ] **Step 3: Implement `app/api/payments/stripe/webhook/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { constructStripeEvent, extractStripeOrderId } from "@/lib/payments/stripe";
import { getOrderById, markOrderPaid } from "@/lib/db/orders";
import { evaluatePaymentConfirmation } from "@/lib/payments/confirm-order";
import { sendOrderNotification } from "@/lib/notifications/whatsapp";
import { getService } from "@/lib/services";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Falta la firma" }, { status: 400 });
  }

  let event;
  try {
    event = constructStripeEvent(payload, signature);
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  const orderId = extractStripeOrderId(event);

  if (orderId === null) {
    return NextResponse.json({ ok: true });
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ ok: true });
  }

  const decision = evaluatePaymentConfirmation({ status: order.status });

  if (decision.alreadyProcessed) {
    return NextResponse.json({ ok: true });
  }

  await markOrderPaid(order.id);

  if (decision.shouldNotify) {
    const service = getService(order.serviceId)!;
    try {
      await sendOrderNotification({
        customerName: order.customerName,
        customerWhatsapp: order.customerWhatsapp,
        serviceName: service.name,
        question: order.question,
      });
    } catch (error) {
      console.error(`Failed to notify Sofía for order ${order.id}:`, error);
    }
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run app/api/payments/stripe/webhook/route.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add app/api/payments/stripe/webhook/route.ts app/api/payments/stripe/webhook/route.test.ts
git commit -m "feat: add Stripe webhook route"
```

---

### Task 16: Landing page

**Files:**
- Create: `lib/whatsapp-link.ts`
- Test: `lib/whatsapp-link.test.ts`
- Create: `components/landing/hero.tsx`
- Create: `components/landing/about-sofia.tsx`
- Create: `components/landing/services.tsx`
- Create: `components/landing/footer.tsx`
- Test: `components/landing/services.test.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `listServices`, `isPayable`, `Service` (Task 6), shadcn `Button`/`Card` (Task 2), `motion` from `framer-motion` (Task 3).
- Produces: `buildWhatsAppLink(phoneNumber, message): string`, and the landing page composed in `app/page.tsx`.
- Requires env var: `NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER` (digits only, no `+`, e.g. `5491122334455`).

- [ ] **Step 1: Write the failing test for the WhatsApp link helper**

Create `lib/whatsapp-link.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildWhatsAppLink } from "./whatsapp-link";

describe("buildWhatsAppLink", () => {
  it("builds a wa.me URL with the encoded message", () => {
    const url = buildWhatsAppLink("5491122334455", "Hola Sofía!");
    expect(url).toBe("https://wa.me/5491122334455?text=Hola%20Sof%C3%ADa!");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/whatsapp-link.test.ts`
Expected: FAIL with "Cannot find module './whatsapp-link'".

- [ ] **Step 3: Implement `lib/whatsapp-link.ts`**

```ts
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/whatsapp-link.test.ts`
Expected: PASS, 1 test.

- [ ] **Step 5: Create `components/landing/hero.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-display text-5xl text-primary sm:text-7xl"
      >
        Tarot aquí
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 max-w-md text-lg text-foreground/80"
      >
        Lecturas de tarot con Sofía, online y a tu ritmo.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-10"
      >
        <Button asChild size="lg">
          <Link href="/pedir">Pedir lectura</Link>
        </Button>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 6: Create `components/landing/about-sofia.tsx`**

```tsx
export function AboutSofia() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <h2 className="font-display text-3xl text-primary">Sobre Sofía</h2>
      <p className="mt-4 text-foreground/80">
        Sofía lee tarot hace varios años, acompañando a quienes la consultan con
        honestidad y calidez. Cada lectura es un espacio para pensar una pregunta
        puntual o lo que estás atravesando, con las cartas como guía.
      </p>
    </section>
  );
}
```

- [ ] **Step 7: Create `components/landing/services.tsx`**

```tsx
import Link from "next/link";
import { listServices, isPayable } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/whatsapp-link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export function Services() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER!;

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="font-display text-center text-3xl text-primary">Servicios</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {listServices().map((service) => (
          <Card key={service.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col items-start gap-3">
              <p className="font-display text-xl text-primary">
                {isPayable(service)
                  ? `$${service.priceArs} ARS / $${service.priceUsd} USD`
                  : "A coordinar"}
              </p>
              {isPayable(service) ? (
                <Button asChild>
                  <Link href={`/pedir?servicio=${service.id}`}>Pedir lectura</Link>
                </Button>
              ) : (
                <Button asChild>
                  <a
                    href={buildWhatsAppLink(
                      whatsappNumber,
                      `Hola Sofía, quiero coordinar una sesión en vivo de tarot.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Consultar por WhatsApp
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Create `components/landing/footer.tsx`**

```tsx
import { buildWhatsAppLink } from "@/lib/whatsapp-link";

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER!;

  return (
    <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
      <a
        href={buildWhatsAppLink(whatsappNumber, "Hola Sofía!")}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Escribir por WhatsApp
      </a>
      <p className="mt-2">Tarot aquí 🔑 — lecturas de tarot online</p>
    </footer>
  );
}
```

- [ ] **Step 9: Write a rendering test for the services section**

Create `components/landing/services.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Services } from "./services";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER = "5491122334455";
});

describe("Services", () => {
  it("renders all three services with the right call to action", () => {
    render(<Services />);

    expect(screen.getByText("Carta consejo")).toBeInTheDocument();
    expect(screen.getByText("Lectura de 2 o más cartas")).toBeInTheDocument();
    expect(screen.getByText("Sesión en vivo")).toBeInTheDocument();
    expect(screen.getAllByText("Pedir lectura")).toHaveLength(2);
    expect(screen.getByText("Consultar por WhatsApp")).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npx vitest run components/landing/services.test.tsx`
Expected: PASS, 1 test.

- [ ] **Step 11: Assemble the landing page in `app/page.tsx`**

```tsx
import { Hero } from "@/components/landing/hero";
import { AboutSofia } from "@/components/landing/about-sofia";
import { Services } from "@/components/landing/services";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSofia />
      <Services />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 12: Verify manually in the browser**

Run: `npm run dev`
Open `http://localhost:3000` and confirm: the hero fades in, the three services render with correct prices, the "Pedir lectura" buttons link to `/pedir?servicio=...`, and the "Consultar por WhatsApp" / footer links open a WhatsApp chat with a prefilled message.
Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 13: Commit**

```bash
git add lib/whatsapp-link.ts lib/whatsapp-link.test.ts components/landing app/page.tsx
git commit -m "feat: build landing page"
```

---

### Task 17: Order flow pages

**Files:**
- Create: `app/pedir/page.tsx`
- Create: `app/pedir/pedir-form.tsx`
- Create: `app/pedir/confirmacion/page.tsx`
- Create: `app/pedir/confirmacion/confirmacion-content.tsx`
- Test: `app/pedir/pedir-form.test.tsx`
- Test: `app/pedir/confirmacion/confirmacion-content.test.tsx`

**Interfaces:**
- Consumes: `orderFormSchema`, `OrderFormInput` (Task 7), `listPayableServices`, `PayableServiceId` (Task 6), shadcn `Button`/`Input`/`Textarea`/`Label`/`RadioGroup` (Task 2), `POST /api/orders` (Task 13).

- [ ] **Step 1: Install React Hook Form and its Zod resolver**

Run: `npm install react-hook-form @hookform/resolvers`

- [ ] **Step 2: Write the failing test for the order form**

Create `app/pedir/pedir-form.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
}));

import PedirForm from "./pedir-form";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

describe("PedirForm", () => {
  it("renders both payable services and the payment methods", () => {
    render(<PedirForm />);

    expect(screen.getByText(/Carta consejo/)).toBeInTheDocument();
    expect(screen.getByText(/Lectura de 2 o más cartas/)).toBeInTheDocument();
    expect(screen.getByLabelText("Mercado Pago")).toBeInTheDocument();
    expect(screen.getByLabelText("Tarjeta (Stripe)")).toBeInTheDocument();
  });

  it("shows a validation error when submitting an empty form", async () => {
    render(<PedirForm />);

    await userEvent.click(screen.getByRole("button", { name: /Pagar y enviar consulta/ }));

    expect(await screen.findByText(/Ingresá tu nombre completo/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run app/pedir/pedir-form.test.tsx`
Expected: FAIL with "Cannot find module './pedir-form'".

- [ ] **Step 4: Implement `app/pedir/pedir-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, type OrderFormInput } from "@/lib/validation";
import { listPayableServices, type PayableServiceId } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PedirForm() {
  const searchParams = useSearchParams();
  const services = listPayableServices();
  const requestedService = searchParams.get("servicio");
  const defaultServiceId: PayableServiceId = services.some((s) => s.id === requestedService)
    ? (requestedService as PayableServiceId)
    : services[0].id;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      serviceId: defaultServiceId,
      paymentProvider: "mercadopago",
    },
  });

  async function onSubmit(data: OrderFormInput) {
    setSubmitError(null);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setSubmitError("No pudimos procesar tu pedido. Intentá de nuevo.");
      return;
    }

    const { redirectUrl } = await response.json();
    window.location.href = redirectUrl;
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-4xl text-primary">Pedí tu lectura</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <Label>Servicio</Label>
          <Controller
            control={control}
            name="serviceId"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="mt-2">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center gap-2">
                    <RadioGroupItem value={service.id} id={service.id} />
                    <Label htmlFor={service.id}>
                      {service.name} — ${service.priceArs} ARS / ${service.priceUsd} USD
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp (con código de país)</Label>
          <Input id="whatsapp" placeholder="+5491122334455" {...register("whatsapp")} />
          {errors.whatsapp && (
            <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="question">Tu consulta</Label>
          <Textarea id="question" {...register("question")} />
          {errors.question && (
            <p className="text-sm text-destructive">{errors.question.message}</p>
          )}
        </div>

        <div>
          <Label>Método de pago</Label>
          <Controller
            control={control}
            name="paymentProvider"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="mt-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="mercadopago" id="mercadopago" />
                  <Label htmlFor="mercadopago">Mercado Pago</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe">Tarjeta (Stripe)</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Pagar y enviar consulta"}
        </Button>
      </form>
    </main>
  );
}
```

- [ ] **Step 5: Create `app/pedir/page.tsx`**

```tsx
import { Suspense } from "react";
import PedirForm from "./pedir-form";

export default function PedirPage() {
  return (
    <Suspense>
      <PedirForm />
    </Suspense>
  );
}
```

- [ ] **Step 6: Run the form test to verify it passes**

Run: `npx vitest run app/pedir/pedir-form.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 7: Write the failing test for the confirmation page**

Create `app/pedir/confirmacion/confirmacion-content.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("order=42"),
}));

import ConfirmacionContent from "./confirmacion-content";

describe("ConfirmacionContent", () => {
  it("shows the thank-you message with the order number", () => {
    render(<ConfirmacionContent />);

    expect(screen.getByText(/Gracias por tu pedido/)).toBeInTheDocument();
    expect(screen.getByText(/pedido #42/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `npx vitest run app/pedir/confirmacion/confirmacion-content.test.tsx`
Expected: FAIL with "Cannot find module './confirmacion-content'".

- [ ] **Step 9: Implement `app/pedir/confirmacion/confirmacion-content.tsx`**

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl text-primary">¡Gracias por tu pedido!</h1>
      <p className="mt-4 text-foreground/80">
        Recibimos tu pago{orderId ? ` (pedido #${orderId})` : ""}. Sofía va a leer tu
        consulta y te va a responder por WhatsApp con la foto de las cartas y su
        interpretación en las próximas 24 a 48 horas.
      </p>
      <Link href="/" className="mt-8 inline-block text-primary underline">
        Volver al inicio
      </Link>
    </main>
  );
}
```

- [ ] **Step 10: Create `app/pedir/confirmacion/page.tsx`**

```tsx
import { Suspense } from "react";
import ConfirmacionContent from "./confirmacion-content";

export default function ConfirmacionPage() {
  return (
    <Suspense>
      <ConfirmacionContent />
    </Suspense>
  );
}
```

- [ ] **Step 11: Run the test to verify it passes**

Run: `npx vitest run app/pedir/confirmacion/confirmacion-content.test.tsx`
Expected: PASS, 1 test.

- [ ] **Step 12: Verify manually in the browser**

Run: `npm run dev`
Open `http://localhost:3000/pedir`, fill the form with invalid data and confirm validation errors show; open `http://localhost:3000/pedir/confirmacion?order=1` and confirm the message renders correctly.
Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 13: Commit**

```bash
git add app/pedir package.json package-lock.json
git commit -m "feat: build order flow pages"
```

---

### Task 18: Environment variables and README

**Files:**
- Modify: `.env.example`
- Create: `README.md`

**Interfaces:**
- Produces: a documented list of every environment variable introduced in Tasks 5, 9, 10, 11, 16, and setup/run/test/deploy instructions for Nicolás.

- [ ] **Step 1: Complete `.env.example`**

```
# Base de datos (Neon Postgres)
DATABASE_URL=

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# WhatsApp (Twilio) - aviso de pedidos a Sofía
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
SOFIA_WHATSAPP_NUMBER=whatsapp:+549XXXXXXXXXX

# WhatsApp público (botones "contactar" en el sitio, formato wa.me: solo números, sin +)
NEXT_PUBLIC_SOFIA_WHATSAPP_NUMBER=549XXXXXXXXXX

# URL pública del sitio (usada en links de pago y webhooks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 2: Create `README.md`**

```markdown
# Tarot aquí

Sitio web de Sofía para vender lecturas de tarot online. Ver el diseño completo en
`docs/superpowers/specs/2026-11-04-tarot-aqui-website-design.md`.

## Desarrollo local

1. `npm install`
2. Copiar `.env.example` a `.env.local` y completar las variables (ver abajo).
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
```

- [ ] **Step 3: Verify the project still builds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add .env.example README.md
git commit -m "docs: document environment variables and setup"
```
