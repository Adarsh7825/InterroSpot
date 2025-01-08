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
        <div className="max-w-2xl mx-auto p-8">
            <div className="bg-[#1A1A2E] rounded-xl border border-[#533483]/20 shadow-xl p-8">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#E94560] to-[#533483] text-transparent bg-clip-text">
                    Create New Question
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">
                            Question Text
                        </label>
                        <textarea
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            className="w-full p-3 bg-[#0F3460]/30 rounded-lg border border-[#533483]/30 text-white placeholder-gray-500 focus:border-[#E94560] focus:outline-none transition-all duration-300 min-h-[100px]"
                            required
                            placeholder="Enter your question here..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">
                                Main Category
                            </label>
                            <select
                                name="mainCategory"
                                value={formData.mainCategory}
                                onChange={handleChange}
                                className="w-full p-3 bg-[#0F3460]/30 rounded-lg border border-[#533483]/30 text-white focus:border-[#E94560] focus:outline-none transition-all duration-300"
                                required
                            >
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="full_stack">Full Stack</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">
                                Sub Category
                            </label>
                            <select
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleChange}
                                className="w-full p-3 bg-[#0F3460]/30 rounded-lg border border-[#533483]/30 text-white focus:border-[#E94560] focus:outline-none transition-all duration-300"
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">
                                Difficulty
                            </label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="w-full p-3 bg-[#0F3460]/30 rounded-lg border border-[#533483]/30 text-white focus:border-[#E94560] focus:outline-none transition-all duration-300"
                                required
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="React, JavaScript, Frontend..."
                                className="w-full p-3 bg-[#0F3460]/30 rounded-lg border border-[#533483]/30 text-white placeholder-gray-500 focus:border-[#E94560] focus:outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-4 mt-8 bg-gradient-to-r from-[#E94560] to-[#533483] hover:from-[#533483] hover:to-[#E94560] text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E94560]/50"
                    >
                        Create Question
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateQuestionForm;