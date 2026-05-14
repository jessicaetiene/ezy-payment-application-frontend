import React, { useState } from "react";

const API_URL = "http://localhost:8080";

type PaymentRequest = {
  firstName: string;
  lastName: string;
  zipCode: string;
  cardNumber: string;
};

type WebhookRequest = {
  url: string;
};

type BackendResponse = Record<string, unknown>;

type InputProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const initialPayment: PaymentRequest = {
  firstName: "",
  lastName: "",
  zipCode: "",
  cardNumber: "",
};

const initialWebhook: WebhookRequest = {
  url: "",
};

function onlyNumbers(value: string): string {
  return value.replace(/\D/g, "");
}

function formatZipCode(value: string): string {
  const numbers = onlyNumbers(value).slice(0, 8);

  if (numbers.length <= 5) {
    return numbers;
  }

  return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
}

function formatCardNumber(value: string): string {
  const numbers = onlyNumbers(value).slice(0, 16);

  return numbers.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export default function SimplePaymentReactLayout() {
  const [payment, setPayment] = useState<PaymentRequest>(initialPayment);
  const [webhook, setWebhook] = useState<WebhookRequest>(initialWebhook);
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<BackendResponse | null>(null);

  function handlePaymentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "zipCode") {
      setPayment((currentPayment) => ({
        ...currentPayment,
        zipCode: formatZipCode(value),
      }));
      return;
    }

    if (name === "cardNumber") {
      setPayment((currentPayment) => ({
        ...currentPayment,
        cardNumber: formatCardNumber(value),
      }));
      return;
    }

    setPayment((currentPayment) => ({
      ...currentPayment,
      [name]: value,
    }));
  }

  function handleWebhookChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setWebhook((currentWebhook) => ({
      ...currentWebhook,
      [name]: value,
    }));
  }

  async function readResponseBody(result: Response): Promise<BackendResponse> {
    const contentType = result.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await result.json();
    }

    return {
      message: await result.text(),
    };
  }

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return "Unexpected error.";
  }

  function isPaymentFormValid(): boolean {
    const zipCodeRegex = /^\d{5}-\d{3}$/;
    const cardNumberRegex = /^\d{4} \d{4} \d{4} \d{4}$/;

    return (
      payment.firstName.trim().length > 0 &&
      payment.lastName.trim().length > 0 &&
      zipCodeRegex.test(payment.zipCode) &&
      cardNumberRegex.test(payment.cardNumber)
    );
  }

  async function submitPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Creating payment...");
    setResponse(null);

    if (!isPaymentFormValid()) {
      setMessage("Please fill zip code as 01234-567 and card number as 0000 0000 0000 0000.");
      return;
    }

    try {
      const result = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });

      const data = await readResponseBody(result);

      if (!result.ok) {
        throw new Error(String(data.message || "Error creating payment"));
      }

      setMessage("Payment created successfully.");
      setResponse(data);
      setPayment(initialPayment);
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  }

  async function submitWebhook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Registering webhook...");
    setResponse(null);

    try {
      const result = await fetch(`${API_URL}/webhooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhook),
      });

      const data = await readResponseBody(result);

      if (!result.ok) {
        throw new Error(String(data.message || "Error registering webhook"));
      }

      setMessage("Webhook registered successfully.");
      setResponse(data);
      setWebhook(initialWebhook);
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Payment Application</h1>
          <p className="mt-2 text-slate-600">Simple UI to test payments and dynamic webhooks.</p>
        </header>

        {message && (
          <div className="mb-6 rounded-xl bg-white p-4 text-center text-sm font-medium text-slate-700 shadow">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-1 text-xl font-semibold text-slate-900">Create Payment</h2>
            <p className="mb-6 text-sm text-slate-500">The backend encrypts the card number before saving.</p>

            <form onSubmit={submitPayment} className="space-y-4">
              <Input label="First name" name="firstName" value={payment.firstName} onChange={handlePaymentChange} placeholder="Jessica" />
              <Input label="Last name" name="lastName" value={payment.lastName} onChange={handlePaymentChange} placeholder="Almeida" />
              <Input label="Zip code" name="zipCode" value={payment.zipCode} onChange={handlePaymentChange} placeholder="01234-567" maxLength={9} inputMode="numeric" />
              <Input label="Card number" name="cardNumber" value={payment.cardNumber} onChange={handlePaymentChange} placeholder="0000 0000 0000 0000" maxLength={19} inputMode="numeric" />

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700"
              >
                Create Payment
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-1 text-xl font-semibold text-slate-900">Register Webhook</h2>
            <p className="mb-6 text-sm text-slate-500">The backend will call this URL after each payment.</p>

            <form onSubmit={submitWebhook} className="space-y-4">
              <Input label="Webhook URL" name="url" value={webhook.url} onChange={handleWebhookChange} placeholder="https://webhook.site/your-id" />

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500"
              >
                Register Webhook
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900">
              Tip: use webhook.site to generate a test URL and see the POST request from your backend.
            </div>
          </section>
        </div>

        {response && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Backend Response</h2>
            <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
              {JSON.stringify(response, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </main>
  );
}

function Input({ label, name, value, onChange, placeholder, maxLength, inputMode }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        required
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}
