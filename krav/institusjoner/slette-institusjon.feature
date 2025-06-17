# language: no
Egenskap: Slette institusjon
  Som opptaksleder
  Ønsker jeg å kunne fjerne institusjoner fra systemet
  Slik at jeg kan holde institusjonslisten oppdatert og relevant

  Bakgrunn:
    Gitt at jeg er logget inn som opptaksleder
    Og følgende institusjoner eksisterer:
      | Institusjonsnavn      | Organisasjonsnummer | Type        |
      | NTNU                  | 974767880           | Universitet |
      | Høyskolen i Test      | 123456789           | Høyskole    |
      | Gammel Institusjon    | 987654321           | Høyskole    |

  Scenario: Slette institusjon uten tilknyttede data
    Gitt at institusjonen "Høyskolen i Test" ikke har noen tilknyttede utdanningstilbud eller søknader
    Når jeg navigerer til institusjonens detaljside for "Høyskolen i Test"
    Og jeg klikker "Slett"
    Og jeg bekrefter slettingen i dialogboksen
    Så skal institusjonen "Høyskolen i Test" være fjernet fra systemet
    Og jeg skal se bekreftelsesmeldingen "Institusjon Høyskolen i Test er slettet"
    Og jeg skal bli omdirigert til institusjonslisten
    Og "Høyskolen i Test" skal ikke lenger vises i listen

  Scenario: Forsøk på å slette institusjon med aktive utdanningstilbud
    Gitt at institusjonen "NTNU" har følgende aktive utdanningstilbud:
      | Utdanning              | Status  |
      | Bachelor i informatikk | Aktiv   |
      | Master i datateknikk   | Aktiv   |
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Slett"
    Så skal jeg se feilmeldingen "Kan ikke slette institusjon som har aktive utdanningstilbud"
    Og jeg skal se en liste over de aktive tilbudene
    Og institusjonen skal ikke bli slettet

  Scenario: Forsøk på å slette institusjon med søknader
    Gitt at institusjonen "NTNU" har mottatt søknader for inneværende år
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker "Slett"
    Så skal jeg se feilmeldingen "Kan ikke slette institusjon som har tilknyttede søknader"
    Og jeg skal se antall søknader som er tilknyttet
    Og institusjonen skal ikke bli slettet

  Scenario: Avbryte sletting
    Når jeg navigerer til institusjonens detaljside for "Høyskolen i Test"
    Og jeg klikker "Slett"
    Og jeg klikker "Avbryt" i bekreftelsesdialogen
    Så skal jeg fortsatt være på institusjonens detaljside
    Og institusjonen skal ikke bli slettet

  Scenario: Bekreftelsesdialog viser riktig informasjon
    Når jeg navigerer til institusjonens detaljside for "Høyskolen i Test"
    Og jeg klikker "Slett"
    Så skal jeg se en bekreftelsesdialog med følgende informasjon:
      | Tekst                                                                    |
      | Er du sikker på at du vil slette institusjonen "Høyskolen i Test"?     |
      | Denne handlingen kan ikke angres.                                       |
    Og dialogen skal ha knappene "Slett" og "Avbryt"

  Scenario: Slette institusjon med historiske data
    Gitt at institusjonen "Gammel Institusjon" har følgende historiske data:
      | Type                    | Antall |
      | Avsluttede tilbud       | 5      |
      | Historiske søknader     | 150    |
      | Arkiverte dokumenter    | 20     |
    Når jeg navigerer til institusjonens detaljside for "Gammel Institusjon"
    Og jeg klikker "Slett"
    Så skal jeg se en advarsel om historiske data:
      | Melding                                                               |
      | Institusjonen har historiske data som vil bli arkivert ved sletting |
      | 5 avsluttede tilbud, 150 historiske søknader, 20 arkiverte dokumenter |
    Når jeg bekrefter slettingen
    Så skal institusjonen bli slettet
    Og de historiske dataene skal bli arkivert

  Scenario: Kun autoriserte brukere kan slette institusjoner
    Gitt at jeg er logget inn som søknadsbehandler (ikke opptaksleder)
    Når jeg navigerer til institusjonens detaljside for "Høyskolen i Test"
    Så skal jeg ikke se "Slett" knappen
    Og jeg skal ikke ha tilgang til å slette institusjonen

  Scenario: Massesletting av institusjoner
    Når jeg navigerer til "Institusjoner" siden
    Og jeg velger følgende institusjoner:
      | Institusjonsnavn   |
      | Høyskolen i Test   |
      | Gammel Institusjon |
    Og jeg klikker "Slett valgte"
    Og jeg bekrefter masseslettingen
    Så skal de valgte institusjonene bli slettet
    Og jeg skal se bekreftelsesmeldingen "2 institusjoner er slettet"

  Scenario: Forsøk på massesletting med institusjoner som ikke kan slettes
    Gitt at "NTNU" har aktive utdanningstilbud
    Når jeg navigerer til "Institusjoner" siden
    Og jeg velger følgende institusjoner:
      | Institusjonsnavn   |
      | NTNU               |
      | Høyskolen i Test   |
    Og jeg klikker "Slett valgte"
    Så skal jeg se feilmeldingen "1 av 2 institusjoner kan ikke slettes"
    Og jeg skal se hvilke institusjoner som ikke kan slettes og hvorfor
    Og kun "Høyskolen i Test" skal bli slettet hvis jeg bekrefter

  Scenario: Gjenopprette slettet institusjon
    Gitt at institusjonen "Høyskolen i Test" nylig ble slettet
    Når jeg navigerer til "Institusjoner" siden
    Og jeg klikker "Vis slettede institusjoner"
    Og jeg finner "Høyskolen i Test" i listen over slettede institusjoner
    Og jeg klikker "Gjenopprett" for denne institusjonen
    Så skal institusjonen bli gjenopprettet
    Og den skal vises i den aktive institusjonslisten igjen