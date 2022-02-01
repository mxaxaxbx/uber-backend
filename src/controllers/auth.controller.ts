import {Request, Response} from 'express';
import {Rest} from '../services/rest';
import UserSvc from '../services/users.service';
import SessionsSvc from '../services/sessions.service';
import AuthSvc from '../services/firebase/auth';

// register user driver
const registerDriver = async (req: any | Request, res: Response) => {
  const result = await register({
    ...req.body,
    role_id: 'RN0EipTLgO95T0zfVtrQ' // driver role
  });

  if( result.error )
    return Rest.response({res, status_http: 400, message: result.error});

  return Rest.response({res, status_http: 201, data: { email: req.body.email }});
};

//  register user passenger
const registerPassenger = async (req: any | Request, res: Response) => {
  const result = await register({
    ...req.body,
    role_id: 'Odq9LQjfOjq7L8ducuN5' // passenger role
  });

  if( result.error )
    return Rest.response({res, status_http: 400, message: result.error});

  return Rest.response({res, status_http: 201, data: { email: req.body.email }});
};

// login user
const login = async (req: any | Request, res: Response) => {
  const {user_id, token} = await AuthSvc.loginUser(req.body.email, req.body.password);
  if( !token )
    return Rest.response({res, status_http: 401, message: 'Invalid email or password'});

  // save session
  const session = await SessionsSvc.saveSession(user_id, token);
  if( !session )
    return Rest.response({res, status_http: 401, message: 'An error ocurred. Contact the administrator'});

  return Rest.response({res, status_http: 200, data: { token }});
};

// logout user
const logout = async (req: any | Request, res: Response) => {
  const { token } = req['jwtData'];
  const result = await SessionsSvc.deleteSession(token);
  if( !result )
    return Rest.response({res, status_http: 401, message: 'An error ocurred. Contact the administrator'});
  
  return Rest.response({res, status_http: 200, data: 'OK'});
}

async function register(payload): Promise<any> {
  let user_id = '';
  // validate name, email and password
  const { name, email, password, role_id } = payload;
  if (!name || !email || !password)
    return {_id : '', error: 'Missing required fields'};

  // validate regex email
  if( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) )
    return {_id : '', error: 'Enter a valid email'};

  // valdiate password length
  if( password.length < 6 )
    return {_id : '', error: 'Password must be at least 6 characters long'};

  // check if user already exists
  const user = await UserSvc.getUserByEmail(email);
  if( user ) {
    const roleFinded = user.roles.find(role => role === role_id);
    
    if( roleFinded ) {
      console.log('user already exists');
      return {_id : '', error: 'An error ocurred. Contact the administrator'};
    }
    // update user role
    const result = await UserSvc.setUserRole(user._id, role_id);
    if( !result )
      return {_id : '', error: 'An error ocurred. Contact the administrator'};

    user_id = user._id;

  } else {
    // create user
    console.log('create user');
    user_id = await UserSvc.createUser(name, email, password, role_id);

    if( !user_id ) {
      console.log('not create user');
      return {_id : '', error: 'An error ocurred. Contact the administrator'};
    }

  }
  
  if( !user_id )
    return {_id : '', error: 'An error ocurred. Contact the administrator'};
  
  console.log(`user ${ email } created with id ${ user_id }`);

  return {_id : user_id, error: ''};

}


export {
  registerDriver,
  registerPassenger,
  login,
  logout,
}
