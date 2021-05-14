import Link from 'next/link'

export default function PostFeed ({ posts, admin }) {
  return (
    posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : <h1>No post found</h1>
  )
}

function PostItem ({ post, admin = false }) {
  const wordCount = post?.content.trim().split(/\s+/g).lenght
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <article className='card'>
      <Link href={`/${post.userName}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min to read
        </span>
        <span>
          ❤️ {post.heartCount} Hearts
        </span>
      </footer>
    </article>

  )
}
