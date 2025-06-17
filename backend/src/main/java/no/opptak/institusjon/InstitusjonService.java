package no.opptak.institusjon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class InstitusjonService {

    private final InstitusjonRepository institusjonRepository;

    @Autowired
    public InstitusjonService(InstitusjonRepository institusjonRepository) {
        this.institusjonRepository = institusjonRepository;
    }

    @Transactional(readOnly = true)
    public List<Institusjon> hentAlleInstitusjoner() {
        return institusjonRepository.findAllByOrderByInstitusjonsnavn();
    }

    @Transactional(readOnly = true)
    public Optional<Institusjon> hentInstitusjon(UUID id) {
        return institusjonRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Institusjon> hentInstitusjonByOrganisasjonsnummer(String organisasjonsnummer) {
        return institusjonRepository.findByOrganisasjonsnummer(organisasjonsnummer);
    }

    @Transactional(readOnly = true)
    public List<Institusjon> sokInstitusjoner(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return hentAlleInstitusjoner();
        }
        return institusjonRepository.findBySearchTerm(searchTerm.trim());
    }

    @Transactional(readOnly = true)
    public List<Institusjon> hentInstitusjonerByType(String type) {
        return institusjonRepository.findByTypeOrderByInstitusjonsnavn(type);
    }

    public Institusjon opprettInstitusjon(Institusjon institusjon) {
        // Sjekk om organisasjonsnummer allerede eksisterer
        if (institusjonRepository.existsByOrganisasjonsnummer(institusjon.getOrganisasjonsnummer())) {
            throw new InstitusjonExistsException("En institusjon med organisasjonsnummer " + 
                institusjon.getOrganisasjonsnummer() + " eksisterer allerede");
        }
        
        return institusjonRepository.save(institusjon);
    }

    public Institusjon oppdaterInstitusjon(UUID id, Institusjon oppdatertInstitusjon) {
        Institusjon eksisterendeInstitusjon = institusjonRepository.findById(id)
            .orElseThrow(() -> new InstitusjonNotFoundException("Institusjon med ID " + id + " ikke funnet"));

        // Ikke tillat endring av organisasjonsnummer
        if (!eksisterendeInstitusjon.getOrganisasjonsnummer().equals(oppdatertInstitusjon.getOrganisasjonsnummer())) {
            throw new IllegalArgumentException("Organisasjonsnummer kan ikke endres");
        }

        // Oppdater felt
        eksisterendeInstitusjon.setInstitusjonsnavn(oppdatertInstitusjon.getInstitusjonsnavn());
        eksisterendeInstitusjon.setType(oppdatertInstitusjon.getType());
        eksisterendeInstitusjon.setAdresse(oppdatertInstitusjon.getAdresse());
        eksisterendeInstitusjon.setPostnummer(oppdatertInstitusjon.getPostnummer());
        eksisterendeInstitusjon.setPoststed(oppdatertInstitusjon.getPoststed());
        eksisterendeInstitusjon.setEpost(oppdatertInstitusjon.getEpost());
        eksisterendeInstitusjon.setTelefon(oppdatertInstitusjon.getTelefon());
        eksisterendeInstitusjon.setSpesialiseringsomrade(oppdatertInstitusjon.getSpesialiseringsomrade());
        eksisterendeInstitusjon.setAkkrediteringsstatus(oppdatertInstitusjon.getAkkrediteringsstatus());

        return institusjonRepository.save(eksisterendeInstitusjon);
    }

    public void slettInstitusjon(UUID id) {
        if (!institusjonRepository.existsById(id)) {
            throw new InstitusjonNotFoundException("Institusjon med ID " + id + " ikke funnet");
        }
        
        // TODO: Sjekk om institusjonen har tilknyttede utdanningstilbud eller søknader
        // For nå tillater vi sletting
        
        institusjonRepository.deleteById(id);
    }

    // Exception classes
    public static class InstitusjonNotFoundException extends RuntimeException {
        public InstitusjonNotFoundException(String message) {
            super(message);
        }
    }

    public static class InstitusjonExistsException extends RuntimeException {
        public InstitusjonExistsException(String message) {
            super(message);
        }
    }
}