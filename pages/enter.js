import { debounce } from 'lodash'
import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../lib/context'
import { auth, firestore, googleAuthProvider } from '../lib/firebase'

export default function EnterPage () {
  const { user, userName } = useContext(UserContext)

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />

  return (
    <main>
      <h1>Sign Up</h1>
      {user ? !userName ? <UserNameForm /> : <SignOutButton /> : <SignInButton />}
    </main>

  )
}

// Sign in with Google button
function SignInButton () {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider)
  }

  return (
    <button className='btn-google' onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  )
}

// Sign out button
function SignOutButton () {
  return (
    <button onClick={() => auth.signOut()}>
      Sign Out
    </button>
  )
}

function UserNameForm () {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, userName } = useContext(UserContext)

  const onSubmit = async (e) => {
    e.preventDefault()
    const userDoc = firestore.doc(`users/${user.uid}`)
    const userNameDoc = firestore.doc(`userNames/${formValue}`)

    const batch = firestore.batch()
    batch.set(userDoc, { userName: formValue, photoURL: user.photoURL, displayName: user.displayName })
    batch.set(userNameDoc, { uid: user.uid })

    await batch.commit()
  }

  const onChange = (e) => {
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  const checkUserName = useCallback(
    debounce(async (userName) => {
      if (userName.length >= 3) {
        const ref = firestore.doc(`userNames/${userName}`)
        const { exists } = await ref.get()
        console.log('Firestore read executed')
        setLoading(false)
        setIsValid(!exists)
      }
    }, 500)

  )

  useEffect(() => {
    checkUserName(formValue)
  }, [formValue])

  return (
    !userName && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name='userName' placeholder='userName' value={formValue} onChange={onChange} />
          <UserNameMessage userName={formValue} isValid={isValid} loading={loading} />

          <button type='submit' className='btn-green' disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UserNameMessage ({ userName, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className='text-success'>{userName} is available!</p>
  } else if (userName && !isValid) {
    return <p className='text-danger'>That username is taken!</p>
  } else {
    return <p>Your username must have 3 or more characters.</p>
  }
}
