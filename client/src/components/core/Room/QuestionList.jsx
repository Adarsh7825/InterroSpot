import React from 'react';
import StarRatingComponent from 'react-rating-stars-component';

const QuestionList = ({ questions, handleStarClick, handleInputChange, overallFeedback, newQuestionText, setNewQuestionText, addQuestion }) => {
    return (
        <div className="text-white">
            <h2>Questions</h2>
            {questions.map((question, index) => (
                <div key={index} className="question-item">
                    <h3>{question.text}</h3>
                    <StarRatingComponent
                        name={`${index}`}
                        starCount={10}
                        value={question.feedback || 0}
                        onStarClick={handleStarClick}
                    />
                    <div>
                        <label>Strength:</label>
                        <input
                            type="text"
                            value={question.strength || ''}
                            onChange={(e) => handleInputChange(index, 'strength', e.target.value)}
                            placeholder="Enter strength"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label>Ease of Improvement:</label>
                        <input
                            type="text"
                            value={question.improvement || ''}
                            onChange={(e) => handleInputChange(index, 'improvement', e.target.value)}
                            placeholder="Enter ease of improvement"
                            className="input-field"
                        />
                    </div>
                </div>
            ))}
            {overallFeedback && (
                <div>
                    <h3>Overall Feedback: {overallFeedback}</h3>
                </div>
            )}
            <div className="add-question">
                <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Enter new question"
                    className="input-field"
                />
                <button onClick={addQuestion} className="add-question-button">Add Question</button>
            </div>
        </div>
    );
};

export default QuestionList;