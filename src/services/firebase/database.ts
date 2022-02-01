import admin from 'firebase-admin';

class Model {
    private db = admin.firestore();
    private collection = ""

    constructor(collection: string) {
        this.collection = collection;
    }

    async get_by_id(doc_id: string): Promise<any> {
        const docRef = this.db.collection( this.collection ).doc( doc_id );
        const doc    = await docRef.get();

        if( !doc.exists ) return null;

        return {
            ...doc.data(),
            _id: doc.id,
        };
    }

    async findOne(field: string, value: string | number): Promise<any> {
        try {
            const collection = await this.db.collection( this.collection );
            const query      = collection.where( field, '==', value ).limit(1);
            const snapshot   = await query.get();          
            
            if( snapshot.empty ) return null;
            return {
                ...snapshot.docs[0].data(),
                _id: snapshot.docs[0].id,
            };

        } catch(e) {
            console.log('Model.findOne error', e);
            return null;
        }
    }

    async find(field: string, condition: any, value: string | number | boolean): Promise<any> {
        try {
            const collection = await this.db.collection( this.collection );
            const query      = collection.where( field, condition, value );
            const snapshot   = await query.get();
            
            if( snapshot.empty ) return [];
            
            const results = [];
            snapshot.docs.forEach(doc => {
                results.push({
                    ...doc.data(),
                    _id: doc.id,
                });
            });

            return results;

        } catch(e) {
            console.log('Model.findOne error', e);
            return null;
        }
    }

    async save(data: any): Promise<any> {
        try {
            const docRef = this.db.collection( this.collection ).doc(data._id);
            await docRef.set({
                ...data,
                updated_at: new Date().getTime(),
            });
            const doc = await docRef.get();
            return {
                ...doc.data(),
                _id: doc.id,
            };

        } catch(err) {
            console.log('Model.save error', err);
            return null;
        }
    }

    async create(data: any): Promise<any> {
        try {
            const docRef = this.db.collection( this.collection ).doc();
            await docRef.set({
                ...data,
                created_at: new Date().getTime(),
            });
            const doc = await docRef.get();
            return {
                ...doc.data(),
                _id: doc.id,
            };

        } catch(err) {
            console.log('Model.createNew error', err);
            return null;
        }
    }

    async delete(doc_id: string | number ): Promise<boolean> {
        try {
            const docRef = this.db.collection( this.collection ).doc( doc_id.toString() );
            await docRef.delete();

            return true;

        } catch(err) {
            console.log('Model.delete error', err);
            return false;
        }
    }

}

export {
    Model
}
