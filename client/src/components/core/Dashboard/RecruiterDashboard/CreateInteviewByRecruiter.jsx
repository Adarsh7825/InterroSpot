import React, { useState } from 'react';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInterview } from '../../../../services/operations/RecruiterAPI';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';

function CreateInterviewByRecruiter() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.profile);

    const token = user?.token;

    const [formState, setFormState] = useState({
        company: '',
        jobPositions: [{
            title: '',
            category: '',
            description: '',
            requiredSkills: ['']
        }],
        candidates: [{
            email: '',
            name: '',
            phone: ''
        }],
    });

    const handleInputChange = (e, index = null, field = null, subField = null) => {
        if (index !== null && field && subField) {
            const updatedItems = [...formState[field]];
            if (subField === 'requiredSkills') {
                updatedItems[index][subField] = e.target.value.split(',');
            } else {
                updatedItems[index][subField] = e.target.value;
            }
            setFormState({ ...formState, [field]: updatedItems });
        } else if (field && !subField) {
            setFormState({
                ...formState,
                [field]: e.target.value,
            });
        } else {
            console.error('Unexpected input change scenario');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: function (results) {
                    const candidates = results.data.map(candidate => ({
                        email: candidate[0],
                        name: candidate[1],
                        phone: candidate[2],
                    }));
                    setFormState(prevState => ({
                        ...prevState,
                        candidates: [...prevState.candidates, ...candidates],
                    }));
                },
                header: false,
            });
        }
    };

    const addCandidateField = () => {
        setFormState(prevState => ({
            ...prevState,
            candidates: [...prevState.candidates, { email: '', name: '', phone: '' }],
        }));
    };

    const removeCandidateField = (index) => {
        setFormState(prevState => ({
            ...prevState,
            candidates: prevState.candidates.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(createInterview(formState, navigate, token));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-8">
                <div className="border-b pb-4">
                    <h2 className="text-3xl font-bold text-gray-900">Create Interview Session</h2>
                    <p className="mt-2 text-gray-600">Fill in the details to schedule a new interview</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Company Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name
                                </label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    type="text"
                                    name="company"
                                    placeholder="Enter company name"
                                    value={formState.company}
                                    onChange={(e) => handleInputChange(e, null, 'company')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Position Details</h3>
                        {formState.jobPositions.map((position, index) => (
                            <div key={index} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="e.g., Senior Frontend Developer"
                                            value={position.title}
                                            onChange={(e) => handleInputChange(e, index, 'jobPositions', 'title')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={position.category}
                                            onChange={(e) => handleInputChange(e, index, 'jobPositions', 'category')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="frontend">Frontend Developer</option>
                                            <option value="backend">Backend Developer</option>
                                            <option value="Full Stack">Full Stack Developer</option>
                                            <option value="devops">DevOps Engineer</option>
                                            <option value="mobile">Mobile Developer</option>
                                            <option value="desktop">Desktop Developer</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Job description and requirements..."
                                        value={position.description}
                                        onChange={(e) => handleInputChange(e, index, 'jobPositions', 'description')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                                    <input
                                        type="text"
                                        name="requiredSkills"
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        value={position.requiredSkills.join(',')}
                                        onChange={(e) => handleInputChange(e, index, 'jobPositions', 'requiredSkills')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Candidate Details</h3>
                            <button
                                type="button"
                                onClick={addCandidateField}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <FiPlus className="w-5 h-5" />
                                Add Candidate
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formState.candidates.map((candidate, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm relative">
                                    <button
                                        type="button"
                                        onClick={() => removeCandidateField(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={candidate.email}
                                                onChange={(e) => handleInputChange(e, index, 'candidates', 'email')}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={candidate.name}
                                                onChange={(e) => handleInputChange(e, index, 'candidates', 'name')}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Full Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="text"
                                                value={candidate.phone}
                                                onChange={(e) => handleInputChange(e, index, 'candidates', 'phone')}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <FiUpload className="w-4 h-4" />
                                <span>Or upload candidates via CSV</span>
                            </div>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Create Interview Session
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateInterviewByRecruiter;