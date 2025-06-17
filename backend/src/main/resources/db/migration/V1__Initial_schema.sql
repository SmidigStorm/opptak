-- Initial schema for opptakssystem
-- Basert på domenekunnskap i /domenekunnskap mappen

-- Institusjon tabell
CREATE TABLE institusjon (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institusjonsnavn VARCHAR(255) NOT NULL,
    organisasjonsnummer VARCHAR(9) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- Universitet, Høyskole, Privat høyskole, etc.
    adresse VARCHAR(255),
    postnummer VARCHAR(4),
    poststed VARCHAR(100),
    epost VARCHAR(255),
    telefon VARCHAR(20),
    spesialiseringsområde TEXT, -- For høyskoler
    akkrediteringsstatus VARCHAR(50), -- For private institusjoner
    opprettet_tidspunkt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    oppdatert_tidspunkt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for rask søking
CREATE INDEX idx_institusjon_organisasjonsnummer ON institusjon(organisasjonsnummer);
CREATE INDEX idx_institusjon_type ON institusjon(type);
CREATE INDEX idx_institusjon_navn ON institusjon(institusjonsnavn);

-- Trigger for automatisk oppdatering av oppdatert_tidspunkt
CREATE OR REPLACE FUNCTION update_updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.oppdatert_tidspunkt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER institusjon_updated_timestamp
    BEFORE UPDATE ON institusjon
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_timestamp();

-- Legg til test-data for institusjoner
INSERT INTO institusjon (
    institusjonsnavn, organisasjonsnummer, type, adresse, postnummer, poststed, epost, telefon
) VALUES 
(
    'NTNU',
    '974767880',
    'Universitet',
    'Høgskoleringen 1',
    '7491',
    'Trondheim',
    'post@ntnu.no',
    '73 59 50 00'
),
(
    'Universitetet i Oslo',
    '971035854',
    'Universitet',
    'Problemveien 7',
    '0313',
    'Oslo',
    'post@uio.no',
    '22 85 50 50'
),
(
    'Høgskolen i Østfold',
    '970468677',
    'Høyskole',
    'Remmen 1',
    '1757',
    'Halden',
    'post@hiof.no',
    '69 60 80 00'
);