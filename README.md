<div align="center">

# [Lukeh.xyz](https://lukeh.xyz)

My personal developer portfolio and blog.

</div>


## Overview

A simple web app (that's probably getting rewritten in Rust) to serve my personal developer portfolio and blog.

### Goals

Uh idk get a job ig? I'm just here for the love of the game tbh.

### Features

- [X] Site
- [ ] Blog... with org mode?
- [ ] WASM REPLs for code demos
- [ ] 14kB TCP slow start goodness
- [ ] Have all the projects "above the fold" be actually good
- [ ] RSS Feed & email newsletter

### Software Stack / Technologies Used

- Language: HTML, JavaScript, CSS, Python
- Framework: Alpine.js, Flask

## Quickstart

### Running locally for development

```sh
# install dependencies
bun install
uv sync

# build scripts
bun run build:ts					# compile TypeScript files
	# bun run build.ts
bun run build:css					# build Tailwind styles
	# bunx @tailwindcss/cli -i ./website/static/css/main.css -o ./website/static/dist/main.css --minfy
bun run build:docker -- -t <tag>	# build docker container
	# docker buildx build .
bun run build:all					# all of the above

# running server
bun run watch	# watch ts+css files and auto-rebuild
	# bun run build:ts -- --watch
	# bun run build:css -- --watch

bun run dev		# run dev server, update as files are changed
	# uv run --no-dev python -m hypercorn app:app --reload
	# bun run build:ts -- --watch
	# bun run build:css -- --watch

# other utilities
bun run check	# type checking + linting + syntax checking
	# uv run ty check .
	# uv run ruff check .
	# bunx tsc --noEmit
	# bun run build.ts
	# hadolint Dockerfile

bun run clean	# clean build artifacts
	# rm -rf website/static/js/*.js
	# rm -rf website/static/dist/*.css
```

### Building and running the docker image

```sh
docker buildx build -t lukehxyz:master .
docker run -p 8000:8000 lukehxyz:master
```

