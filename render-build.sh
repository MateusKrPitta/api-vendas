#!/bin/bash
# Limpeza
rm -rf node_modules build ace-manifest.json

# Instalação
npm install

# Gera chave APP_KEY se não existir
if [ -z "$APP_KEY" ]; then
  export APP_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  echo "APP_KEY gerada automaticamente: $APP_KEY"
fi

# Build
node ace build --production