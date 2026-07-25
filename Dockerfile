# ---- Build stage: produce the static export in out/ ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* values are inlined into the JS bundle by `next build`, so they
# have to exist at BUILD time -- runtime service variables are too late. Railway
# passes matching service variables in as build args for each ARG declared here.
# Missing values silently produce URLs like "undefined/auth/me", so keep this
# list in sync with the NEXT_PUBLIC_ vars used under src/.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
RUN npm run build

# ---- Runtime stage: the output is plain HTML/CSS/JS, so no Node server ----
FROM caddy:2-alpine AS runtime
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/out /srv
