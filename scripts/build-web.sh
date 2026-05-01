#!/usr/bin/env bash
set -e
npm install
npm run build
rm -rf app/src/main/assets/*
cp -R dist/* app/src/main/assets/
