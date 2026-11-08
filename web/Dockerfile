FROM node:22-alpine AS kurulum
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS derleme
WORKDIR /app
COPY --from=kurulum /app/node_modules ./node_modules
COPY . .
# Tarayicinin kullanacagi API adresi derleme sirasinda koda yazilir
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
# /yuklenen yonlendirmesi derlemede sabitlenir: ic agdaki API adresi
ARG API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL API_URL=$API_URL NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN adduser -S -D -H paleo
COPY --from=derleme /app/.next/standalone ./
COPY --from=derleme /app/.next/static ./.next/static
COPY --from=derleme /app/public ./public
RUN mkdir -p .next/cache && chown -R paleo .next/cache
USER paleo
EXPOSE 3000
CMD ["node", "server.js"]
