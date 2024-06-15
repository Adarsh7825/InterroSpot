import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from '../../../context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { diff_match_patch } from 'diff-match-patch';
import defaultCode from './../../../static/default_code.json';
import axios from 'axios';
import WhiteBoard from './WhiteBoard';
import { useDispatch, useSelector } from "react-redux";
import Ace from "./Ace";
import VideoChat from "./VideoChat";
import { executeCode } from "../../../services/operations/executeCode";
import StarRatingComponent from 'react-rating-stars-component';
import { FaStar } from "react-icons/fa"
import jsPDF from 'jspdf';
import { ACCOUNT_TYPE } from "../../../utils/constants";

const dmp = new diff_match_patch();

const Room = () => {
    const userVideoRef = useRef(null);
    const { currRoom, socket } = useContext(DataContext);
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [language, setLanguage] = useState(currRoom ? currRoom.language : "javascript");
    let [code, setCode] = useState(currRoom ? currRoom.code : defaultCode[language ? language : "javascript"]);
    const location = useLocation();
    let roomid = location.state?.roomid;
    let name = user ? user.firstName : "";
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [inRoomUsers, setInRoomUsers] = useState([]);
    const [running, setRunning] = useState(false);
    const EditorRef = useRef(null);
    const REACT_APP_BACKEND_URL = 'http://localhost:8181/';
    const [questions, setQuestions] = useState([]);
    const [overallFeedback, setOverallFeedback] = useState(null);
    const [newQuestionText, setNewQuestionText] = useState('');

    function updateRoom(patch) {
        socket.emit('update', { roomid, patch });
    }

    useEffect(() => {
        if (user?.token === null) {
            navigate('/');
        }
        socket.on('connect', () => {
            console.log('Connected');
        });
        if (currRoom) {
            socket.emit('join', {
                name,
                roomid,
                code,
                language,
                token: user?.token,
                input,
                output,
                avatar: user?.avatar
            })
        }

        socket.on('join', (msg, room) => {
            console.log("join gave me this data\n", room, "\n");
            toast(msg, {
                // position: toast.POSITION.TOP_RIGHT
            });

            setCode(room.code);
            setLanguage(room.language);
            setInput(room.input);
            setOutput(room.output);
            setInRoomUsers(room.users);
            socket.off('join');
            console.log(room);
        })

        return () => {
            socket.off('join');
        }
    }, []);

    useEffect(() => {
        const resizeBtn = document.querySelector("#resize-editor");
        resizeBtn?.addEventListener("mousedown", (e) => {
            const startX = e.clientX;
            const initialWidth = document.querySelector("#editor").offsetWidth;
            console.log(initialWidth);
            document.body.addEventListener("mousemove", changeWidth);

            document.body.addEventListener("mouseup", () => {
                document.body.removeEventListener("mousemove", changeWidth);
            })

            document.body.addEventListener("mouseleave", () => {
                document.body.removeEventListener("mousemove", changeWidth);
            })

            function changeWidth(e) {
                const videoChat = document.querySelector(".video-chat");
                const editor = document.querySelector("#editor");
                const finalX = e.clientX;
                let editorWidth = initialWidth + finalX - startX;
                if (editorWidth < window.innerWidth * 0.5) {
                    editorWidth = window.innerWidth * 0.5;
                }
                editor.style.width = editorWidth + "px";
                let videoWidth = window.innerWidth - editorWidth - 50;
                if (videoWidth < window.innerWidth * 0.20)
                    videoWidth = window.innerWidth * 0.20;

                if (videoWidth > window.innerWidth * 0.35)
                    videoChat.classList.add("wide");
                else
                    videoChat.classList.remove("wide");
                videoChat.style.width = videoWidth + "px";

            }

        });
    }, [currRoom]);

    useEffect(() => {
        if (socket.connected) {
            {
                socket.off('userJoin');
                socket.on('userJoin', ({ msg, newUser }) => {
                    const arr = [];
                    arr.push(newUser);
                    for (let user of inRoomUsers) {
                        arr.push(user);
                    }
                    setInRoomUsers(arr);
                    toast.success(msg, {
                        // position: toast.POSITION.TOP_RIGHT
                    })
                })
            }

            {
                socket.off('userLeft');
                socket.on('userLeft', ({ msg, userId }) => {
                    console.log('userLeft', msg)

                    const arr = inRoomUsers.filter(user => user.id !== userId);
                    setInRoomUsers(arr);
                    console.log('userLeft', inRoomUsers);
                    toast.error(msg, {
                        // position: toast.POSITION.TOP_RIGHT
                    })
                })
            }

            {
                socket.off('update');
                socket.on('update', ({ patch }) => {
                    console.log('Received patch:', patch);
                    const currentCode = EditorRef.current.editor.getValue();
                    const [newCode, results] = dmp.patch_apply(patch, currentCode);
                    if (results[0] === true) {
                        const pos = EditorRef.current.editor.getCursorPosition();
                        let oldn = currentCode.split('\n').length;
                        let newn = newCode.split('\n').length;
                        setCode(newCode);
                        const newrow = pos.row + newn - oldn;
                        if (oldn !== newn) {
                            EditorRef.current.editor.gotoLine(newrow, pos.column);
                        }
                        console.log('Patch applied successfully on client. New code:', newCode);
                    } else {
                        console.log('Error applying patch on client');
                        socket.emit('getRoom', { roomid });
                    }
                });
            }
            {
                socket.off('getRoom');
                socket.on('getRoom', ({ room }) => {
                    setCode(room.code);
                    setLanguage(room.language);
                    setInput(room.input);
                    setOutput(room.output);
                    console.log('Received full room data:', room);
                });

            }
            {
                socket.off('updateIO')
                socket.on('updateIO', ({ newinput, newoutput, newlanguage }) => {
                    // update IO
                    console.log('updateIo', newinput, newoutput, newlanguage);
                    setLanguage(newlanguage);
                    setInput(newinput);
                    setOutput(newoutput);
                })
            }
            {
                socket.off('updateOutput');
                socket.on('updateOutput', ({ newOutput }) => {
                    setOutput(newOutput);
                });
            }
            {
                socket.off('error')
                socket.on('error', ({ error }) => {
                    console.log('error from socket call', error)
                })
            }
        }
    }, [socket, roomid]);

    const IOEMIT = (a, b, c) => {
        socket.emit('updateIO', {
            roomid,
            input: a,
            output: b,
            language: c
        })
    }

    const run = async () => {
        try {
            setRunning(true);
            dispatch(executeCode({ code, language, input }, (newOutput) => {
                setOutput(newOutput);
                socket.emit('updateOutput', { roomid, newOutput });
            }));
        } catch (error) {
            console.log(error);
            toast.error("Could not execute code");
        } finally {
            setRunning(false);
        }
    };

    const closeCameraAndMircrophone = () => {
        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject.getAudioTracks()[0].stop();
            userVideoRef.current.srcObject.getVideoTracks()[0].stop();
            userVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
            userVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
        }

    }

    async function leaveRoom() {
        socket.emit('leave', { roomid });
        socket.off();
        navigate('/');
    }

    async function generatePDF() {
        try {
            console.log('Generating PDF...');
            const doc = new jsPDF();

            // Add the candidate photo
            const candidateImg = new Image();
            const candidateResponse = await axios.get(`${REACT_APP_BACKEND_URL}api/v1/captureImage/fetchImage/${roomid}`);
            console.log('Candidate Image URL:', candidateResponse.data.room.imageUrl);
            candidateImg.src = candidateResponse.data.room.imageUrl;

            // Ensure the image is loaded before adding it to the PDF
            await new Promise((resolve) => {
                candidateImg.onload = resolve;
            });

            doc.addImage(candidateImg.src, 'JPEG', 10, 10, 50, 50);

            // Add the interviewer photo
            const interviewerImg = new Image();
            const interviewerResponse = await axios.get(`${REACT_APP_BACKEND_URL}api/v1/captureImage/fetchImage/${roomid}`);
            console.log('Interviewer Image URL:', interviewerResponse.data.room.imageUrlforInterviewer);
            interviewerImg.src = interviewerResponse.data.room.imageUrlforInterviewer;

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

            // Add the final verdict
            if (yOffset + lineHeight > pageHeight - margin) {
                doc.addPage();
                yOffset = margin;
            }
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(`Final Verdict: ${overallFeedback}`, 10, yOffset);

            // Add the interview date and time
            const date = new Date();
            const formattedDate = date.toLocaleDateString();
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Interview Date: ${formattedDate}`, 10, yOffset + lineHeight);

            // Add the candidate name and email
            if (user?.accountType === ACCOUNT_TYPE.CANDIDATE) {
                doc.text(`Candidate Name: ${user.firstName} ${user.lastName}`, 10, yOffset + lineHeight * 2);
                doc.text(`Candidate Email: ${user.email}`, 10, yOffset + lineHeight * 3);
            }
            // Add the position applying for
            const getJobPosition = await axios.get(`${REACT_APP_BACKEND_URL}api/v1/recruiter/getjobposition/${roomid}`)
            console.log(getJobPosition.data)
            doc.text(`Position Applied : ${getJobPosition.data}`, 10, yOffset + lineHeight * 4);

            // Add the interviewer name and email and Jobposition
            if (user?.accountType !== ACCOUNT_TYPE.CANDIDATE) {
                doc.text(`Interviewer Name: ${user.firstName}`, 10, yOffset + lineHeight * 5);
                doc.text(`Interviewer Email: ${user.email}`, 10, yOffset + lineHeight * 6);
            }

            // Add the openplayback
            doc.text(`Openplayback: link`, 10, yOffset + lineHeight * 8);

            // Save the PDF
            doc.save('assessment.pdf');
            console.log('PDF saved');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error generating PDF');
        }
    }

    useEffect(() => {
        // Fetch questions based on room ID
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${REACT_APP_BACKEND_URL}api/v1/question/getQuestions/${roomid}`);
                console.log('Questions:', response.data[0].text)
                console.log('Questions:', response.data[0].mainCategory)
                console.log('Questions:', response.data[0].subCategory)
                console.log('Questions:', response.data[0].difficulty)
                console.log('Questions:', response.data[0].tags)
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
                toast.error('Error fetching questions');
            }
        };

        fetchQuestions();
    }, [roomid]);

    const handleStarClick = (nextValue, prevValue, name) => {
        const updatedQuestions = questions.map((question, index) => {
            if (index === parseInt(name)) {
                return { ...question, feedback: nextValue };
            }
            return question;
        });
        setQuestions(updatedQuestions);
    };

    const handleInputChange = (index, field, value) => {
        const updatedQuestions = questions.map((question, i) => {
            if (i === index) {
                return { ...question, [field]: value };
            }
            return question;
        });
        setQuestions(updatedQuestions);
    };

    const calculateOverallFeedback = (questions) => {
        let totalRating = 0;
        let ratedQuestions = 0;

        questions.forEach(question => {
            if (question.feedback !== undefined && question.feedback !== null) {
                totalRating += question.feedback;
                ratedQuestions++;
            }
        });

        if (ratedQuestions === 0) {
            return 'no_feedback';
        }

        const averageRating = totalRating / ratedQuestions;

        if (averageRating >= 8) {
            return 'strong_yes';
        } else if (averageRating >= 6) {
            return 'yes';
        } else if (averageRating >= 4) {
            return 'no';
        } else {
            return 'strong_no';
        }
    };

    useEffect(() => {
        const allRated = questions.every(question => question.feedback !== null);
        if (allRated) {
            const feedback = calculateOverallFeedback(questions);
            setOverallFeedback(feedback);
            // toast.success(`Overall Feedback: ${feedback}`);
        }
    }, [questions]);

    const addQuestion = () => {
        if (newQuestionText.trim() !== '') {
            setQuestions([...questions, { text: newQuestionText, feedback: null, strength: '', improvement: '' }]);
            setNewQuestionText('');
        } else {
            toast.error('Question text cannot be empty');
        }
    };

    console.log(user);

    if (user.rooms && user) {
        return (
            <div style={{ color: 'white', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                <button id="leave-room" onClick={leaveRoom}>Leave Room</button>
                {user.accountType !== ACCOUNT_TYPE.CANDIDATE && <button id="generate-pdf" onClick={generatePDF}>Generate PDF</button>}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', gap: '2rem' }}>
                    {inRoomUsers.map((user) => (
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} key={user.id}>
                            <img src={user.avatar} alt="" style={{ borderRadius: '50%', width: '40px', height: '40px' }} />
                            <div style={{
                                position: 'absolute',
                                left: '100%',
                                marginLeft: '0.5rem',
                                padding: '0.25rem',
                                backgroundColor: '#fff',
                                color: '#000',
                                borderRadius: '5px',
                                opacity: 0,
                                transition: 'opacity 0.3s ease-in-out'
                            }}>{user.firstName}</div>
                        </div>
                    ))}
                </div>
                <Ace
                    updateRoom={updateRoom}
                    code={code}
                    setCode={setCode}
                    language={language}
                    setLanguage={setLanguage}
                    roomid={roomid}
                    EditorRef={EditorRef}
                    input={input}
                    setInput={setInput}
                    output={output}
                    setOutput={setOutput}
                    IOEMIT={IOEMIT}
                    run={run}
                    running={running}
                />
                <div id="resize-editor" style={{
                    width: '15px',
                    height: '100%',
                    backgroundColor: 'rgb(146, 228, 255)',
                    float: 'right',
                    cursor: 'col-resize',
                    transition: 'all 0.1s linear',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '5px 0 10px rgba(0, 0, 0, 0.5)'
                }}>
                    <div id="lines-resize" style={{
                        height: '25px',
                        backgroundColor: 'black',
                        width: '1px',
                        position: 'relative'
                    }}>
                        <div style={{
                            content: '""',
                            height: '100%',
                            width: '100%',
                            position: 'absolute',
                            left: '300%',
                            top: 0,
                            backgroundColor: 'black'
                        }}></div>
                        <div style={{
                            content: '""',
                            height: '100%',
                            width: '100%',
                            position: 'absolute',
                            left: '-300%',
                            top: 0,
                            backgroundColor: 'black'
                        }}></div>
                    </div>
                </div>
                <VideoChat
                    socket={socket}
                    roomid={roomid}
                    user={user}
                    userVideo={userVideoRef}
                    closeIt={closeCameraAndMircrophone}
                />
                <WhiteBoard roomId={roomid} socket={socket} />
                <ToastContainer autoClose={2000} />
                {user.accountType !== ACCOUNT_TYPE.CANDIDATE && <div style={{ color: 'white', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                    <h2>Questions</h2>
                    {questions.map((question, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
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
                                    style={{ padding: '0.5rem', width: '80%' }}
                                />
                            </div>
                            <div>
                                <label>Ease of Improvement:</label>
                                <input
                                    type="text"
                                    value={question.improvement || ''}
                                    onChange={(e) => handleInputChange(index, 'improvement', e.target.value)}
                                    placeholder="Enter ease of improvement"
                                    style={{ padding: '0.5rem', width: '80%' }}
                                />
                            </div>
                        </div>
                    ))}
                    {overallFeedback && (
                        <div>
                            <h3>Overall Feedback: {overallFeedback}</h3>
                        </div>
                    )}
                    <div style={{ marginTop: '2rem' }}>
                        <input
                            type="text"
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            placeholder="Enter new question"
                            style={{ padding: '0.5rem', width: '80%' }}
                        />
                        <button onClick={addQuestion} className="">Add Question</button>
                    </div>
                </div>}
            </div>
        )
    }
};

export default Room;