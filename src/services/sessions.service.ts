import { Model } from './firebase/database';

class SessionsService {

  async saveSession(user_id, token) {
    const sessions = new Model('sessions');
    const session = {
      user_id,
      token,
      created_at: new Date().getTime(),
    };
    const res = await sessions.create(session);
    return res;
  }

  async getSession(token) {
    const sessions = new Model('sessions');
    const session = await sessions.findOne('token', token);
    return session;
  };

  async deleteSession(token) {
    const sessions = new Model('sessions');
    const session = await sessions.findOne('token', token);
    if (!session) return null;
    const res = await sessions.delete(session._id);
    return res;
  }

}

export default new SessionsService();
