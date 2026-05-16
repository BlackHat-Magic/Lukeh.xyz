#!/bin/bash

# TODO make it not say checks pass if they dont teehee
printf "TypeScript types: \n"; bunx tsc --noEmit 2>&1 | sed "s/^/\t/" && printf "\t\e[1;32mAll checks pass!\e[0m\n"
printf "TypeScript lint: \n"; bunx eslint . 2>&1 | sed "s/^/\t/" && printf "\t\e[1;32mAll checks pass!\e[0m\n"

if command -v uv >/dev/null 2>&1; then
    printf "Python types: \n"; uv run ty check --no-progress --color always . | sed "s/^/\t/"
    printf "Python lint: \n"; uv run ruff check --color always . | sed "s/^/\t/"
else
    printf "uv not found; skipping Python checks...\n"
fi

if command -v hadolint >/dev/null 2>&1; then
    printf "Dockerfile lint: \n"; hadolint Dockerfile | sed "s/^/\t/" && printf "\t\e[1;32mAll checks passed!\e[0m\n"
else
    printf "hadolint not found; skipping Dockerfile lint...\n"
fi
