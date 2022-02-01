import HttpService from "./http.service";

class ShopsService {

    private http: any;
    
    constructor() {        
        this.http = new HttpService();
    }

    async getShops() {
        const res = await this.http.get('api/shops');
        if( res ) return res.data;
        return res;
    }
}

export default ShopsService;
