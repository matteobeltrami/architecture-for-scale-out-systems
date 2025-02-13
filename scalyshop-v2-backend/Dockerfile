FROM node:22-alpine

RUN apk add curl && apk cache clean

WORKDIR /app

COPY package.json .

RUN --mount=type=cache,target=/root/.npm npm install --no-progress --no-audit

COPY . .

# Checking the health route of the service itself
HEALTHCHECK --interval=1s --timeout=30s --retries=5 \
  CMD curl http://localhost:5045/

CMD ["npm", "start"]