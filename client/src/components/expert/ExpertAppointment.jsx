// 📂 components/ExpertAppointmentDashboard.jsx

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar';
import axios from 'axios';

export default function ExpertAppointmentDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  // Assume expert ID is coming from auth user or props
  const expertId = currentUser?._id; // 🛑 Dynamic එකෙන් replace කරන්න login user id එකෙන්!

  useEffect(() => {
    if (!expertId) return; // wait till expertId is available

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/appointments/expert/${expertId}`, {
          withCredentials: true,
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [expertId]);

  const handleAccept = async (appointmentId) => {
    try {
      await axios.post(`http://localhost:3000/api/appointments/accept/${appointmentId}`, {}, {
        withCredentials: true,
      });
      alert('Appointment accepted');
      window.location.reload();
    } catch (err) {
      console.error('Accept failed:', err);
      alert('Failed to accept');
    }
  };

  const handleSuggest = async (appointmentId) => {
    const suggestedDate = prompt('Suggest a new date (YYYY-MM-DD):');
    const suggestedTime = prompt('Suggest a new time (HH:MM):');

    if (!suggestedDate || !suggestedTime) return;

    try {
      await axios.post(`http://localhost:3000/api/appointments/suggest/${appointmentId}`, {
        suggestedDate,
        suggestedTime,
      }, {
        withCredentials: true,
      });
      alert('Suggestion sent');
      window.location.reload();
    } catch (err) {
      console.error('Suggest failed:', err);
      alert('Failed to suggest');
    }
  };

  if (loading) return <div className="p-6">Loading appointments...</div>;

  return (
    <div className="flex">
      <Sidebar role="expert" />
      <div className="p-6 max-w-5xl mx-auto font-sans flex-1">
        <h2 className="text-2xl font-bold mb-6 text-center">My Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded shadow-md p-4 flex flex-col gap-2">
                <div>
                  <strong>Customer:</strong> {appointment.customerId?.username || 'N/A'}
                </div>
                <div>
                  <strong>Email:</strong> {appointment.customerId?.email || 'N/A'}
                </div>
                <div>
                  <strong>Problem:</strong> {appointment.description}
                </div>
                <div>
                  <strong>Date:</strong> {appointment.date} at {appointment.time}
                </div>
                <div>
                  <strong>Status:</strong> {appointment.status}
                </div>

                {appointment.status === 'pending' && (
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => handleAccept(appointment._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleSuggest(appointment._id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Suggest Time
                    </button>
                  </div>
                )}

                {appointment.status === 'suggested' && (
                  <div className="text-sm text-blue-600">
                    New Suggested Time: {appointment.suggestedDate} at {appointment.suggestedTime}
                  </div>
                )}

                {appointment.status === 'accepted' && (
                  <div className="text-sm text-green-600">
                    Appointment Accepted. Waiting for customer confirmation and payment.
                  </div>
                )}

                {appointment.paymentStatus === 'paid' && (
                  <div className="text-sm text-purple-600">
                    Payment completed! Ready to start communication.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
