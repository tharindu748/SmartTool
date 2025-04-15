import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashSidebar({ tab, setTab }) {
  return (
    <div className='min-w-max min-h-full md:w-56  bg-gray-800'>
    <div className=" text-white p-4">
      <div className="text-xl font-semibold mb-6">Dashboard</div>
      <div className="flex flex-col gap-4">
        {/* Profile Link */}
        <Link
          to="/dashboard?tab=profile"
          className={`flex items-center p-3 rounded-md hover:bg-gray-700 ${
            tab === 'profile' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setTab('profile')} // Update tab state when clicked
        >
          <HiUser className="mr-3 text-lg" />
          <span className="text-lg">Profile</span>
          <span className="ml-2 text-sm text-gray-400">User</span> {/* Added User label here */}
        </Link>

        <Link
          to="/dashboard?tab=Order"
          className={`flex items-center p-3 rounded-md hover:bg-gray-700 ${
            tab === 'Order' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setTab('profile')} // Update tab state when clicked
        >
          <div className="mr-3 text-lg" />
          <span className="text-lg">Profile ditails</span>
        </Link>

        <Link
          to="/dashboard?tab=Order"
          className={`flex items-center p-3 rounded-md hover:bg-gray-700 ${
            tab === 'Order' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setTab('profile')} // Update tab state when clicked
        >
          <div className="mr-3 text-lg" />
          <span className="text-lg">Order</span>
        </Link>


        {/* Sign Out Link */}
        <button
          onClick={() => console.log("Sign Out clicked")}
          className="flex items-center p-3 rounded-md hover:bg-gray-700 cursor-pointer"
        >
          <HiArrowSmRight className="mr-3 text-lg" />
          <span className="text-lg">Sign Out</span>
        </button>
      </div>
    </div>
    </div>
  );
}
