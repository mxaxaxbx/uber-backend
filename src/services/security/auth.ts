import { NextFunction, Request, Response } from 'express';

import { Rest } from '../rest';
import { get_current_session } from './sessions';

const BEARER_TOKEN_LENGTH = 37;
const ACCESS_TOKEN_LENGTH = 30;
const ACCESS_TOKEN        = 'access_token';
const EXPIRE_TOKEN        = 'expire_token';

// validate_request (req: Request, args: string): string {
//     const args_arr = args.split(',');
//     const body = Object.keys(req.body);
//     const miss_attrs = [];
    
//     for(let arg of args_arr) {
//         const existProp = body.find(key => key == trim(arg));
//         if( !existProp ) miss_attrs.push(arg);
//     }        
    
//     if( miss_attrs.length > 0 ) return `The following attrs are misssing: ${ miss_attrs.toString() }`;

//     return '';
// }

const require_auth_session = async (req: any | Request, res: Response, next: NextFunction) => { 
    const header = get_header_content_type(req, process.env.HEADER_API_KEY);

    if( header.code )
        return Rest.response({res, status_http: 401, message: 'Unauthorized', errors: header.msg, status_code: header.code });
    
    const api_access_token = get_access_token(header.msg);
    
    if( api_access_token.code )
        return Rest.response({res, status_http: 401, message: 'Unauthhorized', errors: api_access_token.msg, status_code: api_access_token.code});

    const session = await validate_session(api_access_token.msg);
    
    if( session.code )
        return Rest.response({res, status_http: 401, message: 'Unathorized', errors: session.msg, status_code: session.code});

    req.user = session.msg;
    global.user = session.msg;
    
    next();
}

const get_header_content_type = (req: Request, content_type_value: string) => {
    try {
        const content_type = req.header( content_type_value );
        
        if( !content_type ) return { code: 709, msg : 'Invalid Headers'};

        return { code: null, msg: content_type };

    } catch(e) {
        console.log(`auth get_header_content_type error: ${e}`);
        return { code: 712, msg: 'Unexpected error' };
        
    }
}

const get_access_token = (apikey: string) => {
    if( !apikey ) return { code: 709, msg: 'Invalid headers' };

    else if( apikey.length !== BEARER_TOKEN_LENGTH )
        return { code: 711, msg: 'Invalid api key length' };

    const token_type = apikey.substring(0, 6);

    if( token_type !== process.env.TOKEN_TYPE )
        return { code: 710, msg: 'Invalid token type' };

    const key_token = apikey.substr(-30);
    
    if( key_token.length !== ACCESS_TOKEN_LENGTH )
        return { code: 711, msg: 'Invalid api key length' };
    
    return { code: null, msg: key_token }
}

const validate_session = async (apikey: string) => {
    if( !apikey ) return { code: 709, msg: 'Missing auth key' };

    let session = null;

    const current_session = await get_current_session(apikey);
    
    if( current_session.code ) return { code: current_session.code, msg: current_session.msg };

    session = current_session.msg;

    if( !session[ACCESS_TOKEN] ) return { code: 714, msg: 'Missing auth key' };

    if( apikey !== session[ACCESS_TOKEN] ) return { code: 715, msg: 'Invalid api key' };

    const now = new Date();
    const expires = session[EXPIRE_TOKEN].toDate();

    if( now.getTime() > expires.getTime() ) return { code: 715, msg: 'Session expired' };

    return { code: null, msg: session };
    
}

export {
    require_auth_session,
};
