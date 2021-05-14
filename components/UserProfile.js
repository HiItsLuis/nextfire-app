
export default function UserProfile ({ user }) {
  return (
    <section className='box-center'>
      <img src={user.photoURL} className='card-img-center' />
      <p>
        <i>@{user.userName}</i>
      </p>
      <h1>{user.displayName}</h1>
    </section>
  )
}
