# Ezy Payment Application Frontend

React + TypeScript frontend for a small payment test application. The UI lets a user create payment records and register webhook URLs against a backend API that is expected to run locally on port `8080`.

## What this application does

The app renders a single page with two workflows:

1. **Create Payment**
   - Collects first name, last name, ZIP code, and card number.
   - Formats ZIP code input as `01234-567`.
   - Formats card number input as `0000 0000 0000 0000`.
   - Validates that all required fields are filled before submitting.
   - Sends the payment payload to `POST http://localhost:8080/payments`.


2. **Register Webhook**
   - Collects a webhook URL.
   - Sends the webhook payload to `POST http://localhost:8080/webhooks`.
   - Shows the backend response in a formatted JSON block.

The page also displays status messages while requests are running and after successful or failed responses.

## Project structure
```text
.
├── index.html                 # Vite HTML entry point
├── package.json               # npm scripts and dependencies
├── vite.config.ts             # Vite configuration with React and Tailwind plugins
├── eslint.config.js           # ESLint flat config
├── tsconfig*.json             # TypeScript project references and compiler options
├── public/
│   ├── favicon.svg            # Browser favicon
│   └── icons.svg              # Public icon sprite/assets
└── src/
    ├── main.tsx               # React root mounting and global CSS import
    ├── App.tsx                # Top-level app component
    ├── index.css              # Tailwind CSS import
    ├── App.css                # Legacy/template CSS currently not imported by the app
    ├── assets/                # Static image assets
    ├── components/Input.tsx   # Reusable input component, currently not imported by HomePage
    ├── pages/HomePage.tsx     # Main payment and webhook UI plus request handling
    ├── service/api.ts         # API helper functions for payments and webhooks
    └── types/                 # Shared payment and webhook TypeScript interfaces
```

### Backend API expectations

The frontend currently assumes the backend base URL is:

```text
http://localhost:8080
```

The main page calls these endpoints directly:

| Action | Method | URL | Payload |
| --- | --- | --- | --- |
| Create payment | `POST` | `http://localhost:8080/payments` | `{ firstName, lastName, zipCode, cardNumber }` |
| Register webhook | `POST` | `http://localhost:8080/webhooks` | `{ url }` |

`src/service/api.ts` also defines `createPayment` and `createWebhook` helper functions for the same endpoints, but the current `HomePage` implementation performs `fetch` calls inline instead of importing those helpers.

### Type definitions

The project includes shared interfaces under `src/types`:

- `PaymentRequest` and `PaymentResponse` in `src/types/payment.ts`.
- `WebhookRequest` and `WebhookResponse` in `src/types/webhook.ts`.

At the moment, `HomePage` declares local request/response types instead of importing these shared interfaces.

### Styling

Tailwind CSS is enabled through `@tailwindcss/vite` in `vite.config.ts` and imported from `src/index.css` with:

```css
@import "tailwindcss";
```

Most styling is applied with Tailwind utility classes directly inside JSX.

`src/App.css` appears to be leftover starter/template CSS and is not currently imported by the app entry point or components.

## Prerequisites

Install the following before running the project:

- **Node.js**: use a current version that supports Vite 8 and TypeScript 6. Node.js 20 or newer is recommended.
- **npm**: included with Node.js.
- **Backend API**: start the matching backend service on `http://localhost:8080` before testing payment or webhook submissions.

## Install dependencies

From the repository root, install packages with the lockfile:

```bash
npm install
```

For clean/reproducible installs in CI, use:

```bash
npm ci
```

## Run the application locally

1. Start the backend API on port `8080`.
2. Start the frontend dev server:

```bash
npm run dev
```

3. Open the URL printed by Vite in your terminal. By default, Vite commonly serves the app at:

```text
http://localhost:5173
```

4. Use the forms:
   - Create a payment with a ZIP code like `01234-567` and a card number like `0000 0000 0000 0000`.
   - Register a webhook URL. You can use a temporary URL from a service such as `webhook.site` to inspect backend webhook deliveries.

