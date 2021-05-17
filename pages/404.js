import Link from 'next/link'

export default function Custom404 () {
  return (
    <main>
      <h1>404 - That page does not seem to exist...</h1>
      <p>It's dangerous to go alone...</p>
      <Link href='/'>
        <button className='btn-blue'>Go home</button>
      </Link>
    </main>
  )
}
