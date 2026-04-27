# MindMatch Arena – Real-Time Multiplayer Memory Card Game

MindMatch Arena is a full-stack concentration game platform featuring real-time multiplayer gameplay (2-4 players), authentication, game rooms, score tracking, chat/reactions, AI bot fallback, and leaderboard/profile systems.

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Real-time:** Socket.IO
- **Database:** MongoDB + Mongoose
- **Auth:** JWT

## Project Structure
```
mindmatch-arena/
  backend/
    src/
      config/ controllers/ middleware/ models/ routes/ services/ socket/
  frontend/
    src/
      api/ components/ context/ pages/ styles/
```

## Features Included
- User signup/login with JWT.
- Room create/join with room code invites.
- Multiplayer game state sync with Socket.IO.
- Turn-based rules + per-turn countdown timer.
- Modes: classic, time challenge, survival, themed cards.
- Themes: animals, fruits, marvel, emojis, anime (plus admin custom-theme API).
- AI bot auto-joins empty rooms and plays random/simplified smart turns.
- Chat and emoji reactions during matches.
- Winner modal + restart option.
- Leaderboard + profile + match history.
- Admin APIs (users, custom themes, game stats).
- Responsive neon-styled dark/light UI.

## Local Setup
1. **Install dependencies**
   ```bash
   npm install
   npm install --workspace backend
   npm install --workspace frontend
   ```
2. **Configure env files**
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
3. **Start MongoDB**
   - Ensure your MongoDB instance is running and matches `MONGO_URI`.
4. **Run dev mode**
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173`.

## Deployment Ready Notes
- Backend is stateless API + Socket.IO server, deployable on Render/Fly/Railway.
- Set `CLIENT_URL`, `MONGO_URI`, and `JWT_SECRET` in host environment variables.
- Build frontend with `npm run build --workspace frontend` and serve via static hosting/CDN.
- Point `VITE_API_URL` and `VITE_SOCKET_URL` to deployed backend.

## APIs
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Rooms: `POST /api/rooms/create`, `POST /api/rooms/join`, `GET /api/rooms/:code`
- Game: `GET /api/game/health` + real-time socket events
- Leaderboard: `GET /api/leaderboard`
- Profile: `GET /api/profile`
- Admin: `GET /api/admin/users`, `POST /api/admin/themes`, `GET /api/admin/stats`

## Socket Events
- `room:join`, `room:players`
- `game:update`, `game:flip`, `game:finished`, `game:restart`
- `chat:send`, `chat:new`
- `reaction:send`, `reaction:new`

## Notes
- For production fairness, move live game state to Redis and persist turn logs.
- Upload support for custom images can be added by integrating object storage (S3/Cloudinary).
