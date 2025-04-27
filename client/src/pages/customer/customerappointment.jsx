import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

export default function CustomerAppointments() {
  const { currentUser } = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/appointments/customer/${currentUser._id}`, {
          withCredentials: true,
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch appointments', err);
      }
    };

    fetchAppointments();
  }, [currentUser._id]);

  return (
    <div className="flex h-screen font-sans"> {/* ✅ Important: use h-screen */}
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-md flex flex-col">
      <Sidebar role="buyer" />
      </div>

      {/* Main Appointments Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header */}
        <div className="p-6 shadow-md bg-white">
          <h1 className="text-2xl font-bold">My Appointments</h1>
        </div>

        {/* Appointments List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <ul className="space-y-6">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="bg-white p-6 rounded shadow space-y-3">
                <p><strong>Expert:</strong> {appointment.expertId?.username || 'N/A'}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
                <p><strong>Suggested Date:</strong> {appointment.suggestedDate || 'N/A'}</p>
                <p><strong>Suggested Time:</strong> {appointment.suggestedTime || 'N/A'}</p>

                {/* Buttons */}
                {appointment.status === 'suggested' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptSuggestion(appointment._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Accept Suggested Time
                    </button>
                    <button
                      onClick={() => handleDeclineSuggestion(appointment._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {appointment.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel Appointment
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
