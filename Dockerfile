# build step
FROM oven/bun:1.3-alpine AS assets

WORKDIR /build

COPY package.json bun.lock tsconfig.json build.ts ./

RUN bun ci

COPY website/templates/ ./website/templates
COPY website/static/ts ./website/static/ts
COPY website/static/css ./website/static/css

RUN mkdir -p website/static/js website/static/dist && \
	bun run build:ts && \
	bun run build:css

# runtime
FROM python:3.13-alpine3.23

RUN apk update && apk upgrade --available && apk add --no-cache uv>=0.10

WORKDIR /app

COPY pyproject.toml .
COPY uv.lock .
COPY . .
RUN uv sync --group prod --no-dev

COPY --from=assets /build/website/static/dist/main.css ./website/static/dist/main.css
COPY --from=assets /build/website/static/js ./website/static/js

EXPOSE 8000

CMD ["uv", "run", "--no-dev", "python", "-m", "hypercorn", "--bind", "0.0.0.0:8000", "--workers", "2", "app:app"]

