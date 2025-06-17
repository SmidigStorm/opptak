import api from './api.js';

class UtdanningstilbudService {
  async hentAlleUtdanningstilbud(search = '', utdanningsnivaa = '', fagomraade = '', institusjonId = '', undervisningsspråk = '', oppstartssemester = '', kunAktive = true) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (utdanningsnivaa) params.append('utdanningsnivaa', utdanningsnivaa);
    if (fagomraade) params.append('fagomraade', fagomraade);
    if (institusjonId) params.append('institusjonId', institusjonId);
    if (undervisningsspråk) params.append('undervisningsspråk', undervisningsspråk);
    if (oppstartssemester) params.append('oppstartssemester', oppstartssemester);
    params.append('kunAktive', kunAktive);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/utdanningstilbud?${queryString}` : '/utdanningstilbud';
    
    return api.get(endpoint);
  }

  async hentUtdanningstilbud(id) {
    return api.get(`/utdanningstilbud/${id}`);
  }

  async hentUtdanningstilbudByStudiepoengRange(minStudiepoeng, maxStudiepoeng) {
    return api.get(`/utdanningstilbud/studiepoeng?minStudiepoeng=${minStudiepoeng}&maxStudiepoeng=${maxStudiepoeng}`);
  }

  async hentUtdanningstilbudByVarighetRange(minSemestre, maxSemestre) {
    return api.get(`/utdanningstilbud/varighet?minSemestre=${minSemestre}&maxSemestre=${maxSemestre}`);
  }

  async opprettUtdanningstilbud(utdanningstilbud) {
    return api.post('/utdanningstilbud', utdanningstilbud);
  }

  async oppdaterUtdanningstilbud(id, utdanningstilbud) {
    return api.put(`/utdanningstilbud/${id}`, utdanningstilbud);
  }

  async slettUtdanningstilbud(id) {
    return api.delete(`/utdanningstilbud/${id}`);
  }

  async deaktiverUtdanningstilbud(id) {
    return api.put(`/utdanningstilbud/${id}/deaktiver`);
  }

  async aktiverUtdanningstilbud(id) {
    return api.put(`/utdanningstilbud/${id}/aktiver`);
  }

  async hentUtdanningsnivaaer() {
    return api.get('/utdanningstilbud/utdanningsnivaaer');
  }

  async hentFagomraader() {
    return api.get('/utdanningstilbud/fagomraader');
  }

  async hentUndervisningsspråk() {
    return api.get('/utdanningstilbud/undervisningsspråk');
  }

  async tellUtdanningstilbudForInstitusjon(institusjonId) {
    return api.get(`/utdanningstilbud/statistikk/institusjon/${institusjonId}`);
  }

  async tellUtdanningstilbudForFagomraade(fagomraade) {
    return api.get(`/utdanningstilbud/statistikk/fagomraade/${fagomraade}`);
  }
}

export default new UtdanningstilbudService();