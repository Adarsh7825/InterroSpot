import React from 'react';
import jsPDF from 'jspdf';
import { fetchCandidateImage, fetchInterviewerImage, fetchJobPosition } from "../../../services/operations/roomAPI";
import { toast } from 'react-toastify';

const GeneratePDF = ({ roomid, questions, overallFeedback }) => {
    const generatePDF = async () => {
        try {
            console.log('Generating PDF...');
            const doc = new jsPDF();

            // Add the candidate photo
            const candidateImg = new Image();
            const candidateImageUrl = await fetchCandidateImage(roomid);
            candidateImg.src = candidateImageUrl;

            // Ensure the image is loaded before adding it to the PDF
            await new Promise((resolve) => {
                candidateImg.onload = resolve;
            });

            doc.addImage(candidateImg.src, 'JPEG', 10, 10, 50, 50);

            // Add the interviewer photo
            const interviewerImg = new Image();
            const interviewerImageUrl = await fetchInterviewerImage(roomid);
            interviewerImg.src = interviewerImageUrl;

            // Ensure the image is loaded before adding it to the PDF
            await new Promise((resolve) => {
                interviewerImg.onload = resolve;
            });

            doc.addImage(interviewerImg.src, 'JPEG', 70, 10, 50, 50); // Adjust coordinates to avoid overlap

            // Add the questions and ratings
            let yOffset = 70;
            const pageHeight = doc.internal.pageSize.height;
            const lineHeight = 10;
            const margin = 10;

            questions.forEach((question, index) => {
                if (yOffset + lineHeight * 4 > pageHeight - margin) {
                    doc.addPage();
                    yOffset = margin;
                }
                doc.text(`Question ${index + 1}: ${question.text}`, 10, yOffset);
                yOffset += lineHeight;
                doc.text(`Rating: ${question.feedback}`, 10, yOffset);
                yOffset += lineHeight;
                doc.text(`Strength: ${question.strength}`, 10, yOffset);
                yOffset += lineHeight;
                doc.text(`Ease of Improvement: ${question.improvement}`, 10, yOffset);
                yOffset += lineHeight * 2;
            });

            // Add overall feedback
            if (overallFeedback) {
                if (yOffset + lineHeight > pageHeight - margin) {
                    doc.addPage();
                    yOffset = margin;
                }
                doc.text(`Overall Feedback: ${overallFeedback}`, 10, yOffset);
            }

            // Save the PDF
            doc.save('interview_feedback.pdf');
            toast.success('PDF generated successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF');
        }
    };

    return (
        <button onClick={generatePDF} className="text-white">
            Generate PDF
        </button>
    );
};

export default GeneratePDF;