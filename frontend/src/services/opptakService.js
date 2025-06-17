import api from './api.js';

class OpptakService {
  async hentAlleOpptak(search = '', opptakstype = '', semester = '', aar = '', status = '', institusjonId = '', kunAktive = true) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (opptakstype) params.append('opptakstype', opptakstype);
    if (semester) params.append('semester', semester);
    if (aar) params.append('aar', aar);
    if (status) params.append('status', status);
    if (institusjonId) params.append('institusjonId', institusjonId);
    params.append('kunAktive', kunAktive);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/opptak?${queryString}` : '/opptak';
    
    return api.get(endpoint);
  }

  async hentOpptak(id) {
    return api.get(`/opptak/${id}`);
  }

  async hentKommendeOpptak() {
    return api.get('/opptak/kommende');
  }

  async hentAktiveKommendeOpptak() {
    return api.get('/opptak/aktive-kommende');
  }

  async hentUtlopteOpptak() {
    return api.get('/opptak/utlopte');
  }

  async hentSamordnetOpptak() {
    return api.get('/opptak/samordnet');
  }

  async hentLokaleOpptak() {
    return api.get('/opptak/lokale');
  }

  async hentOpptakByFristPeriode(fraDate, tilDate) {
    return api.get(`/opptak/periode?fraDate=${fraDate}&tilDate=${tilDate}`);
  }

  async opprettOpptak(opptak) {
    return api.post('/opptak', opptak);
  }

  async oppdaterOpptak(id, opptak) {
    return api.put(`/opptak/${id}`, opptak);
  }

  async slettOpptak(id) {
    return api.delete(`/opptak/${id}`);
  }

  async deaktiverOpptak(id) {
    return api.put(`/opptak/${id}/deaktiver`);
  }

  async aktiverOpptak(id) {
    return api.put(`/opptak/${id}/aktiver`);
  }

  async oppdaterStatus(id, status) {
    return api.put(`/opptak/${id}/status?status=${encodeURIComponent(status)}`);
  }

  async hentOpptakstyper() {
    return api.get('/opptak/opptakstyper');
  }

  async hentSemestre() {
    return api.get('/opptak/semestre');
  }

  async hentAar() {
    return api.get('/opptak/aar');
  }

  async hentStatuser() {
    return api.get('/opptak/statuser');
  }

  async tellOpptakForInstitusjon(institusjonId) {
    return api.get(`/opptak/statistikk/institusjon/${institusjonId}`);
  }

  async tellOpptakByType(opptakstype) {
    return api.get(`/opptak/statistikk/type/${encodeURIComponent(opptakstype)}`);
  }

  async tellOpptakBySemesterOgAar(semester, aar) {
    return api.get(`/opptak/statistikk/semester?semester=${semester}&aar=${aar}`);
  }
}

export default new OpptakService();