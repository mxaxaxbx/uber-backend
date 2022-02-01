import { Request, Response } from 'express';
import { Rest } from '../services/rest';
import UsersSvc from '../services/users.service';
import ServicesSvc from '../services/services.service';

const updateCar = async (req: Request, res: Response) => {
  const { car } = req.body;
  if( !car )
    return Rest.response({res, status_http: 400, data: 'Car is required.'});
  
  const currentUser = await UsersSvc.getUser(req['jwtData'].user_id);
  const payload = {
    ...currentUser,
    car,
  }
  // save user
  const user = await UsersSvc.saveUser(payload);
  if( !user )
    return Rest.response({res, status_http: 500, data: 'Error saving user.'});
  
  return Rest.response({ res, status_http: 200, data: { ...user } });
};

const setCoords = async (req: Request, res: Response) => {
  try {
    let { lat, lng } = req.body;
    if( !lat || !lng )
      return Rest.response({res, status_http: 400, data: 'Lat and lng are required.'});

    lat = Number(lat);
    lng = Number(lng);
  
    const currentUser = await UsersSvc.getUser(req['jwtData'].user_id);
    const payload = {
      ...currentUser,
      lat,
      lng,
    }
    // save user
    const user = await UsersSvc.saveUser(payload);
    if( !user )
      return Rest.response({res, status_http: 500, data: 'Error saving user.'});
  
    return Rest.response({ res, status_http: 200, data: { ...user } });

  } catch (error) {
    console.log('driver controller setCoords error: ', error);
    return Rest.response({res, status_http: 500, data: 'Error saving user.'});
  }
};

const getActiveServices = async (req: Request, res: Response) => {
  try {
    let {rank} = req.query;
    if( !rank ) rank = '5'; // kms

    const rankN = Number(rank);

    const activeServices = await ServicesSvc.getPendingServices();
    const user_id = req['jwtData'].user_id;
    const user = await UsersSvc.getUser(user_id);
    const services = [];
    for( let service of activeServices ) {
      const svc = {...service, rank: rankN };
      const validService = validateServiceCoords(svc, user);

      if( validService ) services.push(validService);
    }

    return Rest.response({ res, status_http: 200, data: services });
    

  } catch (error) {
    console.log('driver controller getActiveServices error: ', error);
    return Rest.response({res, status_http: 500, data: 'Error getting services.'});
  }
};

const takeService = async (req: Request, res: Response) => {
  try {
    let { service_id, rank } = req.body;
    if( !service_id )
      return Rest.response({res, status_http: 400, data: 'Service id is required.'});

    if( !rank ) rank = 5; // kms
    rank = Number(rank);

    const service = await ServicesSvc.getService(service_id);
    
    if( !service )
      return Rest.response({res, status_http: 400, data: 'Service not found.'});

    if(service.pending !== true)
      return Rest.response({res, status_http: 400, data: 'Service not pending.'});

    if(service.driver_id)
      return Rest.response({res, status_http: 400, data: 'Service already taken.'});

    const user_id = req['jwtData'].user_id;
    const driverServices = await ServicesSvc.getNoPendingServicesByUser(user_id);
    if( driverServices.length > 0 ) {
      const canceledServices = driverServices.filter(s => s.canceled === true);
      const sameServiceCanceled = canceledServices.find(s => s._id === service_id);

      if( sameServiceCanceled )
        return Rest.response({res, status_http: 400, data: 'Service already canceled.'});

      if( canceledServices.length !== driverServices.length )
        return Rest.response({res, status_http: 400, data: 'You already have a service.'});
    }
    
    const user = await UsersSvc.getUser(user_id);
    const validService = validateServiceCoords({...service, rank}, user);
    
    if( !validService )
      return Rest.response({res, status_http: 400, data: 'Service not found.'});

    const payload = {
      ...service,
      pending: false,
      driver_id: user_id,
    };
    // save service
    const updatedService = await ServicesSvc.saveService(payload);
    if( !updatedService )
      return Rest.response({res, status_http: 400, data: 'Error saving service.'});

    return Rest.response({ res, status_http: 200, data: updatedService });

  } catch (error) {
    console.log('driver controller takeService error: ', error);
    return Rest.response({res, status_http: 500, data: 'Error taking service.'});
  }
};

const endServie = async (req: Request, res: Response) => {
  try {
    let { service_id } = req.body;
    if( !service_id )
      return Rest.response({res, status_http: 400, data: 'Service id is required.'});

    const service = await ServicesSvc.getService(service_id);
    if( !service )
      return Rest.response({res, status_http: 400, data: 'Service not found.'});

    if(service.driver_id !== req['jwtData'].user_id)
      return Rest.response({res, status_http: 400, data: 'Service not taken.'});

    if( service.ended )
      return Rest.response({res, status_http: 400, data: 'Service already ended.'});

    //  validate current coords with service coords
    const user = await UsersSvc.getUser(req['jwtData'].user_id);
    const svc = {
      ...service,
      rank: 0.125,
      lat: service.to_lat,
      lng: service.to_lng,
    };
    const arrived = validateServiceCoords(svc, user);
    if( !arrived )
      return Rest.response({res, status_http: 400, data: 'You has no arrived to destination.'});

    const payload = {
      ...service,
      pending: false,
      ended: true,
    };
    // save service
    const updatedService = await ServicesSvc.saveService(payload);
    if( !updatedService )
      return Rest.response({res, status_http: 400, data: 'Error saving service.'});

    return Rest.response({ res, status_http: 200, data: updatedService });
      
  } catch (error) {
    console.log('driver controller endServie error: ', error);
    return Rest.response({res, status_http: 500, data: 'Error ending service.'});
  }
};


function validateServiceCoords(service, driver) {
  // 0.0008 = 1km aprox
  const latkm = service.lat + (0.008 * service.rank);
  const latkmNe = service.lat + ((0.008 * (-1)) * service.rank);
  const lngkm = service.lng + (0.008 *service. rank);
  const lngkmNe = service.lng + ((0.008 * (-1)) * service.rank);

  if( driver.lat > latkmNe && driver.lat < latkm && driver.lng > lngkmNe && driver.lng < lngkm )
    return service;

  return null;
}

export {
  updateCar,
  setCoords,
  getActiveServices,
  takeService,
  endServie,
}
