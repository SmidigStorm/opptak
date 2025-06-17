# language: no
Egenskap: Oppdatere institusjon
  Som opptaksleder
  Ønsker jeg å kunne endre informasjon om eksisterende institusjoner
  Slik at institusjonsdataene alltid er oppdaterte og korrekte

  Bakgrunn:
    Gitt at jeg er logget inn som opptaksleder
    Og institusjonen "NTNU" eksisterer med følgende informasjon:
      | Felt                | Verdi           |
      | Institusjonsnavn    | NTNU            |
      | Organisasjonsnummer | 974767880       |
      | Type                | Universitet     |
      | Adresse             | Høgskoleringen 1 |
      | Postnummer          | 7491            |
      | Poststed            | Trondheim       |
      | E-post              | post@ntnu.no    |
      | Telefon             | 73595000        |

  Scenario: Oppdatere kontaktinformasjon
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Rediger"
    Og jeg endrer følgende felter:
      | Felt    | Ny verdi          |
      | E-post  | kontakt@ntnu.no   |
      | Telefon | 73590000          |
    Og jeg klikker "Lagre endringer"
    Så skal institusjonen være oppdatert med ny informasjon
    Og jeg skal se bekreftelsesmeldingen "Institusjon NTNU er oppdatert"
    Og jeg skal se den oppdaterte informasjonen på detaljsiden

  Scenario: Oppdatere institusjonsnavn
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Rediger"
    Og jeg endrer "Institusjonsnavn" til "Norges teknisk-naturvitenskapelige universitet"
    Og jeg klikker "Lagre endringer"
    Så skal institusjonens navn være endret til "Norges teknisk-naturvitenskapelige universitet"
    Og jeg skal se det nye navnet i institusjonslisten

  Scenario: Oppdatere adresse
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Rediger"
    Og jeg endrer følgende felter:
      | Felt       | Ny verdi      |
      | Adresse    | Gløshaugen    |
      | Postnummer | 7034          |
      | Poststed   | Trondheim     |
    Og jeg klikker "Lagre endringer"
    Så skal adressen være oppdatert til "Gløshaugen, 7034 Trondheim"

  Scenario: Forsøk på endring av organisasjonsnummer
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Rediger"
    Så skal "Organisasjonsnummer" feltet være deaktivert
    Og jeg skal se informasjonen "Organisasjonsnummer kan ikke endres"

  Scenario: Oppdatere institusjonstype
    Gitt at institusjonen "Høyskolen i Oslo" eksisterer med type "Høyskole"
    Når jeg navigerer til institusjonens detaljside for "Høyskolen i Oslo"
    Og jeg klikker "Rediger"
    Og jeg endrer "Type" til "Universitet"
    Og jeg klikker "Lagre endringer"
    Så skal institusjonstypen være endret til "Universitet"
    Og jeg skal se en advarsel "Endring av institusjonstype kan påvirke eksisterende regelsett"

  Scenario: Validering av påkrevde felter ved oppdatering
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Rediger"
    Og jeg sletter innholdet i "Institusjonsnavn"
    Og jeg klikker "Lagre endringer"
    Så skal jeg se feilmeldingen "Institusjonsnavn er påkrevd"
    Og endringene skal ikke bli lagret

  Scenario: Avbryte redigering
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Rediger"
    Og jeg endrer "E-post" til "ny-epost@ntnu.no"
    Og jeg klikker "Avbryt"
    Så skal jeg komme tilbake til detaljsiden
    Og e-post adressen skal fortsatt være "post@ntnu.no"
    Og ingen endringer skal være lagret

  Scenario: Oppdatere spesialiseringsområde for høyskole
    Gitt at institusjonen "Høyskolen i Østfold" eksisterer med spesialiseringsområde "Ingeniørfag"
    Når jeg navigerer til institusjonens detaljside for "Høyskolen i Østfold"
    Og jeg klikker "Rediger"
    Og jeg endrer "Spesialiseringsområde" til "Ingeniørfag og økonomi"
    Og jeg klikker "Lagre endringer"
    Så skal spesialiseringsområdet være oppdatert

  Scenario: Validering av e-postformat
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Rediger"
    Og jeg endrer "E-post" til "ugyldig-epost"
    Og jeg klikker "Lagre endringer"
    Så skal jeg se feilmeldingen "Ugyldig e-postformat"
    Og endringene skal ikke bli lagret

  Scenario: Oppdatere akkrediteringsstatus for privat institusjon
    Gitt at den private institusjonen "BI" eksisterer
    Når jeg navigerer til institusjonens detaljside for "BI"
    Og jeg klikker "Rediger"
    Og jeg endrer "Akkrediteringsstatus" fra "Akkreditert" til "Under vurdering"
    Og jeg klikker "Lagre endringer"
    Så skal akkrediteringsstatusen være oppdatert
    Og jeg skal se en advarsel "Endring av akkrediteringsstatus kan påvirke institusjonens tilbud"