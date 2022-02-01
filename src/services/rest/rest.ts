import { Response } from "express";
import { RestI } from "../../interfaces/rest.interface";


export function response(opts: RestI): Response<any> {  
    const status_http = opts.status_http ? opts.status_http : 200;

    const json_resp = {
        'status'  : opts.status_code ? opts.status_code : status_http,
        'message' : opts.message ? opts.message : '',
        'data'    : opts.data ? opts.data : null,
    }
    
    if( opts.errors ) json_resp['error'] = opts.errors;        

    const resp = opts.res.status(status_http).send(json_resp);
    
    return resp;
}

