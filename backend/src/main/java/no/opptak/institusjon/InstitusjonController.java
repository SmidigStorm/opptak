package no.opptak.institusjon;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/institusjoner")
@CrossOrigin(origins = "http://localhost:3001")
public class InstitusjonController {

    private final InstitusjonService institusjonService;

    @Autowired
    public InstitusjonController(InstitusjonService institusjonService) {
        this.institusjonService = institusjonService;
    }

    @GetMapping
    public ResponseEntity<List<Institusjon>> hentAlleInstitusjoner(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {
        
        List<Institusjon> institusjoner;
        
        if (search != null && !search.trim().isEmpty()) {
            institusjoner = institusjonService.sokInstitusjoner(search);
        } else if (type != null && !type.trim().isEmpty()) {
            institusjoner = institusjonService.hentInstitusjonerByType(type);
        } else {
            institusjoner = institusjonService.hentAlleInstitusjoner();
        }
        
        return ResponseEntity.ok(institusjoner);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Institusjon> hentInstitusjon(@PathVariable UUID id) {
        return institusjonService.hentInstitusjon(id)
            .map(institusjon -> ResponseEntity.ok(institusjon))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/organisasjonsnummer/{organisasjonsnummer}")
    public ResponseEntity<Institusjon> hentInstitusjonByOrganisasjonsnummer(
            @PathVariable String organisasjonsnummer) {
        return institusjonService.hentInstitusjonByOrganisasjonsnummer(organisasjonsnummer)
            .map(institusjon -> ResponseEntity.ok(institusjon))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Institusjon> opprettInstitusjon(@Valid @RequestBody Institusjon institusjon) {
        try {
            Institusjon opprettetInstitusjon = institusjonService.opprettInstitusjon(institusjon);
            return ResponseEntity.status(HttpStatus.CREATED).body(opprettetInstitusjon);
        } catch (InstitusjonService.InstitusjonExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Institusjon> oppdaterInstitusjon(
            @PathVariable UUID id, 
            @Valid @RequestBody Institusjon institusjon) {
        try {
            Institusjon oppdatertInstitusjon = institusjonService.oppdaterInstitusjon(id, institusjon);
            return ResponseEntity.ok(oppdatertInstitusjon);
        } catch (InstitusjonService.InstitusjonNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> slettInstitusjon(@PathVariable UUID id) {
        try {
            institusjonService.slettInstitusjon(id);
            return ResponseEntity.noContent().build();
        } catch (InstitusjonService.InstitusjonNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint for å hente institusjonstyper (kan utvides senere)
    @GetMapping("/typer")
    public ResponseEntity<List<String>> hentInstitusjonstyper() {
        List<String> typer = List.of(
            "Universitet",
            "Høyskole", 
            "Privat høyskole",
            "Fagskole"
        );
        return ResponseEntity.ok(typer);
    }
}