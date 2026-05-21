#!/bin/bash

printf "TypeScript types: \n"; bunx tsc --noEmit 2>&1 | sed "s/^/\t/" && printf "\t\e[1;32mTypeScript types Check!\e[0m\n"
printf "TypeScript lint: \n"; bunx eslint . 2>&1 | sed "s/^/\t/" && printf "\t\e[1;32mESLint Check!\e[0m\n"
