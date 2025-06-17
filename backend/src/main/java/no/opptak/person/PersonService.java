package no.opptak.person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PersonService {

    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Transactional(readOnly = true)
    public List<Person> hentAllePersoner() {
        return personRepository.findAllByOrderByEtternavn();
    }

    @Transactional(readOnly = true)
    public Optional<Person> hentPerson(UUID id) {
        return personRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Person> hentPersonByFodselsnummer(String fodselsnummer) {
        return personRepository.findByFodselsnummer(fodselsnummer);
    }

    @Transactional(readOnly = true)
    public List<Person> sokPersoner(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return hentAllePersoner();
        }
        return personRepository.findBySearchTerm(searchTerm.trim());
    }

    @Transactional(readOnly = true)
    public List<Person> hentPersonerByPoststed(String poststed) {
        return personRepository.findByPoststed(poststed);
    }

    @Transactional(readOnly = true)
    public List<Person> hentPersonerByStatsborgerskap(String statsborgerskap) {
        return personRepository.findByStatsborgerskap(statsborgerskap);
    }

    @Transactional(readOnly = true)
    public List<Person> hentPersonerByAldersgruppe(LocalDate startDate, LocalDate endDate) {
        return personRepository.findByFodselsdatoBetween(startDate, endDate);
    }

    public Person opprettPerson(Person person) {
        // Valider at fødselsnummer ikke allerede eksisterer
        if (person.getFodselsnummer() != null && 
            personRepository.existsByFodselsnummer(person.getFodselsnummer())) {
            throw new PersonExistsException("En person med fødselsnummer " + 
                person.getFodselsnummer() + " eksisterer allerede");
        }
        
        // Valider at e-post ikke allerede eksisterer
        if (person.getEpost() != null && 
            personRepository.existsByEpost(person.getEpost())) {
            throw new PersonExistsException("En person med e-post " + 
                person.getEpost() + " eksisterer allerede");
        }
        
        return personRepository.save(person);
    }

    public Person oppdaterPerson(UUID id, Person oppdatertPerson) {
        Person eksisterendePerson = personRepository.findById(id)
            .orElseThrow(() -> new PersonNotFoundException("Person med ID " + id + " ikke funnet"));

        // Valider at fødselsnummer ikke endres til et som allerede eksisterer
        if (oppdatertPerson.getFodselsnummer() != null && 
            !oppdatertPerson.getFodselsnummer().equals(eksisterendePerson.getFodselsnummer()) &&
            personRepository.existsByFodselsnummer(oppdatertPerson.getFodselsnummer())) {
            throw new PersonExistsException("En person med fødselsnummer " + 
                oppdatertPerson.getFodselsnummer() + " eksisterer allerede");
        }

        // Valider at e-post ikke endres til en som allerede eksisterer
        if (oppdatertPerson.getEpost() != null && 
            !oppdatertPerson.getEpost().equals(eksisterendePerson.getEpost()) &&
            personRepository.existsByEpost(oppdatertPerson.getEpost())) {
            throw new PersonExistsException("En person med e-post " + 
                oppdatertPerson.getEpost() + " eksisterer allerede");
        }

        // Oppdater felt
        eksisterendePerson.setFornavn(oppdatertPerson.getFornavn());
        eksisterendePerson.setMellomnavn(oppdatertPerson.getMellomnavn());
        eksisterendePerson.setEtternavn(oppdatertPerson.getEtternavn());
        eksisterendePerson.setFodselsnummer(oppdatertPerson.getFodselsnummer());
        eksisterendePerson.setFodselsdato(oppdatertPerson.getFodselsdato());
        eksisterendePerson.setEpost(oppdatertPerson.getEpost());
        eksisterendePerson.setTelefon(oppdatertPerson.getTelefon());
        eksisterendePerson.setAdresse(oppdatertPerson.getAdresse());
        eksisterendePerson.setPostnummer(oppdatertPerson.getPostnummer());
        eksisterendePerson.setPoststed(oppdatertPerson.getPoststed());
        eksisterendePerson.setStatsborgerskap(oppdatertPerson.getStatsborgerskap());

        return personRepository.save(eksisterendePerson);
    }

    public void slettPerson(UUID id) {
        if (!personRepository.existsById(id)) {
            throw new PersonNotFoundException("Person med ID " + id + " ikke funnet");
        }
        
        // TODO: Sjekk om personen har tilknyttede søknader
        // For nå tillater vi sletting
        
        personRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public long tellPersonerIAldersgruppe(int minAlder, int maxAlder) {
        LocalDate today = LocalDate.now();
        LocalDate maxFodselsdato = today.minusYears(minAlder);
        LocalDate minFodselsdato = today.minusYears(maxAlder + 1);
        
        return personRepository.countByAldersgruppe(minFodselsdato, maxFodselsdato);
    }

    // Exception classes
    public static class PersonNotFoundException extends RuntimeException {
        public PersonNotFoundException(String message) {
            super(message);
        }
    }

    public static class PersonExistsException extends RuntimeException {
        public PersonExistsException(String message) {
            super(message);
        }
    }
}