import admin from 'firebase-admin';

const DEFAULT_FOLDER = 'general';

class FirebaseStorage {

    private bucket = admin.storage().bucket();
    
    constructor () {}

    async save_file(filename: string, folder_path: string='', local_path: string) {
        let store_file_path = '';

        if( !filename ) return null;
        if( !local_path ) return null;

        if( !folder_path ) store_file_path = `${ DEFAULT_FOLDER }/${ filename }`;
        else store_file_path = `${ folder_path }/${ filename }`

        try {
            const res = await this.bucket.upload(local_path, { destination : store_file_path, })
                .then((file) => {
                    const url = file["0"].metadata.mediaLink;
                    return url;
                })
                .catch((err) => {
                    console.log(`FirebaseStorage save_file error ${err}`);
                    return null;
                });
            return res;

        } catch(e) {
            console.log(`FirebaseStorage save_file error ${e}`);
            return null;
        }

    }

}

export default new FirebaseStorage;
