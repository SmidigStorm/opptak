import api from './api.js';

class PersonService {
  async hentAllePersoner(search = '', poststed = '', statsborgerskap = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (poststed) params.append('poststed', poststed);
    if (statsborgerskap) params.append('statsborgerskap', statsborgerskap);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/personer?${queryString}` : '/personer';
    
    return api.get(endpoint);
  }

  async hentPerson(id) {
    return api.get(`/personer/${id}`);
  }

  async hentPersonByFodselsnummer(fodselsnummer) {
    return api.get(`/personer/fodselsnummer/${fodselsnummer}`);
  }

  async hentPersonerByAldersgruppe(minAlder, maxAlder) {
    return api.get(`/personer/aldersgruppe?minAlder=${minAlder}&maxAlder=${maxAlder}`);
  }

  async opprettPerson(person) {
    return api.post('/personer', person);
  }

  async oppdaterPerson(id, person) {
    return api.put(`/personer/${id}`, person);
  }

  async slettPerson(id) {
    return api.delete(`/personer/${id}`);
  }

  async hentStatsborgerskap() {
    return api.get('/personer/statsborgerskap');
  }

  async tellPersonerIAldersgruppe(minAlder, maxAlder) {
    return api.get(`/personer/statistikk/aldersgruppe?minAlder=${minAlder}&maxAlder=${maxAlder}`);
  }
}

export default new PersonService();