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
