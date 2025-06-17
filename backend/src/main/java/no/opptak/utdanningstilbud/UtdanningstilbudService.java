package no.opptak.utdanningstilbud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UtdanningstilbudService {

    private final UtdanningstilbudRepository utdanningstilbudRepository;

    @Autowired
    public UtdanningstilbudService(UtdanningstilbudRepository utdanningstilbudRepository) {
        this.utdanningstilbudRepository = utdanningstilbudRepository;
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentAlleUtdanningstilbud() {
        return utdanningstilbudRepository.findAllByOrderByNavn();
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentAktiveUtdanningstilbud() {
        return utdanningstilbudRepository.findAllAktiveOrderByNavn();
    }

    @Transactional(readOnly = true)
    public Optional<Utdanningstilbud> hentUtdanningstilbud(UUID id) {
        return utdanningstilbudRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> sokUtdanningstilbud(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return hentAktiveUtdanningstilbud();
        }
        return utdanningstilbudRepository.findBySearchTerm(searchTerm.trim());
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentUtdanningstilbudByUtdanningsnivaa(String utdanningsnivaa) {
        return utdanningstilbudRepository.findByUtdanningsnivaa(utdanningsnivaa);
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentUtdanningstilbudByFagomraade(String fagomraade) {
        return utdanningstilbudRepository.findByFagomraade(fagomraade);
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentUtdanningstilbudByInstitusjon(UUID institusjonId) {
        return utdanningstilbudRepository.findByInstitusjonId(institusjonId);
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentUtdanningstilbudByUndervisningsspråk(String undervisningsspråk) {
        return utdanningstilbudRepository.findByUndervisningsspråk(undervisningsspråk);
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentUtdanningstilbudByOppstartssemester(String oppstartssemester) {
        return utdanningstilbudRepository.findByOppstartssemester(oppstartssemester);
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentUtdanningstilbudByStudiepoengRange(Integer minStudiepoeng, Integer maxStudiepoeng) {
        return utdanningstilbudRepository.findByStudiepoengBetween(minStudiepoeng, maxStudiepoeng);
    }

    @Transactional(readOnly = true)
    public List<Utdanningstilbud> hentUtdanningstilbudByVarighetRange(Integer minSemestre, Integer maxSemestre) {
        return utdanningstilbudRepository.findByVarighetSemestreBetween(minSemestre, maxSemestre);
    }

    public Utdanningstilbud opprettUtdanningstilbud(Utdanningstilbud utdanningstilbud) {
        // Valider at institusjon eksisterer (dette håndteres av foreign key constraint)
        
        // Sett default verdier
        if (utdanningstilbud.getAktiv() == null) {
            utdanningstilbud.setAktiv(true);
        }
        
        return utdanningstilbudRepository.save(utdanningstilbud);
    }

    public Utdanningstilbud oppdaterUtdanningstilbud(UUID id, Utdanningstilbud oppdatertUtdanningstilbud) {
        Utdanningstilbud eksisterendeUtdanningstilbud = utdanningstilbudRepository.findById(id)
            .orElseThrow(() -> new UtdanningstilbudNotFoundException("Utdanningstilbud med ID " + id + " ikke funnet"));

        // Oppdater felt
        eksisterendeUtdanningstilbud.setNavn(oppdatertUtdanningstilbud.getNavn());
        eksisterendeUtdanningstilbud.setBeskrivelse(oppdatertUtdanningstilbud.getBeskrivelse());
        eksisterendeUtdanningstilbud.setUtdanningsnivaa(oppdatertUtdanningstilbud.getUtdanningsnivaa());
        eksisterendeUtdanningstilbud.setFagomraade(oppdatertUtdanningstilbud.getFagomraade());
        eksisterendeUtdanningstilbud.setVarighetSemestre(oppdatertUtdanningstilbud.getVarighetSemestre());
        eksisterendeUtdanningstilbud.setStudiepoeng(oppdatertUtdanningstilbud.getStudiepoeng());
        eksisterendeUtdanningstilbud.setUndervisningsspråk(oppdatertUtdanningstilbud.getUndervisningsspråk());
        eksisterendeUtdanningstilbud.setOppstartssemestre(oppdatertUtdanningstilbud.getOppstartssemestre());
        eksisterendeUtdanningstilbud.setOpptakskrav(oppdatertUtdanningstilbud.getOpptakskrav());
        eksisterendeUtdanningstilbud.setStudieavgift(oppdatertUtdanningstilbud.getStudieavgift());
        eksisterendeUtdanningstilbud.setKapasitet(oppdatertUtdanningstilbud.getKapasitet());
        eksisterendeUtdanningstilbud.setInstitusjon(oppdatertUtdanningstilbud.getInstitusjon());
        eksisterendeUtdanningstilbud.setAktiv(oppdatertUtdanningstilbud.getAktiv());

        return utdanningstilbudRepository.save(eksisterendeUtdanningstilbud);
    }

    public void slettUtdanningstilbud(UUID id) {
        if (!utdanningstilbudRepository.existsById(id)) {
            throw new UtdanningstilbudNotFoundException("Utdanningstilbud med ID " + id + " ikke funnet");
        }
        
        // TODO: Sjekk om utdanningstilbudet har tilknyttede søknader
        // For nå tillater vi sletting
        
        utdanningstilbudRepository.deleteById(id);
    }

    public void deaktiverUtdanningstilbud(UUID id) {
        Utdanningstilbud utdanningstilbud = utdanningstilbudRepository.findById(id)
            .orElseThrow(() -> new UtdanningstilbudNotFoundException("Utdanningstilbud med ID " + id + " ikke funnet"));
        
        utdanningstilbud.setAktiv(false);
        utdanningstilbudRepository.save(utdanningstilbud);
    }

    public void aktiverUtdanningstilbud(UUID id) {
        Utdanningstilbud utdanningstilbud = utdanningstilbudRepository.findById(id)
            .orElseThrow(() -> new UtdanningstilbudNotFoundException("Utdanningstilbud med ID " + id + " ikke funnet"));
        
        utdanningstilbud.setAktiv(true);
        utdanningstilbudRepository.save(utdanningstilbud);
    }

    @Transactional(readOnly = true)
    public List<String> hentUtdanningsnivaaer() {
        return utdanningstilbudRepository.findDistinctUtdanningsnivaaer();
    }

    @Transactional(readOnly = true)
    public List<String> hentFagomraader() {
        return utdanningstilbudRepository.findDistinctFagomraader();
    }

    @Transactional(readOnly = true)
    public List<String> hentUndervisningsspråk() {
        return utdanningstilbudRepository.findDistinctUndervisningsspråk();
    }

    @Transactional(readOnly = true)
    public long tellUtdanningstilbudForInstitusjon(UUID institusjonId) {
        return utdanningstilbudRepository.countAktiveByInstitusjonId(institusjonId);
    }

    @Transactional(readOnly = true)
    public long tellUtdanningstilbudForFagomraade(String fagomraade) {
        return utdanningstilbudRepository.countByFagomraade(fagomraade);
    }

    // Exception classes
    public static class UtdanningstilbudNotFoundException extends RuntimeException {
        public UtdanningstilbudNotFoundException(String message) {
            super(message);
        }
    }
}