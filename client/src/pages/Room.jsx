import React, { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from '../context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import Ace from "../components/core/Room/Ace";
import defaultCode from '../static/default_code.json';
import VideoChat from "../components/core/Room/VideoChat";
import { executeCode } from "../services/operations/executeCode";
import { ACCOUNT_TYPE } from "../utils/constants";
import WhiteBoard from "../components/core/Room/WhiteBoard";
import { fetchQuestions } from "../services/operations/roomAPI";
import QuestionList from "../components/core/Room/QuestionList";
import GeneratePDF from "../components/core/Room/GeneratePDF";
import { setupSocketHandlers, leaveRoom } from "../components/core/Room/SocketHandlers";

const Room = () => {
    const userVideoRef = useRef(null);
    const { currRoom, socket } = useContext(DataContext);
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [language, setLanguage] = useState(currRoom ? currRoom.language : "javascript");
    let [code, setCode] = useState(currRoom ? currRoom.code : defaultCode[language ? language : "javascript"].snippet);
    const location = useLocation();
    let roomid = location.state?.roomid;
    let name = user ? user.firstName : "";
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [inRoomUsers, setInRoomUsers] = useState([]);
    const [running, setRunning] = useState(false);
    const EditorRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [overallFeedback, setOverallFeedback] = useState(null);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [activeTab, setActiveTab] = useState('console');
    const [clientCursors, setClientCursors] = useState({});

    useEffect(() => {
        if (user?.token === null) {
            navigate('/');
        }
        setupSocketHandlers(socket, {
            name,
            roomid,
            code,
            language,
            token: user?.token,
            input,
            output,
            avatar: user?.avatar,
            setCode,
            setLanguage,
            setInput,
            setOutput,
            setInRoomUsers,
            EditorRef,
            inRoomUsers,
            setQuestions,
            setOverallFeedback,
            toast,
        });

        socket.on("openWhiteBoard", () => {
            document.querySelector("#white-board").classList.add("active");
            document.querySelector("#leave-room").classList.add("active");
        });

        socket.on('update-cursor-position', ({ cursors }) => {
            setClientCursors(cursors);
        });

        return () => {
            socket.off();
        }
    }, []);

    useEffect(() => {
        const fetchQuestionsData = async () => {
            try {
                const questionsData = await fetchQuestions(roomid);
                setQuestions(questionsData);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestionsData();
    }, [roomid]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            socket.emit('update-cursor-position', { roomId: roomid, username: user.firstName, x, y });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [socket, roomid, user.firstName]);

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

    const addQuestion = () => {
        if (newQuestionText.trim() !== '') {
            setQuestions([...questions, { text: newQuestionText, feedback: null, strength: '', improvement: '' }]);
            setNewQuestionText('');
        } else {
            toast.error('Question text cannot be empty');
        }
    };

    const handleMouseDown = (e) => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const editor = document.getElementById('editor');
        const console = document.getElementById('console');
        const newWidth = e.clientX - editor.getBoundingClientRect().left;
        editor.style.width = `${newWidth}px`;
        console.style.width = `calc(100% - ${newWidth}px)`;
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleInputChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleStarClick = (index, nextValue) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].feedback = nextValue;
        setQuestions(updatedQuestions);
    };

    const generateColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();

        return `#${'00000'.substring(0, 6 - c.length)}${c}`;
    };

    const calculateOverallFeedback = () => {
        if (questions.length === 0) return null;
        const totalFeedback = questions.reduce((acc, question) => acc + (question.feedback || 0), 0);
        const averageFeedback = totalFeedback / questions.length;

        if (averageFeedback >= 8) return "Strong Yes";
        if (averageFeedback >= 6) return "Yes";
        if (averageFeedback >= 4) return "No";
        return "Strong No";
    };

    const overallFeedbackVerdict = calculateOverallFeedback();

    if (user.rooms && user) {
        return (
            <div className="flex flex-col h-screen">
                <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
                    <button id="leave-room" className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 hover:from-blue-500 hover:via-purple-600 hover:to-pink-700 text-white font-bold rounded" onClick={() => leaveRoom(socket, roomid, navigate)}>🚪 Leave Room</button>
                    {user.accountType !== ACCOUNT_TYPE.CANDIDATE && <GeneratePDF roomid={roomid} questions={questions} overallFeedback={overallFeedbackVerdict} />}
                </div>
                <div className="flex flex-grow">
                    <div id="editor" className="w-1/3 border-r border-gray-700">
                        <Ace
                            updateRoom={(patch) => socket.emit('update', { roomid, patch })}
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
                            IOEMIT={(a, b, c) => socket.emit('updateIO', { roomid, input: a, output: b, language: c })}
                            run={run}
                            running={running}
                        />
                    </div>
                    <div
                        id="resize-editor"
                        className="w-1 bg-gray-700 cursor-col-resize"
                        onMouseDown={handleMouseDown}
                    ></div>
                    <div id="console" className="w-2/3 flex flex-col">
                        <div className="flex justify-between bg-gray-800 text-white">
                            <button className="flex-1 p-2" onClick={() => setActiveTab('console')}>Console</button>
                            {user.accountType !== ACCOUNT_TYPE.CANDIDATE && (
                                <button className="flex-1 p-2" onClick={() => setActiveTab('questions')}>Questions</button>
                            )}
                        </div>
                        <div className="flex-grow overflow-auto">
                            {activeTab === 'console' ? (
                                <div className="p-4">
                                    <div className="input mb-4">
                                        <h5 className="text-white">Input</h5>
                                        <textarea
                                            className="w-full h-32 p-2 bg-gray-900"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="output">
                                        <h5 className="text-white">Output</h5>
                                        <textarea
                                            className="w-full h-32 p-2 bg-gray-900"
                                            value={output}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            ) : (
                                <QuestionList
                                    questions={questions}
                                    handleStarClick={handleStarClick}
                                    handleInputChange={handleInputChange}
                                    overallFeedback={overallFeedback}
                                    newQuestionText={newQuestionText}
                                    setNewQuestionText={setNewQuestionText}
                                    addQuestion={addQuestion}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <VideoChat
                    socket={socket}
                    roomid={roomid}
                    user={user}
                    userVideo={userVideoRef}
                    closeIt={() => {
                        if (userVideoRef.current.srcObject) {
                            userVideoRef.current.srcObject.getAudioTracks()[0].stop();
                            userVideoRef.current.srcObject.getVideoTracks()[0].stop();
                            userVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
                            userVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
                        }
                    }}
                />
                <WhiteBoard roomId={roomid} socket={socket} />
                <ToastContainer autoClose={2000} />
                {Object.entries(clientCursors).map(([username, { x, y }]) => (
                    <div
                        key={username}
                        className="w-4 h-4 absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer border-2 border-white"
                        style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            backgroundColor: generateColor(username),
                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                            pointerEvents: 'none',
                        }}
                    >
                        <span className="text-[#ff9f1c] m-3 text-xs font-semibold">{username}</span>
                    </div>
                ))}
            </div>
        )
    }
};

export default Room;