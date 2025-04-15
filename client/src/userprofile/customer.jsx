import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/customer/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const addAddress = async () => {
    try {
      const res = await axios.post('/api/customer/address', newAddress);
      setProfile((prev) => ({ ...prev, addresses: [...prev.addresses, res.data] }));
      setNewAddress({ label: '', street: '', city: '', postalCode: '', country: '' });
    } catch (err) {
      console.error('Error adding address:', err);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Profile</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Addresses</h3>
        <ul className="space-y-2">
          {profile.addresses.map((addr, idx) => (
            <li key={idx} className="border p-3 rounded">
              <strong>{addr.label}</strong><br />
              {addr.street}, {addr.city}, {addr.postalCode}, {addr.country}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Add New Address</h4>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" name="label" placeholder="Label (e.g., Home)" value={newAddress.label} onChange={handleAddressChange} className="border p-2 rounded" />
            <input type="text" name="street" placeholder="Street" value={newAddress.street} onChange={handleAddressChange} className="border p-2 rounded" />
            <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleAddressChange} className="border p-2 rounded" />
            <input type="text" name="postalCode" placeholder="Postal Code" value={newAddress.postalCode} onChange={handleAddressChange} className="border p-2 rounded" />
            <input type="text" name="country" placeholder="Country" value={newAddress.country} onChange={handleAddressChange} className="border p-2 rounded col-span-2" />
          </div>
          <button onClick={addAddress} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Add Address</button>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Cart</h3>
        {profile.cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-2">
            {profile.cart.map((item, idx) => (
              <li key={idx} className="border p-3 rounded">
                Product: {item.productId} — Quantity: {item.quantity} — Price: ${item.price}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Order History</h3>
        {profile.orderHistory.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <ul className="space-y-2">
            {profile.orderHistory.map((order, idx) => (
              <li key={idx} className="border p-3 rounded">
                Order ID: {order.orderId} — Status: {order.status} — Date: {new Date(order.orderDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default CustomerProfile;