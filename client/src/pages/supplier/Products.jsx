// src/pages/supplier/Products.jsx
import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';

export default function Products() {
    const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar role={currentUser?.role} />

      {/* Page Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <p>Manage your products here.</p>
      </div>
    </div>
  );
}
