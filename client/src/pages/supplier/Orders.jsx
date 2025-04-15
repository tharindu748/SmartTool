// src/pages/supplier/Orders.jsx
import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';

export default function Orders() {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar role={currentUser?.role} />
    
          {/* Page Content */}
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <p>All supplier orders will be listed here.</p>
          </div>
        </div>
      );
    }