import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';

export default function Analytics() {
    const { currentUser } = useSelector((state) => state.user);
    
    return (
        <div className="flex min-h-screen">
            {/* Sidebar - Fixed width */}
            <div className="w-64 border-r">
                <Sidebar role={currentUser?.role} />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>
                    <p className="text-gray-600 mb-8">View your performance metrics, sales, and reports.</p>
                    
                    {/* Analytics Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-medium text-gray-700 mb-2">Total Sales</h3>
                            <p className="text-3xl font-bold">$24,560</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-medium text-gray-700 mb-2">Orders</h3>
                            <p className="text-3xl font-bold">128</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-medium text-gray-700 mb-2">Conversion Rate</h3>
                            <p className="text-3xl font-bold">3.2%</p>
                        </div>
                    </div>
                    
                    {/* Charts Section */}
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h3 className="font-medium text-gray-700 mb-4">Sales Over Time</h3>
                        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                            <p className="text-gray-500">Sales chart will appear here</p>
                        </div>
                    </div>
                    
                    {/* Recent Orders */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-medium text-gray-700 mb-4">Recent Orders</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="border-b pb-3 last:border-0">
                                    <p>Order #{item} - $150.00</p>
                                    <p className="text-sm text-gray-500">Completed 2 days ago</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}