import React, { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from '../../../context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { diff_match_patch } from 'diff-match-patch';
import defaultCode from './../../../static/default_code.json';
import { useDispatch, useSelector } from "react-redux";
import Ace from "./Ace";
import VideoChat from "./VideoChat";
import { executeCode } from "../../../services/operations/executeCode";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import WhiteBoard from "./WhiteBoard";
import { fetchQuestions } from "../../../services/operations/roomAPI";
import UserList from "./UserList";
import QuestionList from "./QuestionList";
import GeneratePDF from "./GeneratePDF";

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

    useEffect(() => {
        // Fetch questions based on room ID
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
            // toast.success(Overall Feedback: ${feedback});
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
            <div className="room-container">
                <button id="leave-room" className="text-white" onClick={leaveRoom}>Leave Room</button>
                <br></br>
                {user.accountType !== ACCOUNT_TYPE.CANDIDATE && <GeneratePDF roomid={roomid} questions={questions} overallFeedback={overallFeedback} />}
                <UserList inRoomUsers={inRoomUsers} />
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
                <div id="resize-editor" className="resize-editor">
                    <div id="lines-resize" className="lines-resize"></div>
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
                {user.accountType !== ACCOUNT_TYPE.CANDIDATE && <QuestionList questions={questions} handleStarClick={handleStarClick} handleInputChange={handleInputChange} overallFeedback={overallFeedback} newQuestionText={newQuestionText} setNewQuestionText={setNewQuestionText} addQuestion={addQuestion} />}
            </div>
        )
    }
};

export default Room;