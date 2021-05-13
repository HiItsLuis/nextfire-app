import { useContext } from 'react'
import { UserContext } from '../lib/context'
import { auth, googleAuthProvider } from '../lib/firebase'

export default function EnterPage () {
  const [user, userName] = useContext(UserContext)

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />

  return (
    <main>
      <h1>Sign Up</h1>
      {user
        ? !userName ? <UserNameForm /> : <SignOutButton />
        : <SignInButton />}
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

}
