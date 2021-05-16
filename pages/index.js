import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { firestore, postToJSON, fromMillis } from '../lib/firebase'
import { useState } from 'react'
import PostFeed from '../components/PostFeed'

const POSTS_LIMIT = 1

export async function getServerSideProps (context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(POSTS_LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts }
  }
}

export default function Home (props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)

  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(POSTS_LIMIT)

    const newPosts = (await query.get()).docs.map((doc) => doc.data())

    setPosts(posts.concat(newPosts))
    setLoading(false)

    if (newPosts.length < POSTS_LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <main>
      <h1>Home</h1>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end'}

      <div>
        <button onClick={() => toast.success('Hello toast!')}>
          Toast me
        </button>
      </div>

    </main>

  )
}
