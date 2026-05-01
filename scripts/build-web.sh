#!/usr/bin/env bash
set -e
if [ -f App.jsx ]; then
  mkdir -p src
  cp App.jsx src/App.jsx
fi
npm install
npm run build
rm -rf app/src/main/assets/*
cp -R dist/* app/src/main/assets/
