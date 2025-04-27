import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ChatSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/appointments/confirmed/${currentUser._id}`, {
          withCredentials: true,
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch confirmed appointments:', err);
      }
    };

    fetchAppointments();
  }, [currentUser._id]);

  return (
    <div className="w-full md:w-1/4 bg-white shadow-md overflow-y-auto p-4">
      <h2 className="text-lg font-bold mb-4">Chats</h2>
      <ul className="space-y-2">
        {appointments.map((appointment) => {
          const targetUser = appointment.customerId._id === currentUser._id
            ? appointment.expertId
            : appointment.customerId;
          return (
            <li key={appointment._id}>
              <Link
                to={`/chat/${targetUser._id}`}
                state={{ chatUserId: targetUser._id }}
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 transition"
              >
                <img
                  src={targetUser.profilePicture || '/default-avatar.png'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{targetUser.username}</h3>
                  <p className="text-xs text-gray-500 truncate w-40">Say hi 👋</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
