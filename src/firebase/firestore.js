import firebase from 'firebase';
import firebaseConfig from './config';
import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);

export default firebase.firestore;
