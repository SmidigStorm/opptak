-- Opptak tabell for opptakssystemet
CREATE TABLE opptak (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    navn VARCHAR(255) NOT NULL,
    beskrivelse TEXT,
    opptakstype VARCHAR(100) NOT NULL,
    soknadsfrist DATE NOT NULL,
    svarselskapsfrist DATE,
    studieopptaksfrist DATE,
    semester VARCHAR(10) NOT NULL, -- 'Høst' eller 'Vår'
    aar INTEGER NOT NULL,
    opptaksomgang VARCHAR(50), -- 'Hovedomgang', 'Tilleggsomgang', 'Løpende'
    status VARCHAR(50) NOT NULL DEFAULT 'Åpen', -- 'Åpen', 'Stengt', 'Avsluttet', 'Fremtidig'
    max_soknader_per_person INTEGER,
    institusjon_id UUID REFERENCES institusjon(id) ON DELETE SET NULL, -- NULL for samordnet opptak
    ekstern_url VARCHAR(500),
    opptak_info TEXT,
    aktiv BOOLEAN NOT NULL DEFAULT true,
    opprettet_tidspunkt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    oppdatert_tidspunkt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for rask søking og filtrering
CREATE INDEX idx_opptak_navn ON opptak(navn);
CREATE INDEX idx_opptak_opptakstype ON opptak(opptakstype);
CREATE INDEX idx_opptak_soknadsfrist ON opptak(soknadsfrist);
CREATE INDEX idx_opptak_semester ON opptak(semester);
CREATE INDEX idx_opptak_aar ON opptak(aar);
CREATE INDEX idx_opptak_status ON opptak(status);
CREATE INDEX idx_opptak_aktiv ON opptak(aktiv);
CREATE INDEX idx_opptak_institusjon_id ON opptak(institusjon_id);
CREATE INDEX idx_opptak_semester_aar ON opptak(semester, aar);

-- Composite index for common queries
CREATE INDEX idx_opptak_aktiv_soknadsfrist ON opptak(aktiv, soknadsfrist);

-- Trigger for automatisk oppdatering av oppdatert_tidspunkt
CREATE TRIGGER opptak_updated_timestamp
    BEFORE UPDATE ON opptak
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_timestamp();

-- Legg til noen test-data
INSERT INTO opptak (
    navn, beskrivelse, opptakstype, soknadsfrist, svarselskapsfrist, studieopptaksfrist,
    semester, aar, opptaksomgang, status, max_soknader_per_person, institusjon_id,
    ekstern_url, opptak_info
) VALUES 
(
    'Samordnet opptak høst 2025',
    'Opptak til høyere utdanning for studieåret 2025/2026 gjennom Samordnet opptak.',
    'Samordnet opptak',
    '2025-04-15',
    '2025-07-20',
    '2025-08-15',
    'Høst',
    2025,
    'Hovedomgang',
    'Åpen',
    12,
    NULL,
    'https://www.samordnetopptak.no',
    'Samordnet opptak koordinerer opptak til de fleste studieplasser ved offentlige universiteter og høgskoler i Norge.'
),
(
    'NTNU Lokalt opptak vår 2025',
    'Lokalt opptak ved NTNU for våropptak 2025.',
    'Lokalt opptak',
    '2024-12-01',
    '2025-01-15',
    '2025-02-01',
    'Vår',
    2025,
    'Hovedomgang',
    'Stengt',
    8,
    (SELECT id FROM institusjon WHERE institusjonsnavn = 'NTNU' LIMIT 1),
    'https://www.ntnu.no/studier/opptak',
    'Lokalt opptak for utvalgte studieprogram ved NTNU som ikke går gjennom Samordnet opptak.'
),
(
    'Samordnet opptak vår 2025',
    'Opptak til høyere utdanning for vårsemesteret 2025.',
    'Samordnet opptak',
    '2024-12-01',
    '2025-01-20',
    '2025-02-01',
    'Vår',
    2025,
    'Hovedomgang',
    'Avsluttet',
    12,
    NULL,
    'https://www.samordnetopptak.no',
    'Våropptak gjennom Samordnet opptak for 2025.'
);