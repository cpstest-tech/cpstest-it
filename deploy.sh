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
echo "⚙️  Caricamento variabili d'ambiente da .env.local..."
# Esporta le variabili nel processo corrente così docker compose le passa come build args
set -a
source .env.local
set +a

echo ""
echo "🏗️  [2/3] Ricostruzione e Riavvio container Docker..."
docker compose up -d --build

echo ""
echo "🔄 [3/3] Ricaricamento Nginx..."
sudo nginx -s reload 2>/dev/null || true

echo ""
echo "========================================="
echo " ✅ Deploy completato con successo!"
echo "========================================="
echo ""
