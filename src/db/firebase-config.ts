import admin from 'firebase-admin';
import * as firebase from 'firebase/app';

const serviceAccount = require('../../service-account.json');

// Initialize Firebase
const config = {
    apiKey: serviceAccount.api_key,
    authDomain: serviceAccount.auth_domain,
    projectId: serviceAccount.project_id,
    storageBucket: serviceAccount.storage_bucket,
    messagingSenderId: serviceAccount.messaging_sender_id,
    appId: serviceAccount.app_id,
    measurementId: serviceAccount.measurement_id,
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

firebase.initializeApp(config);
