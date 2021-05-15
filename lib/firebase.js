import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCGDy2BEMCbQelpvH3uN6lfPK4vG6RXZDY',
  authDomain: 'nextfire-course-28904.firebaseapp.com',
  projectId: 'nextfire-course-28904',
  storageBucket: 'nextfire-course-28904.appspot.com',
  messagingSenderId: '162353053445',
  appId: '1:162353053445:web:fbdbaa6025422b0930816c',
  measurementId: 'G-5KFSH5LL03'
}

// You can only initialize a firebase app once.
// Next.js might try to do it twice so we wrap the
// initialization inside a if with a length check
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const firestore = firebase.firestore()
export const storage = firebase.storage()

export const fromMillis = firebase.firestore.Timestamp.fromMillis

// Helper functions

// Gets a users{uid} document with userName
// @param  {string} userName

export async function getUserWithUserName (userName) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('userName', '==', userName).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

export function postToJSON (doc) {
  const data = doc.data()
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis()
  }
}
