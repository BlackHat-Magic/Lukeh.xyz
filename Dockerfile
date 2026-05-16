# build step
FROM oven/bun:1.3-alpine AS assets

WORKDIR /build

COPY package*.json .

RUN bun ci

COPY website/templates/ ./website/templates
COPY website/static/js ./website/static/js
COPY website/static/css ./website/static/css

RUN mkdir -p static/dist

RUN bunx @tailwindcss/cli \
    -i ./website/static/css/main.css \
    -o ./website/static/dist/main.css \
    --minify

# runtime
FROM python:3.13-alpine3.23

RUN apk update && apk upgrade --available
RUN apk add uv

WORKDIR /app

COPY pyproject.toml .
COPY uv.lock .
COPY . .
RUN uv sync --group prod --no-dev

COPY --from=assets /build/website/static/dist/main.css ./website/static/dist/main.css

EXPOSE 8000

CMD ["uv", "run", "--no-dev", "python", "-m", "hypercorn", "--bind", "0.0.0.0:8000", "--workers", "2", "app:app"]