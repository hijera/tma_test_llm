#!/usr/bin/env sh

# Остановка при ошибках
set -e

# Сборка проекта
npm run build

# Переход в папку сборки
cd dist

# Если вы деплоите на кастомный домен
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# Если вы деплоите по адресу https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

# Если вы деплоите по адресу https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

cd .. 