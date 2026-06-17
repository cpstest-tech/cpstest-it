#!/bin/bash
# ============================================================
# deploy.sh - Aggiornamento cpstest.it
# Eseguire ogni volta che vuoi aggiornare il sito da GitHub
# ============================================================

set -e

echo ""
echo "========================================="
echo " DEPLOY cpstest.it"
echo "========================================="

echo ""
echo "📥 [1/3] Scaricamento aggiornamenti da GitHub..."
git pull origin main

echo ""
echo "🏗️  [2/3] Ricostruzione e Riavvio container Docker..."
docker compose up -d --build

echo ""
echo "🔄 [3/3] Ricaricamento Nginx..."
sudo nginx -s reload

echo ""
echo "========================================="
echo " ✅ Deploy completato con successo!"
echo "========================================="
echo ""
