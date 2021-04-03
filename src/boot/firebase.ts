import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

// Agregar configuracion firebase
const firebaseConfig = {
  apiKey: 'AIzaSyARn8uMFT5HFMklVAvL5V1WpbN_e9sx42E',
  authDomain: 'cuestionpiel.firebaseapp.com',
  projectId: 'cuestionpiel',
  storageBucket: 'cuestionpiel.appspot.com',
  messagingSenderId: '681913110874',
  appId: '1:681913110874:web:94c4f93b11ffa9b625a363',
  measurementId: 'G-BP4CGG8G3Y'
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const analytics = firebase.analytics()

export { db, firebase, analytics }
