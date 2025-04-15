// import React from 'react';
// import Sidebar from '../../components/Sidebar';
// import { useSelector } from 'react-redux';

// export default function ExpertDashboard() {
//   const { currentUser } = useSelector((state) => state.user);

//   return (
//     <div className="min-h-screen flex">
//       <Sidebar role={currentUser?.role} />
//       <div className="flex-1 p-6 space-y-6">
//         <h1 className="text-2xl font-semibold">Welcome, {currentUser?.username}</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-white p-4 shadow rounded">Current Bookings</div>
//           <div className="bg-white p-4 shadow rounded">Messages</div>
//           <div className="bg-white p-4 shadow rounded">Edit Rates</div>
//           <div className="bg-white p-4 shadow rounded">Booking History</div>
//         </div>
//       </div>
//     </div>
//   );
// }
