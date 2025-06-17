# 🎓 Opptakssystem

Et moderne opptakssystem for norske utdanningsinstitusjoner, bygget med enkle og forståelige teknologier.

## 📋 Tech Stack

- 🎨 **Frontend**: React med Vite
- ⚙️ **Backend**: Spring Boot med Maven
- 🗄️ **Database**: PostgreSQL
- 🐳 **Deployment**: Docker Compose

## 🚀 Kom i gang

### Forutsetninger
- Docker og Docker Compose installert
- Git

### Setup
1. **Klon repositoriet**
   ```bash
   git clone <repository-url>
   cd opptak
   ```

2. **Start hele systemet**
   ```bash
   docker-compose up --build
   ```

3. **Tilgang til tjenestene**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Database: localhost:5432 (database: opptak, user: opptak_user)

### Utvikling

**Backend (Spring Boot)**
```bash
cd backend
mvn spring-boot:run
```

**Frontend (React + Vite)**
```bash
cd frontend
npm run dev
```

**Database migrasjoner**
- Flyway migrasjoner ligger i `backend/src/main/resources/db/migration/`
- Kjøres automatisk ved oppstart av backend

## 📁 Prosjektstruktur

```
opptak/
├── backend/                 # Spring Boot applikasjon
│   ├── src/main/java/       # Java kildekode
│   ├── src/main/resources/  # Konfigurasjon og migrasjoner
│   └── pom.xml             # Maven dependencies
├── frontend/               # React applikasjon
│   ├── src/                # React komponenter
│   ├── package.json        # NPM dependencies
│   └── vite.config.js      # Vite konfigurasjon
├── database/               # Database setup
│   └── init/               # Initial SQL scripts
├── domenekunnskap/         # Domeneforståelse
├── krav/                   # Kravspesifikasjoner
└── docker-compose.yml      # Orkestrering av alle tjenester
```

## 📚 Domenekunnskap

Prosjektet inneholder omfattende domenedokumentasjon i `domenekunnskap/` mappen som beskriver:
- Hovedentiteter og relasjoner
- Opptaksregler og kvalifiseringsveier
- Aktører og organisasjoner
- Regelsett og kvoter

## 🔧 Utvikling

### Tekniske prinsipper
- **Enkelhet først**: Velg alltid den enkleste løsningen som fungerer
- **Anti-Yak Shaving**: Gå til roten av problemer, ikke symptomene
- **Ingen quick-fixes**: Implementer fundamentale løsninger som varer over tid
- **Forståelig arkitektur**: Alt skal være enkelt å forstå og jobbe videre på

### Arbeidsmetodikk
- Jobber inkrementelt og fullstack
- Hver feature implementeres ferdig i hele stacken før vi går videre
- Ingen uferdige komponenter (f.eks. frontend uten backend)
- Feature er komplett når: frontend, backend, database og tester er på plass

## 📄 Lisens

MIT License - se LICENSE fil for detaljer.