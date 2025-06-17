package no.opptak.opptak;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface OpptakRepository extends JpaRepository<Opptak, UUID> {

    @Query("SELECT o FROM Opptak o WHERE " +
           "LOWER(o.navn) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.beskrivelse) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.opptakstype) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.semester) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CAST(o.aar AS string) LIKE CONCAT('%', :searchTerm, '%')")
    List<Opptak> findBySearchTerm(@Param("searchTerm") String searchTerm);

    List<Opptak> findByOpptakstype(String opptakstype);

    List<Opptak> findBySemester(String semester);

    List<Opptak> findByAar(Integer aar);

    List<Opptak> findByStatus(String status);

    List<Opptak> findByAktiv(Boolean aktiv);

    List<Opptak> findByInstitusjonId(UUID institusjonId);

    @Query("SELECT o FROM Opptak o WHERE o.institusjon IS NULL")
    List<Opptak> findSamordnetOpptak();

    @Query("SELECT o FROM Opptak o WHERE o.institusjon IS NOT NULL")
    List<Opptak> findLokaleOpptak();

    List<Opptak> findBySemesterAndAar(String semester, Integer aar);

    @Query("SELECT o FROM Opptak o WHERE o.soknadsfrist >= :fromDate AND o.soknadsfrist <= :toDate")
    List<Opptak> findBySoknadsfristBetween(@Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate);

    @Query("SELECT o FROM Opptak o WHERE o.soknadsfrist >= :date ORDER BY o.soknadsfrist ASC")
    List<Opptak> findKommendeOpptak(@Param("date") LocalDate date);

    @Query("SELECT o FROM Opptak o WHERE o.soknadsfrist < :date ORDER BY o.soknadsfrist DESC")
    List<Opptak> findUtlopteOpptak(@Param("date") LocalDate date);

    @Query("SELECT o FROM Opptak o WHERE o.aktiv = true AND o.soknadsfrist >= :date ORDER BY o.soknadsfrist ASC")
    List<Opptak> findAktiveKommendeOpptak(@Param("date") LocalDate date);

    List<Opptak> findAllByOrderByAar();

    List<Opptak> findAllByOrderBySoknadsfrist();

    List<Opptak> findAllByOrderByNavn();

    @Query("SELECT DISTINCT o.opptakstype FROM Opptak o ORDER BY o.opptakstype")
    List<String> findDistinctOpptakstyper();

    @Query("SELECT DISTINCT o.semester FROM Opptak o ORDER BY o.semester")
    List<String> findDistinctSemestre();

    @Query("SELECT DISTINCT o.aar FROM Opptak o ORDER BY o.aar DESC")
    List<Integer> findDistinctAar();

    @Query("SELECT DISTINCT o.status FROM Opptak o ORDER BY o.status")
    List<String> findDistinctStatuser();

    @Query("SELECT COUNT(o) FROM Opptak o WHERE o.institusjon.id = :institusjonId AND o.aktiv = true")
    long countAktiveByInstitusjonId(@Param("institusjonId") UUID institusjonId);

    @Query("SELECT COUNT(o) FROM Opptak o WHERE o.opptakstype = :opptakstype AND o.aktiv = true")
    long countByOpptakstype(@Param("opptakstype") String opptakstype);

    @Query("SELECT COUNT(o) FROM Opptak o WHERE o.semester = :semester AND o.aar = :aar AND o.aktiv = true")
    long countBySemesterAndAar(@Param("semester") String semester, @Param("aar") Integer aar);
}