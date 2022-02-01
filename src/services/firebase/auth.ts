import admin from 'firebase-admin';
import { getAuth, signInWithEmailAndPassword }from 'firebase/auth';
import jwt from 'jsonwebtoken';

class Auth {
  constructor() {}

  async createUser(name: string, email: string, password: string): Promise<string> {
    try {
      const auth = admin.auth();
      const result = await auth.createUser({
        email,
        password,
        emailVerified : true,
        displayName   : name,
        disabled      : false,
      });

      return result.uid;

    } catch (e) {
      console.log('Auth.createUser error: ', e);
      return null;
    }
  }

  removeUser(user_id: string) {
    admin.auth().deleteUser(user_id);
  }

  async loginUser(email: string, password: string): Promise<any> {
    try {
      const authFb = getAuth()
      const us = await signInWithEmailAndPassword(authFb, email, password);

      if( !us ) return {
        user_id: null,
        token: null,
      };

      const token = jwt.sign({
        user_id: us.user.uid,
      }, process.env.JWT_SECRET);

      return {
        user_id : us.user.uid,
        token
      };

    } catch (e) {
      console.log('Auth.loginUser error: ', e);
      return null;
    }
  }

  async validateUserToken(token: string): Promise<any> {
    try {
      const auth = admin.auth();
      const decodedToken = await auth.verifyIdToken(token);
      return decodedToken;

    } catch (e) {
      console.log('Auth.validateUserToken error: ', e);
      return null;
    }
  }
}

export default new Auth();
