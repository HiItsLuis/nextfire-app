import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

export default function Navbar () {
  const [user, userName] = useContext(UserContext)

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link href='/'>
            <button className='btn-logo'>NXT</button>
          </Link>
        </li>

        {/* User is signed-in and has userName */}
        {userName && (
          <>
            <li className='push-left'>
              <Link href='/admin'>
                <button className='btn-blue'>Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${userName}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* User is not signed-in OR created userName */}
        {!userName && (
          <li>
            <Link href='enter'>
              <button className='btn-blue'>Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
