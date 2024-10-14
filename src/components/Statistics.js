import React, { useEffect, useState } from 'react';

// Example Data for Cards
const data = {
  activeComplaints: 25,
  assignedWorkers: 15,
  activeTrashtrons: 8,
  recentActivities: [
    { id: 1, activity: "Complaint #1023 Assigned to Worker John", date: "2024-04-15", status: "Pending" },
    { id: 2, activity: "Robo Trashtron #5 Started Collection", date: "2024-04-14", status: "Active" },
    { id: 3, activity: "Worker Emily Completed Task #45", date: "2024-04-13", status: "Completed" },
    // Add more activities as needed
  ],
};

const Statistics = () => {
  // State to manage recent activities
  const [activities, setActivities] = useState([]);

  // Effect to initialize activities
  useEffect(() => {
    setActivities(data.recentActivities);
  }, []);

  // Function to determine badge class based on status
  const getBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-500 text-white";
      case "Active":
        return "bg-green-500 text-white";
      case "Completed":
        return "bg-blue-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto p-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {/* Active Complaints Card */}
        <div className="w-full max-w-xs mx-auto p-4 border rounded shadow bg-white">
          
          <div className="card-header font-bold text-black ">Active Complaints</div>
          <div className="text-blue"></div>
          <div className="card-body">
          <h5 className="card-title text-2xl text-gray-700 font-Roboto mb-4">
          {data.activeComplaints}
          </h5>
          <a href="#" className="btn text-white bg-blue-500 rounded p-2">
          View Details
          </a>
          </div>
          </div>

        {/* Assigned Workers Card */}
        {/*<div className="w-full max-w-xs mx-auto p-4 border rounded shadow bg-white">
          <div className="card-header font-bold text-black font-Roboto">Assigned Workers</div>
          <div className="card-body">
          <h5 className="card-title text-2xl text-gray-700 mb-4">{data.assignedWorkers}</h5>
          <a href="#" className="btn text-white bg-blue-500 rounded p-2">View Workers</a>
          </div>
        </div> */}

        {/* Active Robo Trashtrons Card */}
        <div className="w-full max-w-xs mx-auto p-4 border rounded shadow bg-white">
          <div className="card-header font-bold text-lg text-black">Robo Trashtrons Active</div>
          <div className="card-body">
            <h5 className="card-title text-2xl text-gray-700 mb-4">{data.activeTrashtrons}</h5>
        
            <a href="#" className="btn text-white bg-blue-500 rounded p-2">Monitor Robots</a>
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="mt-4">
        <h2 className="text-black text-X1 font-bold font=Roboto mb-2">Recent Activities</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Activity</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
  {activities.map(activity => (
    <tr key={activity.id} className="hover:bg-gray-100 text-black">
      <th className="border px-4 py-2">{activity.id}</th>
      <td className="border px-4 py-2">{activity.activity}</td>
      <td className="border px-4 py-2">{activity.date}</td>
      <td className="border px-4 py-2">
        <span className={`badge ${getBadgeClass(activity.status)} rounded p-1`}>
          {activity.status}
        </span>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
