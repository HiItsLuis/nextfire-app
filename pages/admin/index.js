import AuthCheck from '../../components/AuthCheck'

export default function AdminPostPage () {
  return (
    <main>
      <AuthCheck>
        <h1>Admin Page</h1>
      </AuthCheck>
    </main>
  )
}
