import React, { useState } from 'react';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInterview } from '../../../../services/operations/RecruiterAPI';

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
            // Handling changes in arrays with subFields (like jobPositions and candidates)
            const updatedItems = [...formState[field]];
            if (subField === 'requiredSkills') {
                // Assuming skills are comma-separated
                updatedItems[index][subField] = e.target.value.split(',');
            } else {
                // Directly updating subFields within arrays (like name and phone in candidates)
                updatedItems[index][subField] = e.target.value;
            }
            setFormState({ ...formState, [field]: updatedItems });
        } else if (field && !subField) {
            // Directly updating fields within formState that are not arrays
            setFormState({
                ...formState,
                [field]: e.target.value,
            });
        } else {
            // Fallback for any other cases, if needed
            console.error('Unexpected input change scenario');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
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
        <form onSubmit={handleSubmit} className="text-caribbeangreen-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {/* Company Name Input */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                    Company Name:
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="company"
                    type="text"
                    name="company"
                    placeholder="Enter company name"
                    value={formState.company}
                    onChange={(e) => handleInputChange(e, null, 'company')} />
            </div>

            {/* Job Position Inputs */}
            {formState.jobPositions.map((position, index) => (
                <div key={index} className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Job Position:
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={position.title}
                        onChange={(e) => handleInputChange(e, index, 'jobPositions', 'title')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <select
                        name="category"
                        value={position.category}
                        onChange={(e) => handleInputChange(e, index, 'jobPositions', 'category')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select Category</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="Full Stack">Full Stack</option>
                    </select>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={position.description}
                        onChange={(e) => handleInputChange(e, index, 'jobPositions', 'description')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                        type="text"
                        name="requiredSkills"
                        placeholder="Required Skills (comma-separated)"
                        value={position.requiredSkills.join(',')}
                        onChange={(e) => handleInputChange(e, index, 'jobPositions', 'requiredSkills')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            ))}

            {/* Candidate Inputs */}
            {formState.candidates.map((candidate, index) => (
                <div key={index}>
                    <label>Candidate Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={candidate.email}
                        onChange={(e) => handleInputChange(e, index, 'candidates', 'email')} className='border-black text-black'
                    />
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={candidate.name}
                        onChange={(e) => handleInputChange(e, index, 'candidates', 'name')}
                        className='text-black'
                    />
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={candidate.phone}
                        onChange={(e) => handleInputChange(e, index, 'candidates', 'phone')}
                        className='text-black'
                    />
                    <button type="button" onClick={() => removeCandidateField(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={addCandidateField}>Add Another Candidate</button>
            <div>
                <label>Upload Candidates CSV:</label>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default CreateInterviewByRecruiter;