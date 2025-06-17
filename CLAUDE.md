# Arbeidsmetoder

## Tech Stack
- 🎨 **Frontend**: React med Vite
- ⚙️ **Backend**: Spring Boot med Maven
- 🗄️ **Database**: PostgreSQL
- 🐳 **Deployment**: Docker Compose
- 📁 **Struktur**: Mono-repo (alt i samme repository)

## Tekniske prinsipper
- **Enkelhet først**: Velg alltid den enkleste løsningen som fungerer
- **Anti-Yak Shaving**: Gå til roten av problemer, ikke symptomene
- **Ingen quick-fixes**: Implementer fundamentale løsninger som varer over tid
- **Forståelig arkitektur**: Alt skal være enkelt å forstå og jobbe videre på

## Språkbruk
- Hele appen skal være på norsk
- Tekniske begreper brukes på engelsk (f.eks. component, state, props, database, API, osv.)
- Brukergrensesnitt og meldinger til brukeren skal være på norsk
- Kodekommentarer og variabelnavn følger vanlig praksis (engelsk)

## Dokumentasjon
- Domenekunnskap dokumenteres i markdown-filer i mappen `/domenekunnskap`
- Krav dokumenteres i Gherkin-format i mappen `/krav`
- Oppretthold en oppdatert `entiteter.md` fil med alle hovedentiteter og relasjoner
- Bruk relevante emojis i markdown-filer for bedre lesbarhet
- Hold dokumentasjonen konsis og oppdatert når domeneforståelsen utvides

## Utviklingsmetodikk
- Jobber inkrementelt og fullstack
- Hver feature implementeres ferdig i hele stacken før vi går videre
- Ingen uferdige komponenter (f.eks. frontend uten backend)
- Feature er komplett når: frontend, backend, database og tester er på plass

## Arbeidsflyt
- Start alltid med å bygge solid domeneforståelse
- Dokumenter domenekunnskap grundig før implementering
- Oppdater eksisterende dokumentasjon når nye konsepter introduseres
- Slå sammen relaterte konsepter i samme fil for bedre oversikt
- Bruk konsistente begreper gjennom hele prosjektet

## Setup og kjøring av applikasjonen

### Standard oppsett
Applikasjonen startes med:
```bash
docker-compose up --build -d
```

### Vanlige problemer og løsninger

#### Database-migreringsfeil
**Problem**: Backend feiler med "null value in column 'institusjon_id' violates not-null constraint"
**Årsak**: V3-migreringen (utdanningstilbud) prøver å referere til institusjoner som ikke finnes ennå
**Løsning**: Institusjonsdata må legges til i V1-migreringen før V3 kjøres

**Fix implementert**: Lagt til test-data for NTNU, UiO og Høgskolen i Østfold i V1__Initial_schema.sql

#### Restart ved problemer
Ved migreringsfeild:
```bash
docker-compose down -v  # Sletter database-volum
docker-compose up --build -d
```

### Verifikasjon av tjenester
- Frontend: http://localhost:3001 (skal returnere HTTP 200)
- Backend API: http://localhost:8080/api/institusjoner (skal returnere HTTP 200)
- Database: Port 5432, healthy status i `docker-compose ps`

### Testdata
Systemet har følgende testdata etter vellykket oppsett:
- 3 institusjoner (NTNU, UiO, HiØ)
- 2 utdanningstilbud (Informatikk-Bachelor, Samfunnsøkonomi-Master)
- Alle med fullstendige relasjoner og gyldig institusjon_id