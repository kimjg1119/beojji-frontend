import React, { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';
import { HiUserGroup, HiAcademicCap, HiClipboardList, HiChartPie } from 'react-icons/hi';
import axiosInstance from '../../utils/axios';
import { showErrorToast } from '../../utils/toastUtils';

interface DashboardStats {
  totalUsers: number;
  totalClasses: number;
  totalProblems: number;
  totalSubmissions: number; // Changed from completionRate
}

interface Activity {
  id: number;
  type: string;
  content: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalClasses: 0,
    totalProblems: 0,
    totalSubmissions: 0, // Changed from completionRate
  });
  const [loading, setLoading] = useState(true);
  const [activities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsResponse = await axiosInstance.get('admin/stats');
        setStats(statsResponse.data);
        
        try {
          // const activitiesResponse = await axiosInstance.get('admin/activities');
          // setActivities(activitiesResponse.data);
        } catch (error) {
          console.error('Error fetching activities:', error);
          showErrorToast('Failed to load recent activities');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        showErrorToast('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-blue-600 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
              <HiUserGroup className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-green-600 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
              <HiAcademicCap className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Classes</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClasses}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-yellow-600 bg-yellow-100 rounded-lg dark:bg-yellow-800 dark:text-yellow-200">
              <HiClipboardList className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Problems</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProblems}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-purple-600 bg-purple-100 rounded-lg dark:bg-purple-800 dark:text-purple-200">
              <HiChartPie className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Submissions</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSubmissions}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-8">Recent Activity</h2>
      <Card>
        <div className="flow-root">
          {activities.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {activities.map((activity) => (
                <li key={activity.id} className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {activity.content}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent activities or failed to load activities.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
