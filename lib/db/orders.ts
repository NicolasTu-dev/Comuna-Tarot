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
