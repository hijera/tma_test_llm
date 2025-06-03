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

# Деплой на GitHub Pages (замените hijera на ваше имя пользователя GitHub)
git push -f https://github.com/hijera/tma_test_llm.git main:gh-pages

cd .. 