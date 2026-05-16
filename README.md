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
uv sync
uv run app.py

uv run ruff check	# syntax checker
uv run ty check		# type checker
```

### Building and running the docker image

```sh
docker buildx build -t lukehxyz:master .
docker run -p 8000:8000 lukehxyz:master
```

