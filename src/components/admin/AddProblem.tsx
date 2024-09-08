import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../utils/toastUtils';

interface FormData {
  title: string;
  description: string;
  link: string;
  classIds: number[];
}

interface Class {
  id: number;
  name: string;
}

const AddProblem: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    link: '',
    classIds: [],
  });
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('course'); // Updated API path
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showErrorToast('Error fetching classes');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.link) {
      showInfoToast('Please fill in all required fields');
      return;
    }
    if (formData.classIds.length === 0) {
      showInfoToast('Please select at least one class');
      return;
    }
    try {
      await axiosInstance.post('problem', formData); // Updated API path
      showSuccessToast('Problem added successfully');
      setFormData({ title: '', description: '', link: '', classIds: [] });
    } catch (error: any) {
      console.error('Error adding problem:', error);
      showErrorToast('Failed to add problem: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  return (
    <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-background text-foreground"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-background text-foreground"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Link:</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-background text-foreground"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Select Classes:</label>
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`class-${cls.id}`}
                checked={formData.classIds.includes(cls.id)}
                onChange={() => {
                  setFormData(prevData => ({
                    ...prevData,
                    classIds: prevData.classIds.includes(cls.id)
                      ? prevData.classIds.filter(id => id !== cls.id)
                      : [...prevData.classIds, cls.id]
                  }));
                }}
                className="mr-2"
              />
              <label htmlFor={`class-${cls.id}`} className="text-foreground">{cls.name}</label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          disabled={!formData.title || !formData.description || !formData.link || formData.classIds.length === 0}
        >
          Add Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;