package no.opptak.person;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {

    Optional<Person> findByFodselsnummer(String fodselsnummer);

    @Query("SELECT p FROM Person p WHERE " +
           "LOWER(CONCAT(p.fornavn, ' ', COALESCE(p.mellomnavn, ''), ' ', p.etternavn)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.epost) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.poststed) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Person> findBySearchTerm(@Param("searchTerm") String searchTerm);

    List<Person> findByFodselsdatoBetween(LocalDate startDate, LocalDate endDate);

    List<Person> findByPoststed(String poststed);

    List<Person> findByStatsborgerskap(String statsborgerskap);

    List<Person> findAllByOrderByEtternavn();

    List<Person> findAllByOrderByFornavn();

    boolean existsByFodselsnummer(String fodselsnummer);

    boolean existsByEpost(String epost);

    @Query("SELECT COUNT(p) FROM Person p WHERE p.fodselsdato BETWEEN :startDate AND :endDate")
    long countByAldersgruppe(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}