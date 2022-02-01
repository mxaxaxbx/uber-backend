import { Request, Response, NextFunction } from 'express';
import { Rest } from '../rest';

export function validateFile(req: any | Request, res: Response, next: NextFunction) {
    if( !req.files || Object.keys(req.files).length === 0 ) return Rest.response({res, status_http: 400, message: 'Enter a file'});
    if( !req.files.file.name ) return Rest.response({res, status_http: 400, message: 'Enter a file'});
    next();
}

export function validateZip(req: any | Request, res: Response, next: NextFunction) {
    if( req.files.file.type !== 'application/zip' ) return Rest.response({res, status_http: 400, message: 'ZIP files only accepted'});
    
    next();
}

export function validateExcel(req: any | Request, res: Response, next: NextFunction) {
    const cond =  /\.(xlsx|xls|csv)$/.test(req.files.file.name);
    
    if( !cond ) return Rest.response({res, status_http: 401, message: 'EXCEL files only accepted'});

    next();
}
