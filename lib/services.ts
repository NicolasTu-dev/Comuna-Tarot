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
