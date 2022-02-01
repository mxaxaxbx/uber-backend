import axios from 'axios';
class HttpService {
    
    private baseUrl: string = process.env.BASE_URL;

    constructor () {
        if(global.user) axios.defaults.headers.common['Authorization'] = `Bearer ${global.user.access_token}`;

        axios.defaults.headers.common['Content-Type'] = 'application/json';
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
        axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';
        
    }

    get( url ) {
        return axios({
            method  : 'GET',
            url     : `${this.baseUrl}/${url}`,
        })
        .then( this.handleResponse )
        .catch( err => this.handleError(err.response) );
    }

    post( url, data ) {
        return axios({
            method  : 'POST',
            url     : `${this.baseUrl}/${url}`,
            data,
        })
        .then( this.handleResponse )
        .catch(err => this.handleError(err.response) );
    }

    put( url, data ) {
        return axios({
            method  : 'PUT',
            url     : `${this.baseUrl}/${url}`,
            data,
        })
        .then( this.handleResponse )
        .catch(err => this.handleError(err.response) );
    }

    delete( url ) {
        return axios({
            method  : 'DELETE',
            url     : `${this.baseUrl}/${url}`,
        })
        .then( this.handleResponse )
        .catch(err => this.handleError(err.response) );
    }

    private handleResponse( res ) {
        return res.data;
    }

    private handleError( response ) {
        if( !response ) return null;
        
        console.log(`${response.data.error} ${response.data.message}`);

        return null;
    }

}

export default HttpService;
