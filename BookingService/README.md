# BookingService

Owns the booking lifecycle — creating a booking and confirming it are two separate steps, both built to survive concurrent requests.

## What it does

- Creates and confirms bookings
- Takes a Redlock scoped to the hotel before claiming rooms, so two requests for the same dates can't both succeed
- Claims rooms on HotelService with a conditional update, and rolls back cleanly if it loses that race
- Confirmation is idempotent — a row lock and a `finalized` flag mean a retried confirm can't double-process the same booking
- Queues the confirmation email once a booking is confirmed

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/v1/health | none | health check |
| POST | /api/v1/bookings | USER / OWNER / ADMIN | create a booking, returns a booking id and an idempotency key |
| POST | /api/v1/bookings/:idempotencyKey | USER / OWNER / ADMIN | confirm a booking |

## Environment variables

See `.env.example`. `ACCESS_TOKEN_SECRET` has to match AuthService and HotelService; `INTERNAL_API_KEY` has to match HotelService. `HOTEL_SERVICE_URL` points at HotelService's rooms API, not its hotels API — easy mixup.

## Running locally

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Runs on port 3005 by default.

## Depends on

HotelService, for availability lookups and room claims. Redis, for the distributed lock and the email queue.
