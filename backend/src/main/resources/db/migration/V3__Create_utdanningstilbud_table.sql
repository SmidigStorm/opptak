-- Utdanningstilbud tabell for opptakssystemet
CREATE TABLE utdanningstilbud (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    navn VARCHAR(255) NOT NULL,
    beskrivelse TEXT,
    utdanningsnivaa VARCHAR(100) NOT NULL,
    fagomraade VARCHAR(100) NOT NULL,
    varighet_semestre INTEGER NOT NULL CHECK (varighet_semestre > 0),
    studiepoeng INTEGER NOT NULL CHECK (studiepoeng > 0),
    undervisningsspråk VARCHAR(50),
    oppstartssemestre VARCHAR(50), -- "Høst", "Vår", "Høst,Vår"
    opptakskrav TEXT,
    studieavgift INTEGER CHECK (studieavgift >= 0), -- Per år i NOK
    kapasitet INTEGER CHECK (kapasitet > 0), -- Maksimalt antall studenter per år
    institusjon_id UUID NOT NULL REFERENCES institusjon(id) ON DELETE CASCADE,
    aktiv BOOLEAN NOT NULL DEFAULT true,
    opprettet_tidspunkt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    oppdatert_tidspunkt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for rask søking og filtrering
CREATE INDEX idx_utdanningstilbud_navn ON utdanningstilbud(navn);
CREATE INDEX idx_utdanningstilbud_utdanningsnivaa ON utdanningstilbud(utdanningsnivaa);
CREATE INDEX idx_utdanningstilbud_fagomraade ON utdanningstilbud(fagomraade);
CREATE INDEX idx_utdanningstilbud_institusjon_id ON utdanningstilbud(institusjon_id);
CREATE INDEX idx_utdanningstilbud_aktiv ON utdanningstilbud(aktiv);
CREATE INDEX idx_utdanningstilbud_studiepoeng ON utdanningstilbud(studiepoeng);
CREATE INDEX idx_utdanningstilbud_varighet ON utdanningstilbud(varighet_semestre);
CREATE INDEX idx_utdanningstilbud_undervisningsspråk ON utdanningstilbud(undervisningsspråk);

-- Trigger for automatisk oppdatering av oppdatert_tidspunkt
CREATE TRIGGER utdanningstilbud_updated_timestamp
    BEFORE UPDATE ON utdanningstilbud
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_timestamp();

-- Legg til noen test-data
INSERT INTO utdanningstilbud (
    navn, beskrivelse, utdanningsnivaa, fagomraade, varighet_semestre, studiepoeng,
    undervisningsspråk, oppstartssemestre, opptakskrav, studieavgift, kapasitet, institusjon_id
) VALUES 
(
    'Informatikk - Bachelor',
    'Bachelor i informatikk med fokus på programmering, algoritmer og systemutvikling.',
    'Bachelor',
    'Teknologi og ingeniørfag',
    6,
    180,
    'Norsk',
    'Høst',
    'Generell studiekompetanse. Matematikk R1 og R2 anbefales.',
    0,
    120,
    (SELECT id FROM institusjon WHERE institusjonsnavn = 'NTNU' LIMIT 1)
),
(
    'Samfunnsøkonomi - Master',
    'Masterprogram i samfunnsøkonomi med vekt på økonomisk analyse og politikkutforming.',
    'Master',
    'Samfunnsfag',
    4,
    120,
    'Norsk',
    'Høst,Vår',
    'Bachelor i økonomi eller tilsvarende. Minimum karaktersnitt C.',
    0,
    60,
    (SELECT id FROM institusjon WHERE institusjonsnavn = 'NTNU' LIMIT 1)
);