package no.opptak.person;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "person")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Fornavn er påkrevd")
    @Size(max = 100, message = "Fornavn kan ikke være lengre enn 100 tegn")
    @Column(name = "fornavn", nullable = false)
    private String fornavn;

    @Size(max = 100, message = "Mellomnavn kan ikke være lengre enn 100 tegn")
    @Column(name = "mellomnavn")
    private String mellomnavn;

    @NotBlank(message = "Etternavn er påkrevd")
    @Size(max = 100, message = "Etternavn kan ikke være lengre enn 100 tegn")
    @Column(name = "etternavn", nullable = false)
    private String etternavn;

    @Pattern(regexp = "^\\d{11}$", message = "Fødselsnummer må være 11 siffer")
    @Column(name = "fodselsnummer", unique = true)
    private String fodselsnummer;

    @Column(name = "fodselsdato")
    private LocalDate fodselsdato;

    @Email(message = "Ugyldig e-postformat")
    @Column(name = "epost")
    private String epost;

    @Pattern(regexp = "^(\\+47)?[0-9]{8}$", message = "Ugyldig telefonnummer")
    @Column(name = "telefon")
    private String telefon;

    @Column(name = "adresse")
    private String adresse;

    @Pattern(regexp = "^\\d{4}$", message = "Postnummer må være 4 siffer")
    @Column(name = "postnummer")
    private String postnummer;

    @Column(name = "poststed")
    private String poststed;

    @Column(name = "statsborgerskap")
    private String statsborgerskap;

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
    public Person() {}

    public Person(String fornavn, String etternavn) {
        this.fornavn = fornavn;
        this.etternavn = etternavn;
    }

    // Helper method to get full name
    public String getFulltNavn() {
        if (mellomnavn != null && !mellomnavn.trim().isEmpty()) {
            return fornavn + " " + mellomnavn + " " + etternavn;
        }
        return fornavn + " " + etternavn;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFornavn() {
        return fornavn;
    }

    public void setFornavn(String fornavn) {
        this.fornavn = fornavn;
    }

    public String getMellomnavn() {
        return mellomnavn;
    }

    public void setMellomnavn(String mellomnavn) {
        this.mellomnavn = mellomnavn;
    }

    public String getEtternavn() {
        return etternavn;
    }

    public void setEtternavn(String etternavn) {
        this.etternavn = etternavn;
    }

    public String getFodselsnummer() {
        return fodselsnummer;
    }

    public void setFodselsnummer(String fodselsnummer) {
        this.fodselsnummer = fodselsnummer;
    }

    public LocalDate getFodselsdato() {
        return fodselsdato;
    }

    public void setFodselsdato(LocalDate fodselsdato) {
        this.fodselsdato = fodselsdato;
    }

    public String getEpost() {
        return epost;
    }

    public void setEpost(String epost) {
        this.epost = epost;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getPostnummer() {
        return postnummer;
    }

    public void setPostnummer(String postnummer) {
        this.postnummer = postnummer;
    }

    public String getPoststed() {
        return poststed;
    }

    public void setPoststed(String poststed) {
        this.poststed = poststed;
    }

    public String getStatsborgerskap() {
        return statsborgerskap;
    }

    public void setStatsborgerskap(String statsborgerskap) {
        this.statsborgerskap = statsborgerskap;
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