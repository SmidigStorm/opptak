package no.opptak.opptak;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/opptak")
public class OpptakController {

    private final OpptakService opptakService;

    @Autowired
    public OpptakController(OpptakService opptakService) {
        this.opptakService = opptakService;
    }

    @GetMapping
    public ResponseEntity<List<Opptak>> hentAlleOpptak(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String opptakstype,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) Integer aar,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID institusjonId,
            @RequestParam(required = false, defaultValue = "true") Boolean kunAktive) {
        
        List<Opptak> opptak;
        
        if (search != null && !search.trim().isEmpty()) {
            opptak = opptakService.sokOpptak(search);
        } else if (opptakstype != null && !opptakstype.trim().isEmpty()) {
            opptak = opptakService.hentOpptakByType(opptakstype);
        } else if (semester != null && !semester.trim().isEmpty() && aar != null) {
            opptak = opptakService.hentOpptakBySemesterOgAar(semester, aar);
        } else if (semester != null && !semester.trim().isEmpty()) {
            opptak = opptakService.hentOpptakBySemester(semester);
        } else if (aar != null) {
            opptak = opptakService.hentOpptakByAar(aar);
        } else if (status != null && !status.trim().isEmpty()) {
            opptak = opptakService.hentOpptakByStatus(status);
        } else if (institusjonId != null) {
            opptak = opptakService.hentOpptakByInstitusjon(institusjonId);
        } else if (kunAktive) {
            opptak = opptakService.hentAktiveOpptak();
        } else {
            opptak = opptakService.hentAlleOpptak();
        }
        
        return ResponseEntity.ok(opptak);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Opptak> hentOpptak(@PathVariable UUID id) {
        return opptakService.hentOpptak(id)
            .map(opptak -> ResponseEntity.ok(opptak))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kommende")
    public ResponseEntity<List<Opptak>> hentKommendeOpptak() {
        List<Opptak> opptak = opptakService.hentKommendeOpptak();
        return ResponseEntity.ok(opptak);
    }

    @GetMapping("/aktive-kommende")
    public ResponseEntity<List<Opptak>> hentAktiveKommendeOpptak() {
        List<Opptak> opptak = opptakService.hentAktiveKommendeOpptak();
        return ResponseEntity.ok(opptak);
    }

    @GetMapping("/utlopte")
    public ResponseEntity<List<Opptak>> hentUtlopteOpptak() {
        List<Opptak> opptak = opptakService.hentUtlopteOpptak();
        return ResponseEntity.ok(opptak);
    }

    @GetMapping("/samordnet")
    public ResponseEntity<List<Opptak>> hentSamordnetOpptak() {
        List<Opptak> opptak = opptakService.hentSamordnetOpptak();
        return ResponseEntity.ok(opptak);
    }

    @GetMapping("/lokale")
    public ResponseEntity<List<Opptak>> hentLokaleOpptak() {
        List<Opptak> opptak = opptakService.hentLokaleOpptak();
        return ResponseEntity.ok(opptak);
    }

    @GetMapping("/periode")
    public ResponseEntity<List<Opptak>> hentOpptakByFristPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fraDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tilDate) {
        
        List<Opptak> opptak = opptakService.hentOpptakByFristPeriode(fraDate, tilDate);
        return ResponseEntity.ok(opptak);
    }

    @PostMapping
    public ResponseEntity<Opptak> opprettOpptak(@Valid @RequestBody Opptak opptak) {
        try {
            Opptak opprettetOpptak = opptakService.opprettOpptak(opptak);
            return ResponseEntity.status(HttpStatus.CREATED).body(opprettetOpptak);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Opptak> oppdaterOpptak(
            @PathVariable UUID id, 
            @Valid @RequestBody Opptak opptak) {
        try {
            Opptak oppdatertOpptak = opptakService.oppdaterOpptak(id, opptak);
            return ResponseEntity.ok(oppdatertOpptak);
        } catch (OpptakService.OpptakNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> slettOpptak(@PathVariable UUID id) {
        try {
            opptakService.slettOpptak(id);
            return ResponseEntity.noContent().build();
        } catch (OpptakService.OpptakNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deaktiver")
    public ResponseEntity<Void> deaktiverOpptak(@PathVariable UUID id) {
        try {
            opptakService.deaktiverOpptak(id);
            return ResponseEntity.ok().build();
        } catch (OpptakService.OpptakNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/aktiver")
    public ResponseEntity<Void> aktiverOpptak(@PathVariable UUID id) {
        try {
            opptakService.aktiverOpptak(id);
            return ResponseEntity.ok().build();
        } catch (OpptakService.OpptakNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> oppdaterStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        try {
            opptakService.oppdaterStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (OpptakService.OpptakNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints for å hente filter-verdier
    @GetMapping("/opptakstyper")
    public ResponseEntity<List<String>> hentOpptakstyper() {
        List<String> opptakstyper = opptakService.hentOpptakstyper();
        return ResponseEntity.ok(opptakstyper);
    }

    @GetMapping("/semestre")
    public ResponseEntity<List<String>> hentSemestre() {
        List<String> semestre = opptakService.hentSemestre();
        return ResponseEntity.ok(semestre);
    }

    @GetMapping("/aar")
    public ResponseEntity<List<Integer>> hentAar() {
        List<Integer> aar = opptakService.hentAar();
        return ResponseEntity.ok(aar);
    }

    @GetMapping("/statuser")
    public ResponseEntity<List<String>> hentStatuser() {
        List<String> statuser = opptakService.hentStatuser();
        return ResponseEntity.ok(statuser);
    }

    // Endpoints for statistikk
    @GetMapping("/statistikk/institusjon/{institusjonId}")
    public ResponseEntity<Long> tellOpptakForInstitusjon(@PathVariable UUID institusjonId) {
        long antall = opptakService.tellOpptakForInstitusjon(institusjonId);
        return ResponseEntity.ok(antall);
    }

    @GetMapping("/statistikk/type/{opptakstype}")
    public ResponseEntity<Long> tellOpptakByType(@PathVariable String opptakstype) {
        long antall = opptakService.tellOpptakByType(opptakstype);
        return ResponseEntity.ok(antall);
    }

    @GetMapping("/statistikk/semester")
    public ResponseEntity<Long> tellOpptakBySemesterOgAar(
            @RequestParam String semester,
            @RequestParam Integer aar) {
        long antall = opptakService.tellOpptakBySemesterOgAar(semester, aar);
        return ResponseEntity.ok(antall);
    }
}