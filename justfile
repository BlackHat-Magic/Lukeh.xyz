# Default: run all type checks and lints
default: check

# ---------- Build ----------

# Compile TypeScript to minified JavaScript
build-ts:
	bun run build.ts

# Compile and minify Tailwind CSS
build-css:
	bunx @tailwindcss/cli -i ./website/static/css/main.css -o ./website/static/dist/main.css --minify

# Build frontend assets (TS + CSS)
assets: build-ts build-css

# Watch and recompile TS and CSS on changes
watch:
	bun run watch

# Run dev server with live reload and asset watching
# Usage: just dev [port] [host]
dev port="8000" host="0.0.0.0":
	HYPERCORN_BIND="{{host}}:{{port}}" bun run dev

# Build Docker image
# Usage: just build [tag]
build tag="lukeh.xyz:master":
	docker buildx build --load -t {{tag}} .

# Build Docker image and push to registry
# Usage: just build-push [tag]
build-push tag="lukeh.xyz:master":
	docker buildx build --push -t {{tag}} .

# Build for multiple platforms
# Usage: just build-multi "linux/amd64,linux/arm64" [tag]
build-multi platforms tag="lukeh.xyz:master":
	docker buildx build --platform {{platforms}} --push -t {{tag}} .

# ---------- Run ----------

# Run the dev server locally (no Docker)
# Usage: just run [port] [host]
run port="8000" host="0.0.0.0":
	HYPERCORN_BIND="{{host}}:{{port}}" uv run --no-dev python -m hypercorn app:app

# Run the production Docker container
# Usage: just run-prod [port] [tag]
run-prod port="8000" tag="lukeh.xyz:master":
	docker run -ti -p {{port}}:8000 {{tag}}

# ---------- Type Checking ----------

# Type-check TypeScript (no emit)
type-ts:
	bunx tsc --noEmit

# Type-check Python with ty
type-py:
	uv run ty check .

# Run all type checks
type: type-ts type-py

# ---------- Linting ----------

# Lint TypeScript with ESLint
# Pass --fix to auto-fix: just lint-ts -- --fix
lint-ts *extra:
	bunx eslint . {{extra}}

# Lint Python with Ruff
# Pass --fix to auto-fix: just lint-py -- --fix
lint-py *extra:
	uv run ruff check . {{extra}}

# Run all linters
lint: lint-ts lint-py

# ---------- Combined Checks ----------

# Type-check and lint TypeScript
check-ts: type-ts lint-ts

# Type-check and lint Python
check-py: type-py lint-py

# Run all type checks and lints
check: type-ts type-py lint-ts lint-py

# ---------- Utility ----------

# Clean compiled artifacts
clean:
	rm -rf website/static/js/*.js website/static/dist/*.css

# Install all dependencies (Python + Node)
install:
	uv sync
	bun install

# Install production dependencies only
install-prod:
	uv sync --no-dev
	bun install --production
