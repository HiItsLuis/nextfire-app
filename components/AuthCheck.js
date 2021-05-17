import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

export default function AuthCheck (props) {
  const { userName } = useContext(UserContext)

  return userName
    ? props.children
    : props.fallback || <Link href='/enter'><a>You must be signed in</a></Link>
}
