import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../utils/toastUtils';

interface User {
    id: number;
    name: string;
    email: string;
    studentId: string;
}

interface Class {
    id: number;
    name: string;
}

const EnrollUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

    useEffect(() => {
        fetchUsers();
        fetchClasses();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorToast('Error fetching users');
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await axiosInstance.get('/api/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            showErrorToast('Error fetching classes');
        }
    };

    const handleEnroll = async () => {
        if (!selectedUser) {
            showInfoToast('Please select a user');
            return;
        }

        if (selectedClasses.length === 0) {
            showInfoToast('Please select at least one class');
            return;
        }

        try {
            await axiosInstance.post('/api/enrollment/enroll', {
                userId: selectedUser,
                classIds: selectedClasses,
            });
            showSuccessToast('Enrollment successful');
            setSelectedUser(null);
            setSelectedClasses([]);
            fetchUsers();
        } catch (error: any) {
            console.error('Error enrolling user:', error);
            showErrorToast('Enrollment failed: ' + (error.response?.data?.message || error.message || 'Unknown error'));
        }
    };

    return (
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="mb-4">
                <label className="block mb-2 text-foreground">Select User:</label>
                <select
                    className="w-full p-2 border rounded bg-background text-foreground"
                    value={selectedUser || ''}
                    onChange={(e) => setSelectedUser(Number(e.target.value))}
                >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.studentId})
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-foreground">Select Classes:</label>
                {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id={`class-${cls.id}`}
                            checked={selectedClasses.includes(cls.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedClasses([...selectedClasses, cls.id]);
                                } else {
                                    setSelectedClasses(selectedClasses.filter((id) => id !== cls.id));
                                }
                            }}
                            className="mr-2"
                        />
                        <label htmlFor={`class-${cls.id}`} className="text-foreground">{cls.name}</label>
                    </div>
                ))}
            </div>
            <button
                onClick={handleEnroll}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                disabled={!selectedUser || selectedClasses.length === 0}
            >
                Enroll User
            </button>
        </div>
    );
};

export default EnrollUser;