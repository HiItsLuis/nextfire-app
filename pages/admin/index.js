import styles from '../../styles/Admin.module.css'
import AuthCheck from '../../components/AuthCheck'
import { auth, firestore, serverTimestamp } from '../../lib/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import PostFeed from '../../components/PostFeed'
import { useContext, useState } from 'react'
import { UserContext } from '../../lib/context'
import { useRouter } from 'next/router'
import { kebabCase } from 'lodash'
import toast from 'react-hot-toast'

export default function AdminPostPage () {
  return (
    <main>
      <AuthCheck>
        <h1>Admin Page: Manage your Posts</h1>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList () {
  const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map((doc) => doc.data())

  return (
    <PostFeed posts={posts} admin />
  )
}

function CreateNewPost () {
  const router = useRouter()
  const { userName } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is safe
  const slug = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  // Create a new post in firestores
  const createPost = async (e) => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)

    // Tip: give all fields a default value
    const data = {
      title,
      slug,
      uid,
      userName,
      published: false,
      content: '#WOLOLO',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0
    }
    await ref.set(data)

    toast.success('Post created!')

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`)

    //
  }

  return (
    <form onSubmit={createPost} className={styles.input}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='My awesome Post Title'
        className='input'
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create New Post
      </button>
    </form>
  )
}
