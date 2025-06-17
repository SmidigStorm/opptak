# language: no
Egenskap: Vise institusjoner
  Som opptaksleder
  Ønsker jeg å kunne se og søke etter institusjoner
  Slik at jeg kan administrere og få oversikt over registrerte institusjoner

  Bakgrunn:
    Gitt at jeg er logget inn som opptaksleder
    Og følgende institusjoner eksisterer i systemet:
      | Institusjonsnavn      | Organisasjonsnummer | Type            | Poststed   |
      | NTNU                  | 974767880           | Universitet     | Trondheim  |
      | Universitetet i Oslo  | 971035854           | Universitet     | Oslo       |
      | Høyskolen i Østfold   | 974251760           | Høyskole        | Halden     |
      | BI                    | 976475191           | Privat høyskole | Oslo       |

  Scenario: Vise alle institusjoner
    Når jeg navigerer til "Institusjoner" siden
    Så skal jeg se en liste med alle institusjoner
    Og listen skal inneholde følgende institusjoner:
      | Institusjonsnavn      | Type            | Poststed   |
      | NTNU                  | Universitet     | Trondheim  |
      | Universitetet i Oslo  | Universitet     | Oslo       |
      | Høyskolen i Østfold   | Høyskole        | Halden     |
      | BI                    | Privat høyskole | Oslo       |

  Scenario: Søke etter institusjon på navn
    Når jeg navigerer til "Institusjoner" siden
    Og jeg søker etter "NTNU"
    Så skal jeg se følgende institusjoner i søkeresultatet:
      | Institusjonsnavn | Type        | Poststed  |
      | NTNU             | Universitet | Trondheim |
    Og jeg skal ikke se "Universitetet i Oslo" i listen

  Scenario: Søke etter institusjon på type
    Når jeg navigerer til "Institusjoner" siden
    Og jeg filtrerer på type "Universitet"
    Så skal jeg se følgende institusjoner i listen:
      | Institusjonsnavn      | Type        | Poststed  |
      | NTNU                  | Universitet | Trondheim |
      | Universitetet i Oslo  | Universitet | Oslo      |
    Og jeg skal ikke se "Høyskolen i Østfold" i listen

  Scenario: Søke etter institusjon på poststed
    Når jeg navigerer til "Institusjoner" siden
    Og jeg søker etter "Oslo"
    Så skal jeg se følgende institusjoner i søkeresultatet:
      | Institusjonsnavn      | Type            | Poststed |
      | Universitetet i Oslo  | Universitet     | Oslo     |
      | BI                    | Privat høyskole | Oslo     |

  Scenario: Vise institusjonens detaljer
    Når jeg navigerer til "Institusjoner" siden
    Og jeg klikker på "NTNU"
    Så skal jeg se institusjonens detaljside med følgende informasjon:
      | Felt                | Verdi           |
      | Institusjonsnavn    | NTNU            |
      | Organisasjonsnummer | 974767880       |
      | Type                | Universitet     |
      | Poststed            | Trondheim       |
    Og jeg skal se knappene "Rediger" og "Slett"

  Scenario: Sortere institusjoner alfabetisk
    Når jeg navigerer til "Institusjoner" siden
    Og jeg klikker på "Navn" kolonneheaderen
    Så skal institusjonene være sortert alfabetisk:
      | Institusjonsnavn      |
      | BI                    |
      | Høyskolen i Østfold   |
      | NTNU                  |
      | Universitetet i Oslo  |

  Scenario: Vise institusjonens utdanningstilbud
    Gitt at NTNU har følgende utdanningstilbud:
      | Utdanning                      | Oppstart    |
      | Bachelor i informatikk         | Høst 2025   |
      | Master i datateknikk           | Høst 2025   |
      | Bachelor i maskinteknikk       | Høst 2025   |
    Når jeg navigerer til institusjonens detaljside for "NTNU"
    Og jeg klikker på "Utdanningstilbud" fanen
    Så skal jeg se alle utdanningstilbudene til NTNU
    Og jeg skal se antall studenter per tilbud

  Scenario: Søk returnerer ingen resultater
    Når jeg navigerer til "Institusjoner" siden
    Og jeg søker etter "Hogwarts"
    Så skal jeg se meldingen "Ingen institusjoner funnet"
    Og jeg skal se en lenke "Opprett ny institusjon"

  Scenario: Paginering av mange institusjoner
    Gitt at det finnes 25 institusjoner i systemet
    Når jeg navigerer til "Institusjoner" siden
    Så skal jeg se de første 20 institusjonene
    Og jeg skal se navigasjonsknapper for "Neste side"
    Når jeg klikker "Neste side"
    Så skal jeg se de resterende 5 institusjonene