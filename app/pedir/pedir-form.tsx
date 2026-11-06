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
import { motion } from "framer-motion";
import { StarField } from "@/components/landing/star-field";
import { revealVariants } from "@/lib/motion-variants";

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
    <main className="relative mx-auto max-w-xl px-6 py-16">
      <StarField />
      <motion.div
        variants={revealVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <h1 className="font-display text-4xl font-semibold text-primary">Pedí tu lectura</h1>
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
      </motion.div>
    </main>
  );
}
