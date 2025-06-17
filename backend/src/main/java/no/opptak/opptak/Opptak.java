package no.opptak.opptak;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import no.opptak.institusjon.Institusjon;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "opptak")
public class Opptak {

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

    @NotBlank(message = "Opptakstype er påkrevd")
    @Column(name = "opptakstype", nullable = false)
    private String opptakstype; // "Samordnet opptak", "Lokalt opptak", "Kontinuerlig opptak"

    @NotNull(message = "Søknadsfrist er påkrevd")
    @Column(name = "soknadsfrist", nullable = false)
    private LocalDate soknadsfrist;

    @Column(name = "svarselskapsfrist")
    private LocalDate svarselskapsfrist;

    @Column(name = "studieopptaksfrist")
    private LocalDate studieopptaksfrist;

    @NotNull(message = "Semester er påkrevd")
    @Column(name = "semester", nullable = false)
    private String semester; // "Høst", "Vår"

    @NotNull(message = "År er påkrevd")
    @Column(name = "aar", nullable = false)
    private Integer aar;

    @Column(name = "opptaksomgang")
    private String opptaksomgang; // "Hovedomgang", "Tilleggsomgang", "Løpende"

    @Column(name = "status", nullable = false)
    private String status; // "Åpen", "Stengt", "Avsluttet", "Fremtidig"

    @Column(name = "max_soknader_per_person")
    private Integer maxSoknaderPerPerson;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "institusjon_id")
    private Institusjon institusjon; // Null for samordnet opptak

    @Column(name = "ekstern_url")
    private String eksternUrl; // Link til søknadssystem

    @Column(name = "opptak_info", length = 3000)
    private String opptakInfo; // Informasjon om opptaket

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
    public Opptak() {}

    public Opptak(String navn, String opptakstype, LocalDate soknadsfrist, String semester, Integer aar) {
        this.navn = navn;
        this.opptakstype = opptakstype;
        this.soknadsfrist = soknadsfrist;
        this.semester = semester;
        this.aar = aar;
    }

    // Helper methods
    public String getFulltNavn() {
        return navn + " " + semester + " " + aar;
    }

    public boolean erAktivt() {
        return aktiv && LocalDate.now().isBefore(soknadsfrist.plusDays(1));
    }

    public boolean erUtlopt() {
        LocalDate idag = LocalDate.now();
        return studieopptaksfrist != null && idag.isAfter(studieopptaksfrist);
    }

    public long dagerTilFrist() {
        LocalDate idag = LocalDate.now();
        return idag.until(soknadsfrist).getDays();
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

    public String getOpptakstype() {
        return opptakstype;
    }

    public void setOpptakstype(String opptakstype) {
        this.opptakstype = opptakstype;
    }

    public LocalDate getSoknadsfrist() {
        return soknadsfrist;
    }

    public void setSoknadsfrist(LocalDate soknadsfrist) {
        this.soknadsfrist = soknadsfrist;
    }

    public LocalDate getSvarselskapsfrist() {
        return svarselskapsfrist;
    }

    public void setSvarselskapsfrist(LocalDate svarselskapsfrist) {
        this.svarselskapsfrist = svarselskapsfrist;
    }

    public LocalDate getStudieopptaksfrist() {
        return studieopptaksfrist;
    }

    public void setStudieopptaksfrist(LocalDate studieopptaksfrist) {
        this.studieopptaksfrist = studieopptaksfrist;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public Integer getAar() {
        return aar;
    }

    public void setAar(Integer aar) {
        this.aar = aar;
    }

    public String getOpptaksomgang() {
        return opptaksomgang;
    }

    public void setOpptaksomgang(String opptaksomgang) {
        this.opptaksomgang = opptaksomgang;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getMaxSoknaderPerPerson() {
        return maxSoknaderPerPerson;
    }

    public void setMaxSoknaderPerPerson(Integer maxSoknaderPerPerson) {
        this.maxSoknaderPerPerson = maxSoknaderPerPerson;
    }

    public Institusjon getInstitusjon() {
        return institusjon;
    }

    public void setInstitusjon(Institusjon institusjon) {
        this.institusjon = institusjon;
    }

    public String getEksternUrl() {
        return eksternUrl;
    }

    public void setEksternUrl(String eksternUrl) {
        this.eksternUrl = eksternUrl;
    }

    public String getOpptakInfo() {
        return opptakInfo;
    }

    public void setOpptakInfo(String opptakInfo) {
        this.opptakInfo = opptakInfo;
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