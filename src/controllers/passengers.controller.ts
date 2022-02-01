import { Request, Response } from 'express';
import { Rest } from '../services/rest';
import UsersSvc from '../services/users.service';
import ServicesSvc from '../services/services.service';

const searchServices = async (req: Request, res: Response) => {
  try {
    let { lat, lng, rank } = req.body;

    if( !lat || !lng )
      return Rest.response({res, status_http: 400, data: 'Lat and lng are required.'});

    if( !rank )
      rank = 5;

    lat  = Number(lat);
    lng  = Number(lng);
    rank = Number(rank);
    // 0.0008 = 1km aprox
    const latkm = lat + (0.008 * rank);
    const latkmNe = lat + ((0.008 * (-1)) * rank);
    const lngkm = lng + (0.008 * rank);
    const lngkmNe = lng + ((0.008 * (-1)) * rank);

    // search services
    const drivers = await UsersSvc.getDrivers();
    const found = drivers.filter(driver =>
      ( driver.lat > latkmNe && driver.lat < latkm && driver.lng > lngkmNe && driver.lng < lngkm )
    );    
    
    return Rest.response({res, data: found});

  } catch (error) {
    console.log('passegers controller searchServices error: ', error);
    
    return Rest.response({res, status_http: 500, data: 'Internal server error.'});
  }


};

const createService = async (req: Request, res: Response) => {
  try {
    const { lat, lng, to_lat, to_lng } = req.body;
    if( !lat || !lng || !to_lat || !to_lng )
      return Rest.response({res, status_http: 400, data: 'Lat and lng are required.'});

    const user_id = req['jwtData'].user_id;
    // search pending services
    const pendings = await ServicesSvc.getPendingServicesByUser(user_id);
    if( pendings.length > 0 )
      return Rest.response({res, status_http: 400, data: 'You have pending services.'});    

    const payload = {
      user_id,
      lat,
      lng,
      to_lat,
      to_lng,
      pending: true,
    };
    // create service
    const service = await ServicesSvc.create(payload);
    if( !service )
      return Rest.response({res, status_http: 400, data: 'An error has ocurred.'});
    
    return Rest.response({res, data: service});

  } catch (error) {
    console.log('passegers controller createService error: ', error);
    return Rest.response({res, status_http: 500, data: 'Internal server error.'});
  }
};

const getServiceCoords = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;    
    if( !id )
      return Rest.response({res, status_http: 400, data: 'Id is required.'});

    const service = await ServicesSvc.getService(id);
    if( !service )
      return Rest.response({res, status_http: 400, data: 'Service not found.'});

    if( service.pending )
      return Rest.response({res, status_http: 400, data: 'Service is pending.'});

    const user_id = req['jwtData'].user_id;
    if( user_id !== service.user_id )
      return Rest.response({res, status_http: 400, data: 'You are not the owner of this service.'});

    const driver_id = service.driver_id;
    const driver = await UsersSvc.getUser(driver_id);
    const coords = {
      lat: driver.lat,
      lng: driver.lng,
    };
    
    return Rest.response({res, data: coords });

  } catch (error) {
    console.log('passegers controller getServiceCoords error: ', error);
    return Rest.response({res, status_http: 500, data: 'Internal server error.'});
  }
};

const cancelService = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if( !id )
      return Rest.response({res, status_http: 400, data: 'Id is required.'});

    const service = await ServicesSvc.getService(id);
    if( !service )
      return Rest.response({res, status_http: 400, data: 'Service not found.'});

    if( service.pending )
      return Rest.response({res, status_http: 400, data: 'Service is pending.'});

    const user_id = req['jwtData'].user_id;
    if( user_id !== service.user_id )
      return Rest.response({res, status_http: 400, data: 'You are not the owner of this service.'});

    const payload = {
      ...service,
      pending: false,
      canceled: true,
    };
    // update service
    const updated = await ServicesSvc.update(payload);
    if( !updated )
      return Rest.response({res, status_http: 400, data: 'An error has ocurred.'});

    return Rest.response({res, data: updated});

  } catch (error) {
    console.log('passegers controller cancelService error: ', error);
    return Rest.response({res, status_http: 500, data: 'Internal server error.'});
  }
};

export {
  searchServices,
  createService,
  getServiceCoords,
  cancelService,
};
