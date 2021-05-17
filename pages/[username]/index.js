import PostFeed from '../../components/PostFeed'
import UserProfile from '../../components/UserProfile'
import { getUserWithUserName, postToJSON } from '../../lib/firebase'

export async function getServerSideProps ({ query }) {
  const { userName } = query

  const userDoc = await getUserWithUserName(userName)

  //Return a 404 if there is not user
  if (!userDoc) return { notFound: true }

  // JSON serializable data
  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()
    const postQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)
    posts = (await postQuery.get()).docs.map(postToJSON)
  }

  return {
    props: { user, posts }
  }
}

export default function UserProfilePage ({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}
