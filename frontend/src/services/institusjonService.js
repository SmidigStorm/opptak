import api from './api.js';

class InstitusjonService {
  async hentAlleInstitusjoner(search = '', type = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/institusjoner?${queryString}` : '/institusjoner';
    
    return api.get(endpoint);
  }

  async hentInstitusjon(id) {
    return api.get(`/institusjoner/${id}`);
  }

  async hentInstitusjonByOrganisasjonsnummer(organisasjonsnummer) {
    return api.get(`/institusjoner/organisasjonsnummer/${organisasjonsnummer}`);
  }

  async opprettInstitusjon(institusjon) {
    return api.post('/institusjoner', institusjon);
  }

  async oppdaterInstitusjon(id, institusjon) {
    return api.put(`/institusjoner/${id}`, institusjon);
  }

  async slettInstitusjon(id) {
    return api.delete(`/institusjoner/${id}`);
  }

  async hentInstitusjonstyper() {
    return api.get('/institusjoner/typer');
  }
}

export default new InstitusjonService();