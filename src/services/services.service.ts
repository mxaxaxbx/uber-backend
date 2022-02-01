import { Model } from './firebase/database';

class ServicesService {

  async create(service) {
    const services = new Model('services');
    const res = await services.create(service);
    return res;
  }

  async getPendingServicesByUser(user_id) {
    const services = new Model('services');
    const results = await services.find('user_id', '==', user_id);    
    const finded = results.filter(item => item.pending === true);
    
    return finded;
  }

  async getNoPendingServicesByUser(user_id) {
    const services = new Model('services');
    const results = await services.find('user_id', '==', user_id);    
    const finded = results.filter(item => item.pending === false);
    
    return finded;
  }

  async getPendingServices() {
    const services = new Model('services');
    const res = await services.find('pending', '==', true);
    return res;
  }

  async getService(id) {
    const services = new Model('services');
    const res = await services.get_by_id(id);
    
    return res;
  }

  async saveService(service) {
    const services = new Model('services');
    const res = await services.save(service);
    return res;
  }

  async update(service) {
    const services = new Model('services');
    const res = await services.save(service);
    return res;
  }
}

export default new ServicesService();
