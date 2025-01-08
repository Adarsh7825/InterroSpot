import React from 'react';
import ReactStars from 'react-rating-stars-component';

const QuestionList = ({ questions, handleStarClick, handleInputChange, newQuestionText, setNewQuestionText, addQuestion }) => {
    return (
        <div className="question-list text-white p-4 h-full overflow-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E94560] to-[#533483] text-transparent bg-clip-text">
                    Interview Questions
                </h2>
                <span className="text-sm text-gray-400">{questions.length} Questions</span>
            </div>

            <div className="space-y-6">
                {questions.map((question, index) => (
                    <div
                        key={index}
                        className="question-item p-4 bg-[#1A1A2E] rounded-xl border border-[#533483]/20 shadow-lg hover:border-[#E94560]/50 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-white/90">{question.text}</h3>
                            <span className="px-2 py-1 text-xs rounded-full bg-[#E94560]/20 text-[#E94560]">
                                Q{index + 1}
                            </span>
                        </div>

                        <div className="mb-4">
                            <ReactStars
                                count={10}
                                value={question.feedback || 0}
                                onChange={(nextValue) => handleStarClick(index, nextValue)}
                                size={20}
                                activeColor="#E94560"
                                color="#533483"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">
                                    Strengths
                                </label>
                                <input
                                    type="text"
                                    value={question.strength || ''}
                                    onChange={(e) => handleInputChange(index, 'strength', e.target.value)}
                                    placeholder="What went well?"
                                    className="w-full p-3 bg-[#0F3460]/30 rounded-lg border border-[#533483]/30 text-white placeholder-gray-500 focus:border-[#E94560] focus:outline-none transition-all duration-300"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">
                                    Areas for Improvement
                                </label>
                                <input
                                    type="text"
                                    value={question.improvement || ''}
                                    onChange={(e) => handleInputChange(index, 'improvement', e.target.value)}
                                    placeholder="What could be better?"
                                    className="w-full p-3 bg-[#0F3460]/30 rounded-lg border border-[#533483]/30 text-white placeholder-gray-500 focus:border-[#E94560] focus:outline-none transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-question mt-8 p-4 bg-[#1A1A2E] rounded-xl border border-[#533483]/20">
                <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full p-3 mb-4 bg-[#0F3460]/30 rounded-lg border border-[#533483]/30 text-white placeholder-gray-500 focus:border-[#E94560] focus:outline-none transition-all duration-300"
                />
                <button
                    onClick={addQuestion}
                    className="w-full p-3 bg-gradient-to-r from-[#E94560] to-[#533483] hover:from-[#533483] hover:to-[#E94560] text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E94560]/50"
                >
                    Add New Question
                </button>
            </div>
        </div>
    );
};

export default QuestionList;