-- Person tabell for opptakssystemet
CREATE TABLE person (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fornavn VARCHAR(100) NOT NULL,
    mellomnavn VARCHAR(100),
    etternavn VARCHAR(100) NOT NULL,
    fodselsnummer VARCHAR(11) UNIQUE,
    fodselsdato DATE,
    epost VARCHAR(255),
    telefon VARCHAR(20),
    adresse VARCHAR(255),
    postnummer VARCHAR(4),
    poststed VARCHAR(100),
    statsborgerskap VARCHAR(100),
    opprettet_tidspunkt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    oppdatert_tidspunkt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for rask søking
CREATE INDEX idx_person_fodselsnummer ON person(fodselsnummer);
CREATE INDEX idx_person_epost ON person(epost);
CREATE INDEX idx_person_navn ON person(etternavn, fornavn);
CREATE INDEX idx_person_poststed ON person(poststed);
CREATE INDEX idx_person_fodselsdato ON person(fodselsdato);

-- Trigger for automatisk oppdatering av oppdatert_tidspunkt
CREATE TRIGGER person_updated_timestamp
    BEFORE UPDATE ON person
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_timestamp();