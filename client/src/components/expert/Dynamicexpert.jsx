import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AppointmentForm from '/SmartTool/client/src/components/Appointmentform.jsx'; // Adjust the import path as necessary

export default function SingleExpertProfile() {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);

  useEffect(() => {
    if (expertId) {  // ✅ Add a safe check for expertId
      axios.get(`http://localhost:3000/api/expert/${expertId}`)
        .then(res => setExpert(res.data))
        .catch(err => console.error('Failed to load expert:', err));
    }
  }, [expertId]);

  if (!expert) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 font-sans text-gray-800">
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={expert.profilePicture || '/default-avatar.png'}
          alt={expert.username || 'Expert'}
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h1 className="text-3xl font-bold">{expert.username}</h1>
        <p className="text-gray-500">{expert.specialty}</p>
      </div>

      {/* Appointment Form */}
      <AppointmentForm />

      {/* Expert Details */}
      <div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Expert Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <strong>Email:</strong> <p>{expert.email}</p>
          </div>
          {/* <div>
            <strong>Role:</strong> <p>{expert.role}</p>
          </div> */}
          <div>
            <strong>Specialty:</strong> <p>{expert.specialty}</p>
          </div>
          <div>
            <strong>Years of Experience:</strong> <p>{expert.yearsOfExperience}</p>
          </div>
          <div className="md:col-span-2">
            <strong>Address:</strong> <p>{expert.address}</p>
          </div>
          <div className="md:col-span-2">
            <strong>Registration Status:</strong> <p>{expert.registrationStatus}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Book Now
        </button>
        <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Chat Now
        </button>
      </div>
    </div>
  );
}
