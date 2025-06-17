package no.opptak.institusjon;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "institusjon")
public class Institusjon {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Institusjonsnavn er påkrevd")
    @Size(max = 255, message = "Institusjonsnavn kan ikke være lengre enn 255 tegn")
    @Column(name = "institusjonsnavn", nullable = false)
    private String institusjonsnavn;

    @NotBlank(message = "Organisasjonsnummer er påkrevd")
    @Pattern(regexp = "^\\d{9}$", message = "Organisasjonsnummer må være 9 siffer")
    @Column(name = "organisasjonsnummer", nullable = false, unique = true)
    private String organisasjonsnummer;

    @NotBlank(message = "Institusjonstype er påkrevd")
    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "adresse")
    private String adresse;

    @Pattern(regexp = "^\\d{4}$", message = "Postnummer må være 4 siffer")
    @Column(name = "postnummer")
    private String postnummer;

    @Column(name = "poststed")
    private String poststed;

    @Column(name = "epost")
    private String epost;

    @Column(name = "telefon")
    private String telefon;

    @Column(name = "spesialiseringsområde")
    private String spesialiseringsomrade;

    @Column(name = "akkrediteringsstatus")
    private String akkrediteringsstatus;

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
    public Institusjon() {}

    public Institusjon(String institusjonsnavn, String organisasjonsnummer, String type) {
        this.institusjonsnavn = institusjonsnavn;
        this.organisasjonsnummer = organisasjonsnummer;
        this.type = type;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getInstitusjonsnavn() {
        return institusjonsnavn;
    }

    public void setInstitusjonsnavn(String institusjonsnavn) {
        this.institusjonsnavn = institusjonsnavn;
    }

    public String getOrganisasjonsnummer() {
        return organisasjonsnummer;
    }

    public void setOrganisasjonsnummer(String organisasjonsnummer) {
        this.organisasjonsnummer = organisasjonsnummer;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getSpesialiseringsomrade() {
        return spesialiseringsomrade;
    }

    public void setSpesialiseringsomrade(String spesialiseringsomrade) {
        this.spesialiseringsomrade = spesialiseringsomrade;
    }

    public String getAkkrediteringsstatus() {
        return akkrediteringsstatus;
    }

    public void setAkkrediteringsstatus(String akkrediteringsstatus) {
        this.akkrediteringsstatus = akkrediteringsstatus;
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