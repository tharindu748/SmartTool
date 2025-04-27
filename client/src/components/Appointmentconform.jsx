import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function AppointmentConfirm() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/appointments/${appointmentId}`, {
          withCredentials: true,
        });
        setAppointment(res.data);
      } catch (err) {
        console.error('Failed to load appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleConfirm = async () => {
    try {
      await axios.post(`http://localhost:3000/api/appointments/confirm/${appointmentId}`, {}, {
        withCredentials: true,
      });
      alert('Appointment confirmed. You can now proceed to payment.');
      window.location.reload();
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
      alert('Failed to confirm appointment.');
    }
  };

  const handleDecline = async () => {
    try {
      await axios.post(`http://localhost:3000/api/appointments/decline-suggestion/${appointmentId}`, {}, {
        withCredentials: true,
      });
      alert('Suggestion declined. Please request a new time.');
      window.location.reload();
    } catch (err) {
      console.error('Failed to decline suggestion:', err);
      alert('Failed to decline suggestion.');
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      await axios.post(`http://localhost:3000/api/appointments/pay/${appointmentId}`, {}, {
        withCredentials: true,
      });
      alert('Payment successful! Communication with expert is now enabled.');
      window.location.href = `/chat/${appointment.expertId}`;
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Failed to complete payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading appointment details...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow font-sans">
      <h2 className="text-2xl font-bold mb-6 text-center">Confirm Your Appointment</h2>

      <div className="flex flex-col gap-4">
        <div>
          <strong>Expert:</strong> {appointment.expertId?.username || 'N/A'}
        </div>
        <div>
          <strong>Selected Date:</strong> {appointment.date} at {appointment.time}
        </div>
        {appointment.status === 'suggested' && (
          <div className="text-blue-600">
            <strong>Suggested New Date:</strong> {appointment.suggestedDate} at {appointment.suggestedTime}
          </div>
        )}
        <div>
          <strong>Problem Description:</strong> {appointment.description}
        </div>
        <div>
          <strong>Status:</strong> {appointment.status}
        </div>

        {/* Actions */}
        {appointment.status === 'pending' ? (
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition mt-4"
          >
            Confirm Appointment
          </button>
        ) : appointment.status === 'suggested' ? (
          <>
            <button
              onClick={handleConfirm}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition mt-4 mr-2"
            >
              Accept Suggested Time
            </button>
            <button
              onClick={handleDecline}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition mt-4"
            >
              Decline Suggestion
            </button>
          </>
        ) : appointment.status === 'confirmed' && appointment.paymentStatus === 'pending' ? (
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mt-4"
          >
            {paymentLoading ? 'Processing Payment...' : 'Pay Now'}
          </button>
        ) : (
          <div className="text-green-700 mt-4 font-semibold">
            Appointment Confirmed and Paid! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
