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
import { throttle } from 'lodash';

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
        const handleMouseMove = throttle((e) => {
            const x = e.clientX;
            const y = e.clientY;
            socket.emit('update-cursor-position', { roomId: roomid, username: user.firstName, x, y });
        }, 50);

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            handleMouseMove.cancel();
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
            <div className="h-screen bg-gradient-to-br from-[#1A1A2E] to-[#16213E] flex flex-col">
                {/* Enhanced Header */}
                <header className="bg-[#0F3460]/50 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-[#533483]/20">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => leaveRoom(socket, roomid, navigate)}
                            className="group px-5 py-2.5 bg-gradient-to-r from-[#E94560] to-[#533483] hover:from-[#533483] hover:to-[#E94560] text-white rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-[#E94560]/50"
                        >
                            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                            <span className="font-medium">Exit Room</span>
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-white text-xl font-bold">Room: <span className="text-[#E94560]">{roomid}</span></h1>
                            <p className="text-gray-400 text-sm">Connected Users: {inRoomUsers.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        {user.accountType !== ACCOUNT_TYPE.CANDIDATE && (
                            <GeneratePDF
                                roomid={roomid}
                                questions={questions}
                                overallFeedback={overallFeedbackVerdict}
                            />
                        )}
                        <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                            {inRoomUsers.map((user, index) => (
                                <div
                                    key={index}
                                    className="w-10 h-10 rounded-xl border-2 border-[#E94560] overflow-hidden transform hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-[#E94560]/30"
                                    title={user.name}
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Main Content with Glass Effect */}
                <div className="flex flex-1 overflow-hidden p-4 gap-4">
                    {/* Editor Section */}
                    <div className="flex flex-col w-[60%] rounded-xl bg-[#0F3460]/30 backdrop-blur-lg border border-[#533483]/20 shadow-xl">
                        <div className="flex-1 p-2">
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
                    </div>

                    {/* Right Panel */}
                    <div className="flex flex-col w-[40%] rounded-xl bg-[#0F3460]/30 backdrop-blur-lg border border-[#533483]/20 shadow-xl">
                        {/* Enhanced Tabs */}
                        <div className="flex p-2 gap-2">
                            <button
                                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'console'
                                    ? 'bg-[#E94560] text-white shadow-lg shadow-[#E94560]/50'
                                    : 'text-gray-400 hover:bg-[#533483]/20 hover:text-white'
                                    }`}
                                onClick={() => setActiveTab('console')}
                            >
                                Console
                            </button>
                            {user.accountType !== ACCOUNT_TYPE.CANDIDATE && (
                                <button
                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'questions'
                                        ? 'bg-[#E94560] text-white shadow-lg shadow-[#E94560]/50'
                                        : 'text-gray-400 hover:bg-[#533483]/20 hover:text-white'
                                        }`}
                                    onClick={() => setActiveTab('questions')}
                                >
                                    Questions
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-auto p-4">
                            {activeTab === 'console' ? (
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">Input</label>
                                        <textarea
                                            className="w-full h-32 bg-[#1A1A2E] text-white p-4 rounded-lg border border-[#533483]/30 focus:outline-none focus:border-[#E94560] transition-all duration-300 resize-none"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Enter your input here..."
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-400 mb-2 group-hover:text-[#E94560] transition-colors">Output</label>
                                        <textarea
                                            className="w-full h-32 bg-[#1A1A2E] text-white p-4 rounded-lg border border-[#533483]/30 resize-none"
                                            value={output}
                                            readOnly
                                            placeholder="Output will appear here..."
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

                {/* Video Chat and Whiteboard */}
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

                {/* Enhanced Cursor Indicators */}
                {Object.entries(clientCursors)
                    .filter(([username]) => username !== user.firstName)
                    .map(([username, { x, y }]) => (
                        <div
                            key={username}
                            className="absolute pointer-events-none transition-all duration-200"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                transform: 'translate(0, 0)',
                                zIndex: 1000,
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                className="cursor-pointer-icon"
                                style={{
                                    transform: 'translate(-2px, -2px)'
                                }}
                            >
                                <path
                                    fill={generateColor(username)}
                                    d="M3,3L21,21L18,23L0,5L3,3Z"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                            </svg>
                            <span
                                className="absolute left-4 top-0 text-xs font-medium text-white bg-[#0F3460]/75 
                                          px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap"
                            >
                                {username}
                            </span>
                        </div>
                    ))
                }

                <ToastContainer
                    position="bottom-right"
                    autoClose={2000}
                    theme="dark"
                />
            </div>
        );
    }
};

export default Room;