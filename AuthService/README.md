# AuthService

Handles accounts and sits in front of the other services as the API gateway — it's the only thing a client ever talks to directly.

## What it does

- Signup and signin, passwords hashed with bcrypt
- Issues JWT access tokens and refresh tokens
- Role-based access control (USER, OWNER, ADMIN)
- Rate limits signup/signin
- Proxies everything under `/api/v1/hotels` and `/api/v1/bookings` to HotelService and BookingService

## Endpoints

| Method | Path                       | Auth                 | Description                                                      |
| ------ | -------------------------- | -------------------- | ---------------------------------------------------------------- |
| POST   | /api/v1/auth/signup        | none (rate-limited)  | create an account                                                |
| POST   | /api/v1/auth/signin        | none (rate-limited)  | sign in, returns an access token and sets a refresh token cookie |
| POST   | /api/v1/auth/logout        | USER / OWNER / ADMIN | clears the refresh token                                         |
| POST   | /api/v1/auth/refresh-token | USER / OWNER / ADMIN | issues a new access token                                        |
| GET    | /api/v1/auth/me            | USER / OWNER / ADMIN | current user's profile                                           |
| DELETE | /api/v1/auth/me            | USER / OWNER / ADMIN | delete own account                                               |
| GET    | /api/v1/auth/users         | ADMIN                | list all users                                                   |

Everything under `/api/v1/hotels` and `/api/v1/bookings` gets proxied straight through to HotelService and BookingService. Auth for those routes is enforced on the other end, not here.

## Environment variables

See `.env.example`. `ACCESS_TOKEN_SECRET` has to be identical here, in HotelService, and in BookingService — all three verify the same tokens.

## Running locally

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Runs on port 3001 by default.

## Depends on

HotelService and BookingService need to be reachable for the proxy routes to work — see `HOTEL_SERVICE_URL` and `BOOKING_SERVICE_URL` in `.env`.
