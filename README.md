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
   git clone https://github.com/SmidigStorm/opptak.git
   cd opptak
   ```

2. **Start hele systemet**
   ```bash
   docker-compose up --build
   ```

3. **Tilgang til tjenestene**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8080/api
   - Database: localhost:5432 (database: opptak, user: opptak_user)

### Produksjonsoppsett
Se [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) for detaljert veiledning om produksjonsdeployment.

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
- **Hovedentiteter og relasjoner** - Personer, institusjoner, utdanningstilbud, opptak
- **Opptak og søknadsprosess** - Samordnet opptak, lokale opptak, frister
- **Opptaksregler og kvalifiseringsveier** - Generell studiekompetanse, realkompetanse, Y-veien
- **Aktører og organisasjoner** - HK-dir, Samordna opptak, Unit
- **Regelsett og kvoter** - Førstegangsvitnemål, ordinær kvote
- **Teknisk arkitektur** - Tech stack, deployment, CORS-konfigurasjon

## 🔧 Hovedfunksjonalitet

### Implementerte moduler
- **Institusjoner** - CRUD for utdanningsinstitusjoner
- **Personer** - Håndtering av søkere med kontaktinfo
- **Utdanningstilbud** - Studieprogram med nivå, fagområde og kapasitet
- **Opptak** - Samordnet og lokale opptak med fristovervåkning

### Tekniske features
- Full CRUD-funksjonalitet for alle moduler
- Avansert filtrering og søk
- Debounced søkefelt for bedre ytelse
- Responsivt design med kort-basert layout
- Automatisk statusbehandling basert på frister
- CORS-støtte for produksjonsmiljø

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