FROM node:20-alpine AS deps
WORKDIR /app

ARG TALTECH_NPM_TOKEN

COPY package*.json ./

RUN echo "//npm.taltech.ee/:_authToken=${TALTECH_NPM_TOKEN}" > .npmrc \
	&& npm ci --legacy-peer-deps \
	&& rm -f .npmrc

FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
