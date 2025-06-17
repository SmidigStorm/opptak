package no.opptak.opptak;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class OpptakService {

    private final OpptakRepository opptakRepository;

    @Autowired
    public OpptakService(OpptakRepository opptakRepository) {
        this.opptakRepository = opptakRepository;
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentAlleOpptak() {
        return opptakRepository.findAllByOrderBySoknadsfrist();
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentAktiveOpptak() {
        return opptakRepository.findByAktiv(true);
    }

    @Transactional(readOnly = true)
    public Optional<Opptak> hentOpptak(UUID id) {
        return opptakRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Opptak> sokOpptak(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return hentAktiveOpptak();
        }
        return opptakRepository.findBySearchTerm(searchTerm.trim());
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentOpptakByType(String opptakstype) {
        return opptakRepository.findByOpptakstype(opptakstype);
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentOpptakBySemester(String semester) {
        return opptakRepository.findBySemester(semester);
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentOpptakByAar(Integer aar) {
        return opptakRepository.findByAar(aar);
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentOpptakByStatus(String status) {
        return opptakRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentOpptakByInstitusjon(UUID institusjonId) {
        return opptakRepository.findByInstitusjonId(institusjonId);
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentSamordnetOpptak() {
        return opptakRepository.findSamordnetOpptak();
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentLokaleOpptak() {
        return opptakRepository.findLokaleOpptak();
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentOpptakBySemesterOgAar(String semester, Integer aar) {
        return opptakRepository.findBySemesterAndAar(semester, aar);
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentOpptakByFristPeriode(LocalDate fraDate, LocalDate tilDate) {
        return opptakRepository.findBySoknadsfristBetween(fraDate, tilDate);
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentKommendeOpptak() {
        return opptakRepository.findKommendeOpptak(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentUtlopteOpptak() {
        return opptakRepository.findUtlopteOpptak(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<Opptak> hentAktiveKommendeOpptak() {
        return opptakRepository.findAktiveKommendeOpptak(LocalDate.now());
    }

    public Opptak opprettOpptak(Opptak opptak) {
        // Sett default verdier
        if (opptak.getAktiv() == null) {
            opptak.setAktiv(true);
        }
        
        if (opptak.getStatus() == null) {
            opptak.setStatus(utledStatus(opptak));
        }
        
        return opptakRepository.save(opptak);
    }

    public Opptak oppdaterOpptak(UUID id, Opptak oppdatertOpptak) {
        Opptak eksisterendeOpptak = opptakRepository.findById(id)
            .orElseThrow(() -> new OpptakNotFoundException("Opptak med ID " + id + " ikke funnet"));

        // Oppdater felt
        eksisterendeOpptak.setNavn(oppdatertOpptak.getNavn());
        eksisterendeOpptak.setBeskrivelse(oppdatertOpptak.getBeskrivelse());
        eksisterendeOpptak.setOpptakstype(oppdatertOpptak.getOpptakstype());
        eksisterendeOpptak.setSoknadsfrist(oppdatertOpptak.getSoknadsfrist());
        eksisterendeOpptak.setSvarselskapsfrist(oppdatertOpptak.getSvarselskapsfrist());
        eksisterendeOpptak.setStudieopptaksfrist(oppdatertOpptak.getStudieopptaksfrist());
        eksisterendeOpptak.setSemester(oppdatertOpptak.getSemester());
        eksisterendeOpptak.setAar(oppdatertOpptak.getAar());
        eksisterendeOpptak.setOpptaksomgang(oppdatertOpptak.getOpptaksomgang());
        eksisterendeOpptak.setStatus(oppdatertOpptak.getStatus());
        eksisterendeOpptak.setMaxSoknaderPerPerson(oppdatertOpptak.getMaxSoknaderPerPerson());
        eksisterendeOpptak.setInstitusjon(oppdatertOpptak.getInstitusjon());
        eksisterendeOpptak.setEksternUrl(oppdatertOpptak.getEksternUrl());
        eksisterendeOpptak.setOpptakInfo(oppdatertOpptak.getOpptakInfo());
        eksisterendeOpptak.setAktiv(oppdatertOpptak.getAktiv());

        return opptakRepository.save(eksisterendeOpptak);
    }

    public void slettOpptak(UUID id) {
        if (!opptakRepository.existsById(id)) {
            throw new OpptakNotFoundException("Opptak med ID " + id + " ikke funnet");
        }
        
        // TODO: Sjekk om opptaket har tilknyttede søknader
        // For nå tillater vi sletting
        
        opptakRepository.deleteById(id);
    }

    public void deaktiverOpptak(UUID id) {
        Opptak opptak = opptakRepository.findById(id)
            .orElseThrow(() -> new OpptakNotFoundException("Opptak med ID " + id + " ikke funnet"));
        
        opptak.setAktiv(false);
        opptak.setStatus("Stengt");
        opptakRepository.save(opptak);
    }

    public void aktiverOpptak(UUID id) {
        Opptak opptak = opptakRepository.findById(id)
            .orElseThrow(() -> new OpptakNotFoundException("Opptak med ID " + id + " ikke funnet"));
        
        opptak.setAktiv(true);
        opptak.setStatus(utledStatus(opptak));
        opptakRepository.save(opptak);
    }

    public void oppdaterStatus(UUID id, String nyStatus) {
        Opptak opptak = opptakRepository.findById(id)
            .orElseThrow(() -> new OpptakNotFoundException("Opptak med ID " + id + " ikke funnet"));
        
        opptak.setStatus(nyStatus);
        opptakRepository.save(opptak);
    }

    @Transactional(readOnly = true)
    public List<String> hentOpptakstyper() {
        return opptakRepository.findDistinctOpptakstyper();
    }

    @Transactional(readOnly = true)
    public List<String> hentSemestre() {
        return opptakRepository.findDistinctSemestre();
    }

    @Transactional(readOnly = true)
    public List<Integer> hentAar() {
        return opptakRepository.findDistinctAar();
    }

    @Transactional(readOnly = true)
    public List<String> hentStatuser() {
        return opptakRepository.findDistinctStatuser();
    }

    @Transactional(readOnly = true)
    public long tellOpptakForInstitusjon(UUID institusjonId) {
        return opptakRepository.countAktiveByInstitusjonId(institusjonId);
    }

    @Transactional(readOnly = true)
    public long tellOpptakByType(String opptakstype) {
        return opptakRepository.countByOpptakstype(opptakstype);
    }

    @Transactional(readOnly = true)
    public long tellOpptakBySemesterOgAar(String semester, Integer aar) {
        return opptakRepository.countBySemesterAndAar(semester, aar);
    }

    // Helper method for automatisk status-utledning
    private String utledStatus(Opptak opptak) {
        LocalDate idag = LocalDate.now();
        LocalDate soknadsfrist = opptak.getSoknadsfrist();
        
        if (soknadsfrist.isAfter(idag)) {
            return "Åpen";
        } else if (soknadsfrist.isEqual(idag)) {
            return "Åpen";
        } else {
            return "Stengt";
        }
    }

    // Exception classes
    public static class OpptakNotFoundException extends RuntimeException {
        public OpptakNotFoundException(String message) {
            super(message);
        }
    }
}