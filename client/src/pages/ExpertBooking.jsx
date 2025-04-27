import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/expert') // ✅ correct route
      .then(res => {
        const approvedExperts = res.data;
        setTeamMembers(approvedExperts);
      })
      .catch(err => console.error('❌ Failed to load approved experts:', err));
  }, []);

  return (
    <div className="font-sans text-gray-800">
      

      {/* Hero Section */}
      <section className="text-center py-16 px-6 md:px-0 bg-white">
        <h1 className="text-sm text-gray-500 uppercase font-semibold mb-2">Our Team</h1>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          We help others grow and succeed through exceptional digital experiences
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Meet the experts shaping the future through powerful and scalable solutions, with a passion for precision.
        </p>
      </section>

      {/* Team Section */}
      <section className="bg-gray-100 py-16">
  <h2 className="text-center text-2xl font-bold mb-10">Our Amazing Experts</h2>
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
    {teamMembers.length > 0 ? (
      teamMembers.map((member, index) => (
        <Link to={`/expert/${member._id}`} key={index}>
          <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition">
            <img
              src={member.profilePicture || '/default-avatar.png'}
              alt={member.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="font-semibold text-lg">{member.username}</h3>
            <p className="text-sm text-gray-500">{member.specialty}</p>
            <p className="text-xs text-gray-400">{member.yearsOfExperience} years experience</p>
          </div>
        </Link>
      ))
    ) : (
      <p className="text-center col-span-3 text-gray-600">No approved experts available yet.</p>
    )}
  </div>
</section>


      {/* Testimonial Section */}
      <section className="bg-blue-100 py-16 text-center px-6">
        <p className="text-xl italic text-gray-700 max-w-2xl mx-auto mb-6">
          “Aenean quisdonec elit ornare. Praesent lorem non, ultricies justo. Habitasse efficitur, massa in auctor euismod,
          quam elit ultricies urna, eget porttitor arcu nisl mattis.”
        </p>
        <p className="text-gray-800 font-semibold">Margo Lewis</p>
        <p className="text-sm text-gray-500">Secretary</p>
      </section>

      {/* Contact Prompt Section */}
      <section className="py-16 px-6 text-center bg-white">
        <h3 className="text-2xl font-bold mb-4">We are always ready to help</h3>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          Want to get in touch with an expert? Reach out today for a seamless and impactful experience.
        </p>
        <div className="flex justify-center gap-6">
          <img
            src="https://randomuser.me/api/portraits/women/50.jpg"
            alt="Contact Person"
            className="w-28 h-28 rounded-lg object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/men/50.jpg"
            alt="Contact Person"
            className="w-28 h-28 rounded-lg object-cover"
          />
        </div>
      </section>

    </div>
  );
}
