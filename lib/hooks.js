import { auth, firestore } from '../lib/firebase'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export function useUserData () {
  const [user] = useAuthState(auth)
  const [userName, setUserName] = useState(null)

  useEffect(() => {
    let unsubscribe

    if (user) {
      const ref = firestore.collection('users').doc(user.uid)
      unsubscribe = ref.onSnapshot((doc) => {
        setUserName(doc.data()?.userName)
      })
    } else {
      setUserName(null)
    }

    return unsubscribe
  }, [user])

  return { user, userName }
}
