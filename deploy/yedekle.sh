#!/usr/bin/env bash
# Veritabani yedegi alir, 14 gunden eski yedekleri siler. Gunluk cron icin: deploy/YAYIN.md
set -euo pipefail
umask 077

cd "$(dirname "$0")"
mkdir -p yedekler

dosya="yedekler/paleo_$(date +%Y-%m-%d_%H%M).sql.gz"
docker compose exec -T db pg_dump -U paleo paleo_db | gzip > "$dosya.gecici"
mv "$dosya.gecici" "$dosya"

# Yuklenen urun gorselleri
gorsel="yedekler/gorseller_$(date +%Y-%m-%d_%H%M).tar.gz"
docker compose exec -T app tar -czf - -C /app yuklenen > "$gorsel.gecici"
mv "$gorsel.gecici" "$gorsel"

# Eskiler yalnizca yeni yedek basariyla alindiysa silinir (set -e)
find yedekler -name 'paleo_*.sql.gz' -mtime +14 -delete
find yedekler -name 'gorseller_*.tar.gz' -mtime +14 -delete
echo "Yedek alindi: $dosya, $gorsel"
