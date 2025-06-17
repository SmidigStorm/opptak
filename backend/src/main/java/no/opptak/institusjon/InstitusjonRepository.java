package no.opptak.institusjon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstitusjonRepository extends JpaRepository<Institusjon, UUID> {

    Optional<Institusjon> findByOrganisasjonsnummer(String organisasjonsnummer);

    @Query("SELECT i FROM Institusjon i WHERE " +
           "LOWER(i.institusjonsnavn) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.poststed) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Institusjon> findBySearchTerm(@Param("searchTerm") String searchTerm);

    List<Institusjon> findByTypeOrderByInstitusjonsnavn(String type);

    List<Institusjon> findAllByOrderByInstitusjonsnavn();

    boolean existsByOrganisasjonsnummer(String organisasjonsnummer);
}