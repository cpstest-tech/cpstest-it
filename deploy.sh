#!/bin/bash
# Script per l'Auto-Deploy di cpstest.it

echo "📥 Scaricamento aggiornamenti da GitHub..."
git pull origin main

echo "🏗️ Costruzione e Riavvio dei Container Docker..."
docker compose up -d --build

echo "✅ Deploy completato con successo!"
