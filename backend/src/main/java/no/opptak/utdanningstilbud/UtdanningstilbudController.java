package no.opptak.utdanningstilbud;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/utdanningstilbud")
public class UtdanningstilbudController {

    private final UtdanningstilbudService utdanningstilbudService;

    @Autowired
    public UtdanningstilbudController(UtdanningstilbudService utdanningstilbudService) {
        this.utdanningstilbudService = utdanningstilbudService;
    }

    @GetMapping
    public ResponseEntity<List<Utdanningstilbud>> hentAlleUtdanningstilbud(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String utdanningsnivaa,
            @RequestParam(required = false) String fagomraade,
            @RequestParam(required = false) UUID institusjonId,
            @RequestParam(required = false) String undervisningsspråk,
            @RequestParam(required = false) String oppstartssemester,
            @RequestParam(required = false, defaultValue = "true") Boolean kunAktive) {
        
        List<Utdanningstilbud> utdanningstilbud;
        
        if (search != null && !search.trim().isEmpty()) {
            utdanningstilbud = utdanningstilbudService.sokUtdanningstilbud(search);
        } else if (utdanningsnivaa != null && !utdanningsnivaa.trim().isEmpty()) {
            utdanningstilbud = utdanningstilbudService.hentUtdanningstilbudByUtdanningsnivaa(utdanningsnivaa);
        } else if (fagomraade != null && !fagomraade.trim().isEmpty()) {
            utdanningstilbud = utdanningstilbudService.hentUtdanningstilbudByFagomraade(fagomraade);
        } else if (institusjonId != null) {
            utdanningstilbud = utdanningstilbudService.hentUtdanningstilbudByInstitusjon(institusjonId);
        } else if (undervisningsspråk != null && !undervisningsspråk.trim().isEmpty()) {
            utdanningstilbud = utdanningstilbudService.hentUtdanningstilbudByUndervisningsspråk(undervisningsspråk);
        } else if (oppstartssemester != null && !oppstartssemester.trim().isEmpty()) {
            utdanningstilbud = utdanningstilbudService.hentUtdanningstilbudByOppstartssemester(oppstartssemester);
        } else if (kunAktive) {
            utdanningstilbud = utdanningstilbudService.hentAktiveUtdanningstilbud();
        } else {
            utdanningstilbud = utdanningstilbudService.hentAlleUtdanningstilbud();
        }
        
        return ResponseEntity.ok(utdanningstilbud);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utdanningstilbud> hentUtdanningstilbud(@PathVariable UUID id) {
        return utdanningstilbudService.hentUtdanningstilbud(id)
            .map(utdanningstilbud -> ResponseEntity.ok(utdanningstilbud))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/studiepoeng")
    public ResponseEntity<List<Utdanningstilbud>> hentUtdanningstilbudByStudiepoengRange(
            @RequestParam int minStudiepoeng,
            @RequestParam int maxStudiepoeng) {
        
        List<Utdanningstilbud> utdanningstilbud = utdanningstilbudService
            .hentUtdanningstilbudByStudiepoengRange(minStudiepoeng, maxStudiepoeng);
        return ResponseEntity.ok(utdanningstilbud);
    }

    @GetMapping("/varighet")
    public ResponseEntity<List<Utdanningstilbud>> hentUtdanningstilbudByVarighetRange(
            @RequestParam int minSemestre,
            @RequestParam int maxSemestre) {
        
        List<Utdanningstilbud> utdanningstilbud = utdanningstilbudService
            .hentUtdanningstilbudByVarighetRange(minSemestre, maxSemestre);
        return ResponseEntity.ok(utdanningstilbud);
    }

    @PostMapping
    public ResponseEntity<Utdanningstilbud> opprettUtdanningstilbud(@Valid @RequestBody Utdanningstilbud utdanningstilbud) {
        try {
            Utdanningstilbud opprettetUtdanningstilbud = utdanningstilbudService.opprettUtdanningstilbud(utdanningstilbud);
            return ResponseEntity.status(HttpStatus.CREATED).body(opprettetUtdanningstilbud);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utdanningstilbud> oppdaterUtdanningstilbud(
            @PathVariable UUID id, 
            @Valid @RequestBody Utdanningstilbud utdanningstilbud) {
        try {
            Utdanningstilbud oppdatertUtdanningstilbud = utdanningstilbudService.oppdaterUtdanningstilbud(id, utdanningstilbud);
            return ResponseEntity.ok(oppdatertUtdanningstilbud);
        } catch (UtdanningstilbudService.UtdanningstilbudNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> slettUtdanningstilbud(@PathVariable UUID id) {
        try {
            utdanningstilbudService.slettUtdanningstilbud(id);
            return ResponseEntity.noContent().build();
        } catch (UtdanningstilbudService.UtdanningstilbudNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deaktiver")
    public ResponseEntity<Void> deaktiverUtdanningstilbud(@PathVariable UUID id) {
        try {
            utdanningstilbudService.deaktiverUtdanningstilbud(id);
            return ResponseEntity.ok().build();
        } catch (UtdanningstilbudService.UtdanningstilbudNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/aktiver")
    public ResponseEntity<Void> aktiverUtdanningstilbud(@PathVariable UUID id) {
        try {
            utdanningstilbudService.aktiverUtdanningstilbud(id);
            return ResponseEntity.ok().build();
        } catch (UtdanningstilbudService.UtdanningstilbudNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints for å hente filter-verdier
    @GetMapping("/utdanningsnivaaer")
    public ResponseEntity<List<String>> hentUtdanningsnivaaer() {
        List<String> utdanningsnivaaer = utdanningstilbudService.hentUtdanningsnivaaer();
        return ResponseEntity.ok(utdanningsnivaaer);
    }

    @GetMapping("/fagomraader")
    public ResponseEntity<List<String>> hentFagomraader() {
        List<String> fagomraader = utdanningstilbudService.hentFagomraader();
        return ResponseEntity.ok(fagomraader);
    }

    @GetMapping("/undervisningsspråk")
    public ResponseEntity<List<String>> hentUndervisningsspråk() {
        List<String> språk = utdanningstilbudService.hentUndervisningsspråk();
        return ResponseEntity.ok(språk);
    }

    // Endpoint for statistikk
    @GetMapping("/statistikk/institusjon/{institusjonId}")
    public ResponseEntity<Long> tellUtdanningstilbudForInstitusjon(@PathVariable UUID institusjonId) {
        long antall = utdanningstilbudService.tellUtdanningstilbudForInstitusjon(institusjonId);
        return ResponseEntity.ok(antall);
    }

    @GetMapping("/statistikk/fagomraade/{fagomraade}")
    public ResponseEntity<Long> tellUtdanningstilbudForFagomraade(@PathVariable String fagomraade) {
        long antall = utdanningstilbudService.tellUtdanningstilbudForFagomraade(fagomraade);
        return ResponseEntity.ok(antall);
    }
}