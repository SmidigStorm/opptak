# 🏗️ Teknisk arkitektur

## 📦 Teknologi-stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Språk**: Java 21
- **Database**: PostgreSQL 16
- **ORM**: Hibernate/JPA
- **Migrasjoner**: Flyway
- **Build**: Maven

### Frontend
- **Framework**: React 18
- **Build tool**: Vite
- **Språk**: JavaScript (ES6+)
- **Styling**: CSS
- **State**: React hooks
- **HTTP**: Fetch API

### Infrastruktur
- **Container**: Docker & Docker Compose
- **Database**: PostgreSQL med Docker volume
- **Nettverk**: Docker bridge network

## 🏛️ Arkitektur-prinsipper

### Lagdelt arkitektur (Backend)
1. **Controller-lag**: REST API endpoints
2. **Service-lag**: Forretningslogikk
3. **Repository-lag**: Database-tilgang via JPA
4. **Entity-lag**: Domeneobjekter

### Komponentbasert (Frontend)
1. **Pages**: Hovedvisninger som orkestrerer komponenter
2. **Components**: Gjenbrukbare UI-komponenter
3. **Services**: API-kommunikasjon
4. **Utils**: Hjelpefunksjoner

## 🔌 API-design

### RESTful endpoints
- `GET /api/{ressurs}` - Liste alle
- `GET /api/{ressurs}/{id}` - Hent én
- `POST /api/{ressurs}` - Opprett ny
- `PUT /api/{ressurs}/{id}` - Oppdater
- `DELETE /api/{ressurs}/{id}` - Slett

### Filtrering og søk
- Query parameters for filtrering
- Dedikerte søke-endpoints
- Paginering ved behov

## 🔒 Sikkerhet

### CORS-konfigurasjon
- Global konfigurasjon via `WebConfig.java`
- Tillatte domener:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://opptaksapp.smidigakademiet.no:3001`
  - `https://opptaksapp.smidigakademiet.no`

### Miljøvariabler
- Database credentials
- API URLs
- Sensitive data holdes utenfor kodebasen

## 🚀 Deployment

### Docker setup
```yaml
services:
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: opptak
      POSTGRES_USER: opptak_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://database:5432/opptak
      SPRING_DATASOURCE_USERNAME: opptak_user
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
    depends_on:
      database:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    environment:
      VITE_API_URL: ${API_URL}
    depends_on:
      - backend
```

### Produksjonsoppsett
1. **Frontend miljøvariabler**:
   - `VITE_API_URL` må settes til backend URL
   - Kan settes via Docker environment eller .env fil

2. **Backend CORS**:
   - Konfigurert i `WebConfig.java`
   - Nye domener legges til ved behov

3. **Vite server config**:
   - `allowedHosts` konfigurert for produksjonsdomener
   - `host: true` for eksterne tilkoblinger

## 🔄 CI/CD considerations

### Build-prosess
1. Maven build for backend (multi-stage Docker)
2. Vite build for frontend
3. Docker images bygges og deployes

### Database-migrasjoner
- Flyway kjører automatisk ved oppstart
- Versjonerte SQL-scripts i `/db/migration`

### Helse-sjekker
- Database health check før backend starter
- Backend health endpoint: `/api/test`

## 📊 Skalering

### Horisontalt
- Stateless backend tillater flere instanser
- Frontend kan serveres via CDN
- Database connection pooling

### Vertikalt
- JVM memory tuning for backend
- PostgreSQL performance tuning
- Container resource limits

## 🔍 Monitorering

### Logging
- Spring Boot standard logging
- Docker logs for container-niveau
- Strukturert logging for produksjon

### Metrikker
- JVM metrics via Spring Actuator (kan aktiveres)
- Database connection metrics
- API response times

## 🛠️ Utviklingsmiljø

### Lokalt oppsett
```bash
# Start alle tjenester
docker-compose up -d

# Følg logger
docker-compose logs -f

# Rebuild etter endringer
docker-compose build && docker-compose up -d
```

### Hot reload
- Frontend: Vite HMR aktivert
- Backend: Spring DevTools (kan legges til)

### Database-tilgang
- pgAdmin eller DBeaver kan kobles til localhost:5432
- Credentials i docker-compose.yml