FROM node:18-alpine as base
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app

RUN mkdir -p /app/node_modules
RUN chmod 755 /app
RUN chown -R app:app /app

USER app

COPY --chown=app:app . .

RUN npm ci
CMD ["npm", "run", "test"]
