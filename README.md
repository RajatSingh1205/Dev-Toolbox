# Dev Toolbox

A growing set of small developer utilities, with no login and nothing to install. Right now you can **format and validate JSON** and **share it through a link that expires when you decide**. Every link you create is saved to a private, anonymous session, so you can come back to your history without creating an account.

**Live demo:** https://YOUR-APP.vercel.app

> ⏳ The backend runs on a free tier that sleeps when idle. If the site seems stuck, give the first request about a minute to wake the server up. After that it's fast.

![Dev Toolbox screenshot](docs/screenshot.png)

## Features

- **JSON editor** with live validation, one-click prettify and minify, and copy (Monaco editor)
- **Shareable links** with a name and a custom or preset expiry. Expired links return a "not found" page
- **Link history without login**: history is tied to an anonymous session code stored in your browser. Copy the code to see the same history on another device
- **Auto-expiry**: Redis TTLs delete expired data, backed by a scheduled cleanup and an expiry check on every read
- Responsive dark UI

## Coming soon

- JSON → XML converter
- XML → JSON converter
- JSON compare (diff two documents)
- More converters and utilities

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Monaco Editor, Lucide icons |
| Backend | Java 17, Spring Boot, Spring Data JPA, Lombok |
| Database | PostgreSQL |
| Cache / expiry | Redis (key TTLs and keyspace expiry events) |
| Hosting | Vercel (frontend), Render (backend), Neon (Postgres), Upstash (Redis) |

## How it works

1. The browser creates a random UUID on first visit and stores it in `localStorage`.
2. Every API call sends it in an `X-Session-Id` header. The backend validates it and scopes link history to it. There is no Spring Security and no user accounts.
3. When a link is created, the JSON is saved in Postgres and a key with a TTL is set in Redis.
4. When the Redis key expires, a keyspace-event listener deletes the JSON and marks the history entry as expired.
5. Because expiry events can be missed (for example while a free-tier server is asleep), a scheduled job runs every 10 minutes as a safety net, and expired links are never served on read.

> A session code is not a password. Anyone who has it can see that history. Don't store sensitive data in shared links.

## API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/json/create?name=&expirationMinutes=` | Create a share link (JSON body). Needs `X-Session-Id` |
| `GET` | `/api/json/{id}` | Fetch a shared JSON. Returns 404 if missing or expired |
| `GET` | `/api/links/history` | List the session's links, newest first |
| `DELETE` | `/api/links/history/{id}` | Remove one entry from the session's history |
| `DELETE` | `/api/links/history` | Clear the session's history |

## Project structure

```
Dev-Toolbox/
├── Dev-Toolbox/            # React + Vite frontend
│   └── src/
│       ├── components/     # Landing, editor, history, share view, navbar
│       └── lib/api.js      # API helper and session ID handling
└── backend/Dev-Toolbox/    # Spring Boot backend
    └── src/main/java/com/example/Dev_Toolbox/
        ├── controllers/    # REST endpoints
        ├── services/       # Share logic and expiry cleanup
        ├── config/         # CORS and Redis listener
        ├── entity/         # JPA entities
        └── repository/     # Spring Data repositories
```

## Run locally

**Prerequisites:** Java 17, Node.js 18+, PostgreSQL, Redis.

**1. Start Postgres and Redis** (Docker is the quickest way). Redis needs expiry events turned on:

```bash
docker run -d --name devtoolbox-pg -p 5432:5432 -e POSTGRES_DB=devtoolbox -e POSTGRES_PASSWORD=postgres postgres
docker run -d --name devtoolbox-redis -p 6379:6379 redis redis-server --notify-keyspace-events Ex
```

**2. Backend.** Create `backend/Dev-Toolbox/src/main/resources/application.properties` (it is git-ignored):

```properties
server.port=8085

spring.datasource.url=jdbc:postgresql://localhost:5432/devtoolbox
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update

spring.data.redis.host=localhost
spring.data.redis.port=6379

app.frontend-url=http://localhost:5173
app.cors-origin=http://localhost:5173
```

```bash
cd backend/Dev-Toolbox
./mvnw spring-boot:run
```

**3. Frontend:**

```bash
cd Dev-Toolbox
npm install
npm run dev
```

Open http://localhost:5173. The frontend talks to `http://localhost:8085` by default. Set `VITE_API_URL` to change it (see `.env.example`).

## Deployment

The app runs on free tiers:

- **Frontend:** Vercel, root directory `Dev-Toolbox/Dev-Toolbox`, with `VITE_API_URL` set to the backend URL
- **Backend:** Render (Docker), root directory `backend/Dev-Toolbox`
- **Database:** Neon (Postgres)
- **Redis:** Upstash, with `notify-keyspace-events Ex` enabled

Backend environment variables:

| Variable | Purpose |
|---|---|
| `SERVER_PORT` | Port to listen on (`10000` on Render) |
| `SPRING_DATASOURCE_URL` / `_USERNAME` / `_PASSWORD` | Postgres connection |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| `SPRING_DATA_REDIS_URL` | `rediss://default:<password>@<host>:6379` |
| `APP_CORS_ORIGIN` | Exact frontend URL, no trailing slash |
| `APP_FRONTEND_URL` | Frontend URL used when building share links |

## Author

Built by [Rajat Singh](https://github.com/RajatSingh1205).
