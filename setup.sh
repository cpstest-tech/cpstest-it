#!/bin/bash
# ============================================================
# setup.sh - Installazione iniziale cpstest.it
# Eseguire UNA SOLA VOLTA sul server dopo aver clonato il repo
# ============================================================

set -e  # Esci subito se qualcosa va storto

# --- CONFIGURAZIONE ---
DOMAIN="cpstest.it"
EMAIL="admin@cpstest.it"  # Cambia con la tua email per i certificati SSL
# ----------------------

echo ""
echo "========================================="
echo " SETUP INIZIALE cpstest.it"
echo "========================================="
echo ""

# 1. Installa Docker
echo "🐳 [1/5] Installazione Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sudo sh /tmp/get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installato!"
else
    echo "⏭️  Docker già presente, skip."
fi

# 2. Installa Nginx e Certbot
echo ""
echo "🌐 [2/5] Installazione Nginx e Certbot..."
sudo apt-get update -qq
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 3. Configura Nginx come reverse proxy
echo ""
echo "⚙️  [3/5] Configurazione Nginx..."
sudo tee /etc/nginx/sites-available/cpstest > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/cpstest /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
echo "✅ Nginx configurato!"

# 4. Avvia il container Docker (richiede .env.local)
echo ""
echo "🏗️  [4/5] Avvio container Docker..."
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  ATTENZIONE: File .env.local non trovato!"
    echo "   Crea il file con i tuoi valori Supabase:"
    echo ""
    echo "   nano .env.local"
    echo ""
    echo "   Contenuto:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..."
    echo ""
    echo "   Poi riesegui: ./setup.sh"
    exit 1
fi

sudo systemctl enable docker
docker compose up -d --build
echo "✅ Container avviato!"

# 5. SSL con Let's Encrypt
echo ""
echo "🔒 [5/5] Configurazione SSL con Let's Encrypt..."
echo "   (assicurati che ${DOMAIN} punti già a questo server!)"
echo ""
sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email ${EMAIL} --redirect
echo "✅ SSL configurato! Il sito è ora disponibile su https://${DOMAIN}"

echo ""
echo "========================================="
echo " SETUP COMPLETATO! 🎉"
echo " Sito live su: https://${DOMAIN}"
echo "========================================="
echo ""
echo "Per i prossimi aggiornamenti usa: ./deploy.sh"
