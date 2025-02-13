FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json .

RUN --mount=type=cache,target=/root/.npm npm install --no-progress --no-audit

COPY . .

ARG VITE_BACKEND_HOST=BACKEND_HOST
ENV VITE_BACKEND_HOST=$VITE_BACKEND_HOST

RUN npm run build

FROM nginx:alpine AS runtime

RUN apk add bash && apk cache clean

WORKDIR /app

COPY --from=builder /app/dist/. .
COPY nginx.conf /usr/share/nginx/nginx.conf
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

HEALTHCHECK --interval=30s --timeout=30s --retries=5 \
  CMD ["curl", "http://localhost:80"]

ENTRYPOINT [ "/entrypoint.sh" ]
