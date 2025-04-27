import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ useNavigate import

export default function AppointmentForm() {
  const { expertId } = useParams();
  const navigate = useNavigate(); // ✅ useNavigate hook
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time || !description) {
      alert('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      await axios.post('http://localhost:3000/api/appointments', {
        expertId,
        date,
        time,
        description,
      }, {
        withCredentials: true,
      });

      navigate('/appointment-success'); // ✅ Redirect to success page
    } catch (err) {
      console.error('Appointment request failed:', err);
      alert('Failed to submit appointment request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md font-sans">
      <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div>
          <label className="block mb-1 font-medium">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Problem Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded resize-none"
            rows="4"
            placeholder="Briefly describe your issue..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Submitting...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}
