# Wood Stone Corbett - Backend (MVP)

This is the backend for the Wood Stone Corbett billing & hotel management MVP.

Quick start (uses MongoDB Atlas; server can run in SKIP_DB mode if `MONGO_URI` is empty):

```powershell
cd "backend"
npm install
# run without DB (skip DB connect)
npm start
# or in dev mode with nodemon
npm run dev
```

Environment variables: copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.

How to connect to MongoDB Atlas (quick):

1. Create a free cluster at https://cloud.mongodb.com/ and create a database user (username/password).
2. In Network Access, add your IP or allow access from anywhere for testing (`0.0.0.0/0`).
3. In "Connect" choose "Connect your application" and copy the connection string. Replace the `<password>` placeholder with your DB user password.
4. Paste the connection string into `backend/.env` as the value for `MONGO_URI` (remove quotes if you prefer):

```text
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/woodstone?retryWrites=true&w=majority"
JWT_SECRET="a-strong-secret"
PORT=5000
GST_RATE=0.12
```

5. Start the backend and watch for the "MongoDB connected" log:

```powershell
cd "backend"
npm install
npm run dev
```

If you want me to set the `MONGO_URI` in your workspace and test the connection, paste the connection string here (or say "I'll add it myself" when done). I will then start the server and verify connection + optionally run the seed script to create an owner account.

Endpoints (MVP):
- `POST /auth/login`
- `POST /booking/create`
- `POST /booking/checkout`
- `POST /invoice/generate`
- `POST /payment/add`
- `GET /dashboard/stats`

The server supports a demo SKIP_DB mode when `MONGO_URI` is not set, allowing quick local testing of the server boot behavior.
