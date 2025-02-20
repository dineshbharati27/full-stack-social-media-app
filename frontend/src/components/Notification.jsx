// Notification.jsx
import React from 'react';

const notifications = [
  { name: 'bhumika_mahale_09', followedBy: 'mrudula411 + 16 more' },
  { name: 'sejal_wagh_29', followedBy: 'mrudula411 + 21 more' },
  { name: 'bhxveshh_', followedBy: 'vaibhav__kasar_14 more' },
  { name: 'niranjan_rajput67', followedBy: 'patil_akshay_777 + more' },
  { name: 'pareshbhamare_95', followedBy: 'lakshya_chaudhari + more' },
];

const Notification = () => {
  return (
    <div className="w-1/4 p-4">
      <h2 className="font-bold text-xl mb-4">Notifications</h2>
      {notifications.map((user, index) => (
        <div key={index} className="flex justify-between items-center py-2">
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-400">Followed by {user.followedBy}</p>
          </div>
          <button className="text-blue-500 font-bold">Follow</button>
        </div>
      ))}
    </div>
  );
};

export default Notification;