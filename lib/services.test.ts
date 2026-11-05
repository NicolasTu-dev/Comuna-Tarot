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
