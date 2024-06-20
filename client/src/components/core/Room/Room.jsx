import React, { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from '../../../context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import Ace from "./Ace";
import defaultCode from '../../../static/default_code.json';
import VideoChat from "./VideoChat";
import { executeCode } from "../../../services/operations/executeCode";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import WhiteBoard from "./WhiteBoard";
import { fetchQuestions } from "../../../services/operations/roomAPI";
import UserList from "./UserList";
import QuestionList from "./QuestionList";
import GeneratePDF from "./GeneratePDF";
import { setupSocketHandlers, leaveRoom } from "./SocketHandlers";

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

    if (user.rooms && user) {
        return (
            <div className="room-container">
                <button id="leave-room" className="text-white" onClick={() => leaveRoom(socket, roomid, navigate)}>Leave Room</button>
                <br></br>
                {user.accountType !== ACCOUNT_TYPE.CANDIDATE && <GeneratePDF roomid={roomid} questions={questions} overallFeedback={overallFeedback} />}
                <UserList inRoomUsers={inRoomUsers} />
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
                <div id="resize-editor" className="resize-editor">
                    <div id="lines-resize" className="lines-resize"></div>
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
                {user.accountType !== ACCOUNT_TYPE.CANDIDATE && <QuestionList questions={questions} setQuestions={setQuestions} overallFeedback={overallFeedback} newQuestionText={newQuestionText} setNewQuestionText={setNewQuestionText} addQuestion={addQuestion} />}
            </div>
        )
    }
};

export default Room;