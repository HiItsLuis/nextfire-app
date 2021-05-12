import Loader from '../components/Loader'
import toast from 'react-hot-toast'

export default function Home () {
  return (
    <>
      <h1>Home</h1>
      <Loader show />
      <div>
        <button onClick={() => toast.success('Hello toast!')}>
          Toast me
        </button>
      </div>
    </>

  )
}
