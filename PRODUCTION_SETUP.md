# 🚀 Produksjonsoppsett for Opptakssystemet

## Frontend Miljøvariabler

For å kjøre frontend i produksjon, må du sette opp miljøvariabler.

### Metode 1: Docker Compose (Anbefalt)
Oppdater `docker-compose.yml`:

```yaml
frontend:
  environment:
    VITE_API_URL: http://din-backend-url:8080/api
```

### Metode 2: .env fil
Opprett `/frontend/.env.production`:

```bash
VITE_API_URL=http://din-backend-url:8080/api
```

## Backend CORS-konfigurasjon

Backend er nå konfigurert til å tillate følgende domener:
- http://localhost:3000
- http://localhost:3001
- http://opptaksapp.smidigakademiet.no:3001
- https://opptaksapp.smidigakademiet.no

For å legge til flere domener, rediger:
- `/backend/src/main/java/no/opptak/config/WebConfig.java`

## Produksjonssikkerhet

### For Frontend:
1. Sett riktig `VITE_API_URL` til backend-adressen
2. Vurder HTTPS for sikker kommunikasjon
3. Konfigurer eventuell reverse proxy (nginx/traefik)

### For Backend:
1. Oppdater database credentials i produksjon
2. Aktiver HTTPS
3. Vurder å begrense CORS til kun nødvendige domener
4. Sett opp logging og monitoring

## Eksempel Docker Compose for Produksjon

```yaml
version: '3.8'

services:
  database:
    # ... database config ...
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}  # Bruk secrets!

  backend:
    # ... backend config ...
    environment:
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      # Andre prod-spesifikke settings

  frontend:
    # ... frontend config ...
    environment:
      VITE_API_URL: https://api.opptaksapp.smidigakademiet.no/api

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

## Feilsøking

### CORS-feil
Hvis du får CORS-feil:
1. Sjekk at domenet ditt er lagt til i `WebConfig.java`
2. Restart backend: `docker-compose restart backend`
3. Sjekk browser console for eksakt feilmelding

### API-tilkobling feiler
1. Verifiser at `VITE_API_URL` er satt riktig
2. Test backend direkte: `curl http://backend-url:8080/api/test`
3. Sjekk Docker logs: `docker logs opptak-backend`