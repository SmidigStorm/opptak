# language: no
Egenskap: Opprette institusjon
  Som opptaksleder
  Ønsker jeg å registrere nye institusjoner i systemet
  Slik at de kan tilby utdanningstilbud

  Bakgrunn:
    Gitt at jeg er logget inn som opptaksleder

  Scenario: Opprette institusjon med alle påkrevde felter
    Når jeg navigerer til "Ny institusjon" siden
    Og jeg fyller inn følgende informasjon:
      | Felt                | Verdi           |
      | Institusjonsnavn    | NTNU            |
      | Organisasjonsnummer | 974767880       |
      | Type                | Universitet     |
      | Adresse             | Høgskoleringen 1 |
      | Postnummer          | 7491            |
      | Poststed            | Trondheim       |
      | E-post              | post@ntnu.no    |
      | Telefon             | 73595000        |
    Og jeg klikker "Opprett institusjon"
    Så skal institusjonen "NTNU" være opprettet
    Og jeg skal se bekreftelsesmeldingen "Institusjon NTNU er opprettet"
    Og jeg skal bli omdirigert til institusjonens detaljside

  Scenario: Opprette institusjon uten påkrevde felter
    Når jeg navigerer til "Ny institusjon" siden
    Og jeg klikker "Opprett institusjon" uten å fylle inn noen felter
    Så skal jeg se følgende feilmeldinger:
      | Felt                | Feilmelding                           |
      | Institusjonsnavn    | Institusjonsnavn er påkrevd          |
      | Organisasjonsnummer | Organisasjonsnummer er påkrevd       |
      | Type                | Institusjonstype er påkrevd          |

  Scenario: Opprette institusjon med ugyldig organisasjonsnummer
    Når jeg navigerer til "Ny institusjon" siden
    Og jeg fyller inn følgende informasjon:
      | Felt                | Verdi       |
      | Institusjonsnavn    | UiO         |
      | Organisasjonsnummer | 123         |
      | Type                | Universitet |
    Og jeg klikker "Opprett institusjon"
    Så skal jeg se feilmeldingen "Organisasjonsnummer må være 9 siffer"

  Scenario: Opprette institusjon med eksisterende organisasjonsnummer
    Gitt at institusjonen "NTNU" med organisasjonsnummer "974767880" allerede eksisterer
    Når jeg navigerer til "Ny institusjon" siden
    Og jeg fyller inn følgende informasjon:
      | Felt                | Verdi     |
      | Institusjonsnavn    | NTNU Ålesund |
      | Organisasjonsnummer | 974767880 |
      | Type                | Høyskole  |
    Og jeg klikker "Opprett institusjon"
    Så skal jeg se feilmeldingen "En institusjon med dette organisasjonsnummeret eksisterer allerede"

  Scenario: Opprette høyskole med spesialiseringsområde
    Når jeg navigerer til "Ny institusjon" siden
    Og jeg fyller inn følgende informasjon:
      | Felt                  | Verdi                    |
      | Institusjonsnavn      | Høyskolen i Østfold     |
      | Organisasjonsnummer   | 974251760               |
      | Type                  | Høyskole                |
      | Spesialiseringsområde | Ingeniørfag og økonomi  |
      | Adresse               | Remmen 36               |
      | Postnummer            | 1783                    |
      | Poststed              | Halden                  |
      | E-post                | post@hiof.no           |
    Og jeg klikker "Opprett institusjon"
    Så skal institusjonen "Høyskolen i Østfold" være opprettet
    Og spesialiseringsområdet skal være "Ingeniørfag og økonomi"

  Scenario: Opprette privat institusjon
    Når jeg navigerer til "Ny institusjon" siden
    Og jeg fyller inn følgende informasjon:
      | Felt                | Verdi           |
      | Institusjonsnavn    | BI              |
      | Organisasjonsnummer | 976475191       |
      | Type                | Privat høyskole |
      | Adresse             | Nydalsveien 37  |
      | Postnummer          | 0484            |
      | Poststed            | Oslo            |
      | E-post              | info@bi.no      |
      | Akkreditering       | Ja              |
    Og jeg klikker "Opprett institusjon"
    Så skal institusjonen "BI" være opprettet
    Og akkrediteringsstatus skal være "Akkreditert"