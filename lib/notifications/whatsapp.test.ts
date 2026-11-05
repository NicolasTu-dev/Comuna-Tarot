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
