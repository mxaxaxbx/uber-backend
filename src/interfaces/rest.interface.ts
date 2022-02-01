import { Response } from 'express';

export class RestI {
    res          : Response;
    status_http? : number;
    message?     : string;
    data?        : any = null;
    status_code? : number=null;
    errors?      : string=null;
}
