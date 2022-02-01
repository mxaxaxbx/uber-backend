import { Request, Response, NextFunction } from 'express';
import { Rest } from "../services/rest";
import SessionsSvc from "../services/sessions.service";
import UsersSvc from "../services/users.service";

const driverRole = 'RN0EipTLgO95T0zfVtrQ';
const passengerRole = 'Odq9LQjfOjq7L8ducuN5';

const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  const authValue = req.headers.authorization;  

  if (!authValue)
    return Rest.response({res, status_http: 401, message: 'Invalid headers'});

  const spToken = authValue.split(' ');
  const token = spToken[1];
  if (!token)
    return Rest.response({res, status_http: 401, data: 'No token provided.'});

  const userInfo = await SessionsSvc.getSession(token);  
  if(!userInfo)
    return Rest.response({res, status_http: 401, data: 'Invalid token.'});
  
  req['jwtData'] = userInfo;
  
  next();
  
}

const validateDriverRole = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req['jwtData'];

  const user = await UsersSvc.getUser(user_id);
  const findDriverRole = user.roles.find(role => role === driverRole);
  if(!findDriverRole)
    return Rest.response({res, status_http: 401, data: 'User is not a driver.'});  
  next();

}

const validatePassengerRole = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req['jwtData'];

  const user = await UsersSvc.getUser(user_id);
  const findDriverRole = user.roles.find(role => role === passengerRole);
  if(!findDriverRole)
    return Rest.response({res, status_http: 401, data: 'User is not a passenger.'});  
  next();
}


export {
  verifySession,
  validateDriverRole,
  validatePassengerRole,
};
