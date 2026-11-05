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
