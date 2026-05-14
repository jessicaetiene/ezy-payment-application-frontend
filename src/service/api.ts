const API_URL = "http://localhost:8080";

export async function createPayment(payload: unknown) {
  const response = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response;
}

export async function createWebhook(payload: unknown) {
  const response = await fetch(`${API_URL}/webhooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response;
}