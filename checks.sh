#!/bin/bash
set -o pipefail

status=0

printf "Frontend TypeScript types: \n"
if bunx tsc --noEmit 2>&1 | sed "s/^/\t/"; then
  printf "\t\e[1;32mFrontend TypeScript check!\e[0m\n"
else
  printf "\t\e[1;31mFrontend TypeScript check failed.\e[0m\n"
  status=1
fi

printf "Pages Function TypeScript types: \n"
if bunx tsc --noEmit -p functions/tsconfig.json 2>&1 | sed "s/^/\t/"; then
  printf "\t\e[1;32mPages Function TypeScript check!\e[0m\n"
else
  printf "\t\e[1;31mPages Function TypeScript check failed.\e[0m\n"
  status=1
fi

printf "TypeScript lint: \n"
if bunx eslint static/ts build.ts functions/api/contact.ts 2>&1 | sed "s/^/\t/"; then
  printf "\t\e[1;32mESLint check!\e[0m\n"
else
  printf "\t\e[1;31mESLint check failed.\e[0m\n"
  status=1
fi

exit "$status"
