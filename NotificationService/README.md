# NotificationService

Sends transactional email. There's no API for it — other services drop a job on a shared Redis queue, and a BullMQ worker here picks it up and sends it through Resend.

## What it does

- Runs a BullMQ worker that consumes jobs from the shared email queue
- Sends the email through Resend, using a template with variables filled in from the job data
- No real API surface beyond a health check — everything comes in through the queue

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/v1/ping/health | none | health check |

## Environment variables

See `.env.example`. `RESEND_API_KEY` comes from your Resend account.

## Running locally

```bash
cp .env.example .env
npm install
npm run dev
```

Runs on port 3003 by default. Needs Redis to receive jobs from the queue, and a Resend account with the templates it references already created — see BookingService's README for which template it expects.

## Depends on

Redis, for the job queue. Resend, for actually sending email.
