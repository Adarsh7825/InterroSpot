import React, { useState } from 'react';
import Papa from 'papaparse';

function CreateInterviewByRecruiter() {
    const [formState, setFormState] = useState({
        company: '',
        jobPositions: [{ title: '', category: '', description: '', requiredSkills: [''] }],
        candidates: [{ email: '', name: '', phone: '' }],
    });

    const handleInputChange = (e, index = null, field = null) => {
        if (index !== null && field) {
            // Handling changes in the candidates array
            const candidates = [...formState.candidates];
            candidates[index][field] = e.target.value;
            setFormState({ ...formState, candidates });
        } else {
            // Handling changes for company name and other non-array fields
            setFormState({
                ...formState,
                [e.target.name]: e.target.value,
            });
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
        console.log(formState);
        // Here you would typically send the formState to your backend API
    };
    return (
        <form onSubmit={handleSubmit} className="text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                    Company Name:
                </label>
                <input
                    className="border-black  shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="company"
                    type="text"
                    name="company"
                    placeholder="Enter company name"
                    value={formState.company}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                    Job Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formState.jobPositions[0].title}
                    onChange={(e) => {
                        const jobPositions = [...formState.jobPositions];
                        jobPositions[0].title = e.target.value;
                        setFormState({ ...formState, jobPositions });
                    }}
                    className='border-black  shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                />
            </div>
            {formState.candidates.map((candidate, index) => (
                <div key={index}>
                    <label>Candidate Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={candidate.email}
                        onChange={(e) => handleInputChange(e, index, 'email')}
                        className='border-black'
                    />
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={candidate.name}
                        onChange={(e) => handleInputChange(e, index, 'name')}
                    />
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={candidate.phone}
                        onChange={(e) => handleInputChange(e, index, 'phone')}
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