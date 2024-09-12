import React from "react";
import { Sidebar } from "flowbite-react";
import {
  HiChartPie,
  HiViewBoards,
  HiInbox,
  HiUser,
  HiChartBar,
  HiCog,
} from "react-icons/hi";

interface AdminSidebarProps {
  setActivePage: (page: string) => void;
  activePage: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  setActivePage,
  activePage,
}) => {
  const sidebarItems = [
    { id: "dashboard", name: "Dashboard", icon: HiChartPie },
    { id: "enroll", name: "Enroll User", icon: HiUser },
    { id: "addClass", name: "Add Class", icon: HiViewBoards },
    { id: "addProblem", name: "Add Problem", icon: HiInbox },
    { id: "analytics", name: "Analytics", icon: HiChartBar },
    { id: "settings", name: "Settings", icon: HiCog },
  ];

  return (
    <Sidebar aria-label="Admin Sidebar" className="bg-gray-900">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {sidebarItems.map((item) => (
            <Sidebar.Item
              key={item.id}
              href="#"
              icon={item.icon}
              onClick={() => setActivePage(item.id)}
              active={activePage === item.id}
              className={`
                ${activePage === item.id ? "bg-blue-700 text-white" : "text-gray-400 hover:bg-gray-800"}
                transition-colors duration-200
              `}
            >
              {item.name}
            </Sidebar.Item>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AdminSidebar;
