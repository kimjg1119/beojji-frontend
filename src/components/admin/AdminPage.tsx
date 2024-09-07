import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import EnrollUser from './EnrollUser';
import AddProblem from './AddProblem';
// Import other admin components as needed

const AdminPage: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'enroll':
        return <EnrollUser />;
      case 'addClass':
        return <div>Add Class Content</div>;
      case 'addProblem':
        return <AddProblem />;
      case 'analytics':
        return <div>Analytics Content</div>;
      case 'settings':
        return <div>Settings Content</div>;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <AdminSidebar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        {activePage === 'dashboard' && 'Dashboard'}
        {activePage === 'enroll' && 'Enroll User'}
        {activePage === 'addClass' && 'Add Class'}
        {activePage === 'addProblem' && 'Add Problem'}
        {activePage === 'analytics' && 'Analytics'}
        {activePage === 'settings' && 'Settings'}
        </h1>
        {renderActivePage()}
      </div>
    </div>
  );
};

export default AdminPage;