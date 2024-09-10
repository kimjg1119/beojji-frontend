import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../utils/toastUtils';

interface User {
    id: number;
    username: string;
    email: string;
    studentId: string;
}

interface Course {
    id: number;
    name: string;
}

const EnrollUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('user');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorToast('Error fetching users');
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axiosInstance.get('course');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            showErrorToast('Error fetching courses');
        }
    };

    const handleEnroll = async () => {
        if (!selectedUser) {
            showInfoToast('Please select a user');
            return;
        }

        if (selectedCourses.length === 0) {
            showInfoToast('Please select at least one course');
            return;
        }

        try {
            await axiosInstance.post('/api/enrollment/enroll', {
                userId: selectedUser,
                courseIds: selectedCourses,
            });
            showSuccessToast('Enrollment successful');
            setSelectedUser(null);
            setSelectedCourses([]);
            fetchUsers();
        } catch (error: unknown) {
            console.error('Error enrolling user:', error);
            if (error instanceof Error) {
                showErrorToast('Enrollment failed: ' + error.message);
            } else if (typeof error === 'object' && error !== null && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                showErrorToast('Enrollment failed: ' + (axiosError.response?.data?.message || 'Unknown error'));
            } else {
                showErrorToast('Enrollment failed: Unknown error');
            }
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
                            {user.username} ({user.studentId})
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-foreground">Select Courses:</label>
                {courses.map((course) => (
                    <div key={course.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id={`course-${course.id}`}
                            checked={selectedCourses.includes(course.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedCourses([...selectedCourses, course.id]);
                                } else {
                                    setSelectedCourses(selectedCourses.filter((id) => id !== course.id));
                                }
                            }}
                            className="mr-2"
                        />
                        <label htmlFor={`course-${course.id}`} className="text-foreground">{course.name}</label>
                    </div>
                ))}
            </div>
            <button
                onClick={handleEnroll}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                disabled={!selectedUser || selectedCourses.length === 0}
            >
                Enroll User
            </button>
        </div>
    );
};

export default EnrollUser;