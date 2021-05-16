import PostContent from '../../components/PostContent'
import { firestore, getUserWithUserName, postToJSON } from '../../lib/firebase'
import styles from '../../styles/Post.module.css'
import { useDocumentData } from 'react-firebase-hooks/firestore'

export async function getStaticProps ({ params }) {
  const { userName, slug } = params
  const userDoc = await getUserWithUserName(userName)

  let post
  let path

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug)
    post = postToJSON(await postRef.get())

    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 5000
  }
}

export async function getStaticPaths () {
  // Improve by using admin SDK to select empty docs -> more complex but should look into it
  const snapshot = await firestore.collectionGroup('posts').get()

  const paths = snapshot.docs.map((doc) => {
    const { userName, slug } = doc.data()
    return {
      params: { userName, slug }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export default function PostPage (props) {
  const postRef = firestore.doc(props.path)
  const [realTimePost] = useDocumentData(postRef)

  const post = realTimePost || props.post

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className='card'>
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>
      </aside>
    </main>
  )
}
