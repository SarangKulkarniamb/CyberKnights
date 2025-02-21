import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-8">
        You do not have permission to view this page.
      </p>
      <Link 
        to="/" 
        className="px-6 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900"
      >
        Go to Homepage
      </Link>
    </div>
  )
}
export default Unauthorized