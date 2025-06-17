package no.opptak.utdanningstilbud;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import no.opptak.institusjon.Institusjon;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "utdanningstilbud")
public class Utdanningstilbud {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Navn er påkrevd")
    @Size(max = 255, message = "Navn kan ikke være lengre enn 255 tegn")
    @Column(name = "navn", nullable = false)
    private String navn;

    @Size(max = 2000, message = "Beskrivelse kan ikke være lengre enn 2000 tegn")
    @Column(name = "beskrivelse", length = 2000)
    private String beskrivelse;

    @NotBlank(message = "Utdanningsnivå er påkrevd")
    @Column(name = "utdanningsnivaa", nullable = false)
    private String utdanningsnivaa;

    @NotBlank(message = "Fagområde er påkrevd")
    @Column(name = "fagomraade", nullable = false)
    private String fagomraade;

    @NotNull(message = "Varighet i semestre er påkrevd")
    @Min(value = 1, message = "Varighet må være minst 1 semester")
    @Column(name = "varighet_semestre", nullable = false)
    private Integer varighetSemestre;

    @NotNull(message = "Studiepoeng er påkrevd")
    @Min(value = 1, message = "Studiepoeng må være minst 1")
    @Column(name = "studiepoeng", nullable = false)
    private Integer studiepoeng;

    @Column(name = "undervisningsspråk")
    private String undervisningsspråk;

    @Column(name = "oppstartssemestre")
    private String oppstartssemestre; // "Høst", "Vår", "Høst,Vår"

    @Column(name = "opptakskrav", length = 1000)
    private String opptakskrav;

    @Column(name = "studieavgift")
    private Integer studieavgift; // Per år i NOK

    @Column(name = "kapasitet")
    private Integer kapasitet; // Maksimalt antall studenter per år

    @NotNull(message = "Institusjon er påkrevd")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "institusjon_id", nullable = false)
    private Institusjon institusjon;

    @Column(name = "aktiv", nullable = false)
    private Boolean aktiv = true;

    @Column(name = "opprettet_tidspunkt", nullable = false)
    private LocalDateTime opprettetTidspunkt;

    @Column(name = "oppdatert_tidspunkt", nullable = false)
    private LocalDateTime oppdatertTidspunkt;

    @PrePersist
    protected void onCreate() {
        opprettetTidspunkt = LocalDateTime.now();
        oppdatertTidspunkt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        oppdatertTidspunkt = LocalDateTime.now();
    }

    // Constructors
    public Utdanningstilbud() {}

    public Utdanningstilbud(String navn, String utdanningsnivaa, String fagomraade, 
                           Integer varighetSemestre, Integer studiepoeng, Institusjon institusjon) {
        this.navn = navn;
        this.utdanningsnivaa = utdanningsnivaa;
        this.fagomraade = fagomraade;
        this.varighetSemestre = varighetSemestre;
        this.studiepoeng = studiepoeng;
        this.institusjon = institusjon;
    }

    // Helper method
    public String getFulltNavn() {
        return navn + " (" + utdanningsnivaa + ")";
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNavn() {
        return navn;
    }

    public void setNavn(String navn) {
        this.navn = navn;
    }

    public String getBeskrivelse() {
        return beskrivelse;
    }

    public void setBeskrivelse(String beskrivelse) {
        this.beskrivelse = beskrivelse;
    }

    public String getUtdanningsnivaa() {
        return utdanningsnivaa;
    }

    public void setUtdanningsnivaa(String utdanningsnivaa) {
        this.utdanningsnivaa = utdanningsnivaa;
    }

    public String getFagomraade() {
        return fagomraade;
    }

    public void setFagomraade(String fagomraade) {
        this.fagomraade = fagomraade;
    }

    public Integer getVarighetSemestre() {
        return varighetSemestre;
    }

    public void setVarighetSemestre(Integer varighetSemestre) {
        this.varighetSemestre = varighetSemestre;
    }

    public Integer getStudiepoeng() {
        return studiepoeng;
    }

    public void setStudiepoeng(Integer studiepoeng) {
        this.studiepoeng = studiepoeng;
    }

    public String getUndervisningsspråk() {
        return undervisningsspråk;
    }

    public void setUndervisningsspråk(String undervisningsspråk) {
        this.undervisningsspråk = undervisningsspråk;
    }

    public String getOppstartssemestre() {
        return oppstartssemestre;
    }

    public void setOppstartssemestre(String oppstartssemestre) {
        this.oppstartssemestre = oppstartssemestre;
    }

    public String getOpptakskrav() {
        return opptakskrav;
    }

    public void setOpptakskrav(String opptakskrav) {
        this.opptakskrav = opptakskrav;
    }

    public Integer getStudieavgift() {
        return studieavgift;
    }

    public void setStudieavgift(Integer studieavgift) {
        this.studieavgift = studieavgift;
    }

    public Integer getKapasitet() {
        return kapasitet;
    }

    public void setKapasitet(Integer kapasitet) {
        this.kapasitet = kapasitet;
    }

    public Institusjon getInstitusjon() {
        return institusjon;
    }

    public void setInstitusjon(Institusjon institusjon) {
        this.institusjon = institusjon;
    }

    public Boolean getAktiv() {
        return aktiv;
    }

    public void setAktiv(Boolean aktiv) {
        this.aktiv = aktiv;
    }

    public LocalDateTime getOpprettetTidspunkt() {
        return opprettetTidspunkt;
    }

    public void setOpprettetTidspunkt(LocalDateTime opprettetTidspunkt) {
        this.opprettetTidspunkt = opprettetTidspunkt;
    }

    public LocalDateTime getOppdatertTidspunkt() {
        return oppdatertTidspunkt;
    }

    public void setOppdatertTidspunkt(LocalDateTime oppdatertTidspunkt) {
        this.oppdatertTidspunkt = oppdatertTidspunkt;
    }
}