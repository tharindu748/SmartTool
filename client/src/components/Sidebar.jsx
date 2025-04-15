// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';
import { HiUser, HiArrowSmRight, HiChartBar, HiClipboardList, HiCreditCard, HiHeart, HiBriefcase } from 'react-icons/hi';

export default function Sidebar({ role }) {
  const sidebarItems = {
    supplier: [
      { label: 'My Profile', to: '/profile', icon: <HiUser /> },
      { label: 'Orders', to: '/orders', icon: <HiClipboardList /> },
      { label: 'Product', to: '/products', icon: <HiBriefcase /> },
      { label: 'Analytics', to: '/analytics', icon: <HiChartBar /> },
      { label: 'Bank Account Details', to: '/bank', icon: <HiCreditCard /> },
    ],
    customer: [
      { label: 'My Profile', to: '/customer/dashboard', icon: <HiUser /> },
      { label: 'Orders', to: '/customer/orders', icon: <HiClipboardList /> },
      { label: 'Favorites', to: '/customer/favorites', icon: <HiHeart /> },
    ],
    expert: [
      { label: 'My Profile', to: '/eprofile', icon: <HiUser /> },
      { label: 'Appointments', to: '/expert/appointments', icon: <HiClipboardList /> },
      { label: 'Qualification', to: '/expert/qualifications', icon: <HiChartBar /> },
    ],
  };

  const menuItems = sidebarItems[role] || [];

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between min-h-screen">
      <div>
        <h2 className="text-xl font-bold mb-6 capitalize">{role} Panel</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-all"
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="text-base">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button className="flex items-center mt-6 text-red-500 hover:text-red-600 transition">
        <HiArrowSmRight className="mr-2" /> Log out
      </button>
    </div>
  );
}
