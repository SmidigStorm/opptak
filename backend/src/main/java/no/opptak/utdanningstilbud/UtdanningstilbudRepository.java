package no.opptak.utdanningstilbud;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UtdanningstilbudRepository extends JpaRepository<Utdanningstilbud, UUID> {

    @Query("SELECT u FROM Utdanningstilbud u WHERE " +
           "LOWER(u.navn) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.beskrivelse) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.fagomraade) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.institusjon.institusjonsnavn) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Utdanningstilbud> findBySearchTerm(@Param("searchTerm") String searchTerm);

    List<Utdanningstilbud> findByUtdanningsnivaa(String utdanningsnivaa);

    List<Utdanningstilbud> findByFagomraade(String fagomraade);

    List<Utdanningstilbud> findByInstitusjonId(UUID institusjonId);

    List<Utdanningstilbud> findByAktiv(Boolean aktiv);

    List<Utdanningstilbud> findByStudiepoengBetween(Integer minStudiepoeng, Integer maxStudiepoeng);

    List<Utdanningstilbud> findByVarighetSemestreBetween(Integer minSemestre, Integer maxSemestre);

    @Query("SELECT u FROM Utdanningstilbud u WHERE u.undervisningsspråk = :språk")
    List<Utdanningstilbud> findByUndervisningsspråk(@Param("språk") String undervisningsspråk);

    @Query("SELECT u FROM Utdanningstilbud u WHERE u.oppstartssemestre LIKE CONCAT('%', :semester, '%')")
    List<Utdanningstilbud> findByOppstartssemester(@Param("semester") String oppstartssemester);

    List<Utdanningstilbud> findAllByOrderByNavn();

    List<Utdanningstilbud> findAllByOrderByInstitusjon_Institusjonsnavn();

    @Query("SELECT u FROM Utdanningstilbud u WHERE u.aktiv = true ORDER BY u.navn")
    List<Utdanningstilbud> findAllAktiveOrderByNavn();

    @Query("SELECT DISTINCT u.utdanningsnivaa FROM Utdanningstilbud u ORDER BY u.utdanningsnivaa")
    List<String> findDistinctUtdanningsnivaaer();

    @Query("SELECT DISTINCT u.fagomraade FROM Utdanningstilbud u ORDER BY u.fagomraade")
    List<String> findDistinctFagomraader();

    @Query("SELECT DISTINCT u.undervisningsspråk FROM Utdanningstilbud u WHERE u.undervisningsspråk IS NOT NULL ORDER BY u.undervisningsspråk")
    List<String> findDistinctUndervisningsspråk();

    @Query("SELECT COUNT(u) FROM Utdanningstilbud u WHERE u.institusjon.id = :institusjonId AND u.aktiv = true")
    long countAktiveByInstitusjonId(@Param("institusjonId") UUID institusjonId);

    @Query("SELECT COUNT(u) FROM Utdanningstilbud u WHERE u.fagomraade = :fagomraade AND u.aktiv = true")
    long countByFagomraade(@Param("fagomraade") String fagomraade);
}