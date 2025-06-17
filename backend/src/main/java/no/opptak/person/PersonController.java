package no.opptak.person;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/personer")
@CrossOrigin(origins = "http://localhost:3001")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public ResponseEntity<List<Person>> hentAllePersoner(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String poststed,
            @RequestParam(required = false) String statsborgerskap) {
        
        List<Person> personer;
        
        if (search != null && !search.trim().isEmpty()) {
            personer = personService.sokPersoner(search);
        } else if (poststed != null && !poststed.trim().isEmpty()) {
            personer = personService.hentPersonerByPoststed(poststed);
        } else if (statsborgerskap != null && !statsborgerskap.trim().isEmpty()) {
            personer = personService.hentPersonerByStatsborgerskap(statsborgerskap);
        } else {
            personer = personService.hentAllePersoner();
        }
        
        return ResponseEntity.ok(personer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> hentPerson(@PathVariable UUID id) {
        return personService.hentPerson(id)
            .map(person -> ResponseEntity.ok(person))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/fodselsnummer/{fodselsnummer}")
    public ResponseEntity<Person> hentPersonByFodselsnummer(
            @PathVariable String fodselsnummer) {
        return personService.hentPersonByFodselsnummer(fodselsnummer)
            .map(person -> ResponseEntity.ok(person))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/aldersgruppe")
    public ResponseEntity<List<Person>> hentPersonerByAldersgruppe(
            @RequestParam int minAlder,
            @RequestParam int maxAlder) {
        
        LocalDate today = LocalDate.now();
        LocalDate maxFodselsdato = today.minusYears(minAlder);
        LocalDate minFodselsdato = today.minusYears(maxAlder + 1);
        
        List<Person> personer = personService.hentPersonerByAldersgruppe(minFodselsdato, maxFodselsdato);
        return ResponseEntity.ok(personer);
    }

    @PostMapping
    public ResponseEntity<Person> opprettPerson(@Valid @RequestBody Person person) {
        try {
            Person opprettetPerson = personService.opprettPerson(person);
            return ResponseEntity.status(HttpStatus.CREATED).body(opprettetPerson);
        } catch (PersonService.PersonExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Person> oppdaterPerson(
            @PathVariable UUID id, 
            @Valid @RequestBody Person person) {
        try {
            Person oppdatertPerson = personService.oppdaterPerson(id, person);
            return ResponseEntity.ok(oppdatertPerson);
        } catch (PersonService.PersonNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (PersonService.PersonExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> slettPerson(@PathVariable UUID id) {
        try {
            personService.slettPerson(id);
            return ResponseEntity.noContent().build();
        } catch (PersonService.PersonNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint for statistikk
    @GetMapping("/statistikk/aldersgruppe")
    public ResponseEntity<Long> tellPersonerIAldersgruppe(
            @RequestParam int minAlder,
            @RequestParam int maxAlder) {
        long antall = personService.tellPersonerIAldersgruppe(minAlder, maxAlder);
        return ResponseEntity.ok(antall);
    }

    // Endpoint for å hente vanlige statsborgerskap
    @GetMapping("/statsborgerskap")
    public ResponseEntity<List<String>> hentStatsborgerskap() {
        List<String> statsborgerskap = List.of(
            "Norge",
            "Sverige", 
            "Danmark",
            "Finland",
            "Island",
            "Tyskland",
            "Storbritannia",
            "USA",
            "Polen",
            "Somalia",
            "Pakistan",
            "Irak",
            "Litauen"
        );
        return ResponseEntity.ok(statsborgerskap);
    }
}