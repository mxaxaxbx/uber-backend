import AuthSvc from './firebase/auth';
import { Model } from './firebase/database';

class UsersService {

  async getUser(user_id) {
    const users = new Model('users');
    const user = await users.get_by_id(user_id);
    if( !user ) return null;
    
    return user;
  }

  async getUserByEmail(email: string) {
    const users = new Model('users');
    
    const user = await users.findOne('email', email);
    return user;
  }

  async createUser(name: string, email: string, password: string, role_id) {
    const user_id = await AuthSvc.createUser(name, email, password);
    if( !user_id ) return null;

    const user = {
      name,
      email,
      _id        : user_id,
      roles      : [role_id],
      created_at : new Date().getTime(),
    };

    const users = new Model('users');
    const res = await users.save(user);

    return res._id;
  }

  async saveUser(user) {
    const users = new Model('users');
    const res = await users.save(user);

    if( res ) {
      delete res.roles;
      delete res.created_at;
      delete res.updated_at;
      delete res._id;
    }
    return res;
  }

  async setUserRole(user_id, role_id) {
    const users = new Model('users');
    const user = await users.get_by_id(user_id);
    if( !user ) return null;
    // push new role
    user.roles.push(role_id);
    const res = await users.save(user);

    return res;
  }

  async getDrivers() {
    const users = new Model('users');
    const drivers = await users.find('roles', 'array-contains', 'RN0EipTLgO95T0zfVtrQ');
    return drivers;
  }

}

export default new UsersService();
