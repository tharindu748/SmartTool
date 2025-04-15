import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';

export default function Bank() {
    const { currentUser } = useSelector((state) => state.user);
    
    return (
        <div className="flex min-h-screen">
            {/* Sidebar - Fixed width */}
            <div className="w-64">
                <Sidebar role={currentUser?.role} />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold mb-4">Bank Account Details</h2>
                    <p className="mb-6">Update and manage your payment details here.</p>
                    
                    {/* Add your bank account form/content here */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold mb-4">Bank Information</h3>
                        <p>Bank form will go here...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}