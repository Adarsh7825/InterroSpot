import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQuestion } from '../../../services/operations/CreateQuestionAPI';
import { useNavigate } from 'react-router-dom';

const CreateQuestionForm = () => {
    const { token } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        text: '',
        mainCategory: 'frontend',
        subCategory: 'browser_storage',
        difficulty: 'medium',
        tags: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagsArray = formData.tags.split(',').map(tag => tag.trim());
        dispatch(createQuestion({ ...formData, tags: tagsArray }, token, navigate));
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 mt-10 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create Question</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Question Text</label>
                    <input
                        type="text"
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Main Category</label>
                    <select
                        name="mainCategory"
                        value={formData.mainCategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="full_stack">Full Stack</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Sub Category</label>
                    <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    >
                        <option value="browser_storage">Browser Storage</option>
                        <option value="functionality_correct_solution">Functionality Correct Solution</option>
                        <option value="performant">Performant</option>
                        <option value="pseudo_code">Pseudo Code</option>
                        <option value="corner_cases">Corner Cases</option>
                        <option value="data_structure">Data Structure</option>
                        <option value="html_css_basic">HTML/CSS Basic</option>
                        <option value="html_css_advanced">HTML/CSS Advanced</option>
                        <option value="html_css_responsive_grid">HTML/CSS Responsive Grid</option>
                        <option value="javascript_fundamentals">JavaScript Fundamentals</option>
                        <option value="asynchronous_programming">Asynchronous Programming</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Difficulty</label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Create Question
                </button>
            </form>
        </div>
    );
};

export default CreateQuestionForm;