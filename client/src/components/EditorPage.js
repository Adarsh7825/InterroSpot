// import React, { useEffect, useRef, useState, useCallback } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import axios from 'axios';
// import { initSocket } from "../Socket";
// import { ACTIONS } from "../Actions";
// import {
//   useNavigate,
//   useLocation,
//   Navigate,
//   useParams,
// } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import CursorTracker from "./CurosrTracker";
// import ReactPlayer from "react-player";
// import peer from "../peer";

// function EditorPage() {
//   const [clients, setClients] = useState([]);

//   const [output, setOutput] = useState("");
//   const [inputRadio, setInputRadio] = useState(false);
//   const [lang, setLang] = useState("C");
//   const [input, setInput] = useState("");
//   const [code, setCode] = useState("");
//   const [incomingTime, setIncomingTime] = useState(null);
//   const [outgoingTime, setOutgoingTime] = useState(null);
//   const [cursor, setcusror] = useState([]);
//   const codeRef = useRef(null);
//   const Location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);
//   const peers = {};

//   const [myStream, setMyStream] = useState();
//   const [remoteStream, setRemoteStream] = useState();
//   // console.log("THESE ARE CLIENTS",clients)

//   useEffect(() => {
//     const init = async () => {
//       try {
//         socketRef.current = await initSocket();
//         socketRef.current.on("connect_error", (err) => handleErrors(err));
//         socketRef.current.on("connect_failed", (err) => handleErrors(err));

//         socketRef.current.emit(ACTIONS.JOIN, {
//           roomId,
//           username: Location.state?.username,
//         });

//         // Listen for new clients joining the chatroom
//         socketRef.current.on(
//           ACTIONS.JOINED,
//           ({ clients, username, socketId }) => {
//             // this insure that new user connected message do not display to that user itself
//             if (username !== Location.state?.username) {
//             }
//              setClients(clients);

//             setIncomingTime(new Date().toLocaleTimeString());

//             toast.success(`${username} joined the room at ${new Date().toLocaleTimeString()}`);

//             // toast.success(`${username} joined the room.`);

//             // also send the code to sync
//             socketRef.current.emit(ACTIONS.SYNC_CODE, {
//               code: codeRef.current,
//               socketId,
//             });
//             setTimeout(() => {
//               // console.log(codeRef.current);
//             }, 2000);
//           }
//         );

//         socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//           // console.log("LOGGING SOCKET ID ",socketId)
//           setOutgoingTime(new Date().toLocaleTimeString());

//           toast.success(`${username} Left the room at ${new Date().toLocaleTimeString()}`);
//           setClients((prev) => {
//             return prev.filter((client) => client.socketId !== socketId);
//           });
//         });

//         socketRef.current.on(ACTIONS.JOINED, handleJoined);
//         socketRef.current.on(ACTIONS.DISCONNECTED, handleDisconnected);
//       } catch (error) {
//         handleErrors(error);
//       }
//     };
//     init();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current.off(ACTIONS.JOINED, handleJoined);
//         socketRef.current.off(ACTIONS.DISCONNECTED, handleDisconnected);
//       }
//     };
//   }, []);

//   const handleErrors = (err) => {
//     console.log("Error", err);
//     toast.error("Socket connection failed, Try again later");
//     navigate("/home");
//   };

//   const handleJoined = ({ clients, username, socketId }) => {
//     if (username !== Location.state?.username) {
//       // this insure that new user connected message do not display to that user itself
//       setClients(clients);
//       setIncomingTime(new Date().toLocaleTimeString());

//       toast.success(`${username} joined the room at ${new Date().toLocaleTimeString()}`);

//       socketRef.current.emit(ACTIONS.SYNC_CODE, {
//         code: codeRef.current,
//         socketId,
//       });
//     }
//   };

//   const handleDisconnected = ({ socketId, username }) => {
//     setOutgoingTime(new Date().toLocaleTimeString());

//     toast.success(`${username} Left the room at ${new Date().toLocaleTimeString()}`);
//     setClients((prev) => prev.filter((client) => client.socketId !== socketId));
//   };

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success(`roomId is copied`);
//     } catch (error) {
//       console.log(error);
//       toast.error("unable to copy the room Id");
//     }
//   };

//   const runCode = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(`http://localhost:5000/editor/${roomId}`, {
//         code: codeRef.current,
//         input: input,
//         inputRadio: inputRadio,
//         lang: lang,
//       });

//       if (response.status === 200) {
//         const result = response.data;
//         setOutput(result.output);
//         console.log(result.compiledCode); // This will log the compiled code from the server

//       } else {
//         console.error("Error:", response.status, response.statusText);
//         setOutput("Error occurred while running the code.");
//       }
//     } catch (error) {
//       console.error("Error:", error.message);
//       setOutput("Error occurred while running the code.");
//     }
//   };


// const handleCallUser = useCallback(async () => {
//   const stream = await navigator.mediaDevices.getUserMedia({
//     audio: true,
//     video: true,
//   });

//   const offer = await peer.getOffer();
//   console.log("sending an offer", offer);

//   // Filter out the socket ID of the current user
//   const otherClients = clients.filter((client) => client.socketId !== socketRef.current.id);

//   // Iterate over each client and emit the offer to their socket ID
//   otherClients.forEach((client) => {
//     console.log("from handleCallUser function",client)
//     socketRef.current.emit("user:call", { to: client.socketId, offer });
//   });

//   setMyStream(stream);
// }, [clients]); 

//  const handleIncommingCall = async ({ from, offer }) => {
//   console.log(`Incoming call from ${from}.`);
//   const acceptCall =  window.confirm(`Incoming call from ${from}. Do you want to accept?`);
//  if (acceptCall) {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         setMyStream(stream);

//         const answer = await peer.getAnswer(offer);
//         console.log(`This is the answer: ${answer}`);

//         socketRef.current.emit("call:accepted", { to: from, ans: answer });
//     } catch (error) {
//         console.error('Error accessing media devices:', error);
//     }
// }

// };

// const sendStreams = useCallback(() => {
//   if (myStream) {
//     for (const track of myStream.getTracks()) {
//       // Add each track to the peer connection
//       peer.peer.addTrack(track, myStream);
//     }
//   }
// }, [myStream, peer]);

//  const handleCallAccepted = useCallback(
//     ({ from, ans }) => {
//       peer.setLocalDescription(ans);
//       console.log("Call Accepted!");
//       sendStreams();
//     },
//     [sendStreams]
//   );

//   const handleNegoNeeded = useCallback(async () => {
//     const offer = await peer.getOffer();
//       const otherClients = clients.filter((client) => client.socketId !== socketRef.current.id);

//   // Iterate over each client and emit the offer to their socket ID
//   otherClients.forEach((client) => {
//     console.log("from handleCallUser function",client)
//     socketRef.current.emit("peer:nego:needed", { to: client.socketId, offer });
//   });

//   }, [clients]);

//   useEffect(() => {
//     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     return () => {
//       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//     };
//   }, [handleNegoNeeded]);

//  const handleNegoNeedIncomming = useCallback(
//     async ({ from, offer }) => {
//       const ans = await peer.getAnswer(offer);
//       socketRef.current.emit("peer:nego:done", { to: from, ans });
//     },
//     [socketRef]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await peer.setLocalDescription(ans);
//   }, []);

//   useEffect(() => {
//     peer.peer.addEventListener("track", async (ev) => {
//       const remoteStream = ev.streams;
//       console.log("GOT TRACKS!!");
//       setRemoteStream(remoteStream[0]);
//     });
//   }, []);

//   useEffect(() => {
// socketRef.current && socketRef.current.on("incoming:call", ({ from, offer }) => {
//   handleIncommingCall({ from, offer });
// });
//     //  socketRef.current &&   socketRef.current.on("user:joined", handleUserJoined);

//     socketRef.current && socketRef.current.on("call:accepted", handleCallAccepted);
//     socketRef.current && socketRef.current.on("peer:nego:needed", handleNegoNeedIncomming);
//     socketRef.current && socketRef.current.on("peer:nego:final", handleNegoNeedFinal);

//     return () => {
//       socketRef.current && socketRef.current.off("incomming:call", handleIncommingCall);
//       socketRef.current && socketRef.current.off("call:accepted", handleCallAccepted);
//       socketRef.current && socketRef.current.off("peer:nego:needed", handleNegoNeedIncomming);
//       socketRef.current && socketRef.current.off("peer:nego:final", handleNegoNeedFinal);
//     };
//   }, [
//     handleIncommingCall,
//     handleCallAccepted,
//     handleNegoNeedIncomming,
//     handleNegoNeedFinal,
//   ]);

//   // useEffect(() => {
//   //   peer.peer.addEventListener("track", async (ev) => {
//   //     const remoteStream = ev.streams;
//   //     console.log("GOT TRACKS!!");
//   //     setRemoteStream(remoteStream[0]);
//   //   });
//   // }, []);
//   const leaveRoom = async () => {
//     navigate("/login");
//     toast.success(`Left the room`)
//   };
//   return (
//     <div className="flex bg-[#3e4444]">

//       <div className="flex flex-col bg-gray-100 text-gray-900">
//         <aside className="flex h-screen w-[6rem] flex-col items-center border-r border-gray-200"
//         >

//           <div className="flex h-[4.5rem] w-full items-center justify-center border-b border-gray-200 p-2">
//             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqVxAUItmoFJCdGEBVkPdROrk9JdJ6wUAcxQ&usqp=CAU" alt="Logo" className="h-12 w-13" />
//           </div>
//           <nav className="flex flex-1 flex-col gap-y-4 pt-10">
//             <a href="#" className="group relative rounded-xl bg-gray-100 p-2 text-blue-600 hover:bg-gray-50">
//               <svg className="h-6 w-6 stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M12 9V15M9 12H15H9Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//               <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
//                 <div className="relative whitespace-nowrap rounded-md z-50 bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
//                   <div className="absolute inset-0 -left-1 flex items-center">
//                     <div className="h-2 w-2 rotate-45 bg-white"></div>
//                   </div>
//                   Layouts <span className="text-gray-400">(Y)</span>
//                 </div>
//               </div>
//             </a>

//             <a href="#" className="text-gary-400 group relative rounded-xl p-2 hover:bg-gray-50">
//               <svg width="24" height="24" className="h-6 w-6 stroke-current group-hover:text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C14.3869 3 16.6761 3.84285 18.364 5.34315C20.0518 6.84344 21 8.87827 21 11C21 12.0609 20.5259 13.0783 19.682 13.8284C18.8381 14.5786 17.6935 15 16.5 15H14C13.5539 14.9928 13.1181 15.135 12.7621 15.404C12.4061 15.673 12.1503 16.0533 12.0353 16.4844C11.9203 16.9155 11.9528 17.3727 12.1276 17.7833C12.3025 18.1938 12.6095 18.5341 13 18.75C13.1997 18.9342 13.3366 19.1764 13.3915 19.4425C13.4465 19.7085 13.4167 19.9851 13.3064 20.2334C13.196 20.4816 13.0107 20.6891 12.7764 20.8266C12.5421 20.9641 12.2705 21.0247 12 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M7.5 11C7.77614 11 8 10.7761 8 10.5C8 10.2239 7.77614 10 7.5 10C7.22386 10 7 10.2239 7 10.5C7 10.7761 7.22386 11 7.5 11Z" fill="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M12 8C12.2761 8 12.5 7.77614 12.5 7.5C12.5 7.22386 12.2761 7 12 7C11.7239 7 11.5 7.22386 11.5 7.5C11.5 7.77614 11.7239 8 12 8Z" fill="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M16.5 11C16.7761 11 17 10.7761 17 10.5C17 10.2239 16.7761 10 16.5 10C16.2239 10 16 10.2239 16 10.5C16 10.7761 16.2239 11 16.5 11Z" fill="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>

//               <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
//                 <div className="relative whitespace-nowrap z-50 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
//                   <div className="absolute  inset-0 -left-1  flex items-center">
//                     <div className="h-2 w-2 rotate-45 bg-white"></div>
//                   </div>
//                   Color Scheme <span className="text-black">(Y)</span>
//                 </div>
//               </div>

//             </a>

//           </nav>
//           <div className="mt-6 ">
//             <h3 className="font-medium text-lg  mt-2  text-center">Connected</h3>
//             <div className=" p-[2rem]">
//               {clients.map((client) => (
//                 <Client
//                   key={client.socketId}
//                   username={client.username}
//                   incomingTime={incomingTime}
//                   outgoingTime={outgoingTime}
//                 />
//               ))}

//             </div>
//           </div>
//           {/* <button onClick={() => startCall()}>Start Video Call</button> */}

//           <button className="relative group overflow-hidden bg-[#3481ff] px-8 mb-10 h-12 flex space-x-2 items-center ">
//             <span className="relative text-sm w-[4rem]  text-white" onClick={copyRoomId}>
//               Copy RoomId
//             </span>
//           </button>
//           <button className="relative group px-8 h-14 mb-6 bg-red-500 before:absolute before:inset-0 before:bg-red-700 before:scale-x-0 before:origin-right before:transition before:duration-300 hover:before:scale-x-100 hover:before:origin-left">
//             <span className="relative text-sm w-[8rem] text-white" onClick={leaveRoom}>
//               LEAVE
//             </span>
//           </button>
//         </aside>
//       </div>

//       {/* Editor panel */}
//       <div className="flex flex-1">
//         <CursorTracker roomId={roomId} socketRef={socketRef}
//           username={Location.state?.username}
//           clients={clients} // Pass the clients state to CursorTracker

//         />
//         <Editor
//           socketRef={socketRef}
//           username={Location.state?.username}
//           clients={clients} // Pass the clients state to CursorTracker

//           roomId={roomId}
//           onCodeChange={(code) => {
//             codeRef.current = code;
//           }}

//         />

//         <form
//           className="flex flex-col w-1/2 p-4 bg-gray-100 rounded-tl-lg	rounded-bl-lg"
//           onSubmit={(e) => {
//             e.preventDefault(); // Prevent the default form submission
//             runCode(e); // Call your runCode function manually
//           }}
//         >
//           <div className="flex flex-row items-center  mt-4 gap-x-2">
//             <h6 className="">INPUT FOR CODE</h6>
//             <input
//               type="radio"
//               name="inputRadio"
//               id="inputRadioYes"
//               checked={inputRadio}
//               onChange={() => setInputRadio(true)}
//             />
//             <label htmlFor="inputRadioYes" className="text-sm ">
//               Yes
//             </label>

//             <input
//               type="radio"
//               name="inputRadio"
//               id="inputRadioNo"
//               checked={!inputRadio}
//               onChange={() => setInputRadio(false)}
//             />
//             <label htmlFor="inputRadioNo" className="text-sm ">
//               No
//             </label>
//             <h6>SELECT LANGUAGE</h6>
//             <select
//               className="custom-select"
//               value={lang}
//               onChange={(e) => setLang(e.target.value)}
//               style={{ appearance: "none", paddingRight: "1rem" }}
//             >
//               <option value="C">C</option>
//               <option value="C++">C++</option>
//               <option value="Python">Python</option>
//               <option value="JavaScript">JavaScript</option>


//             </select>
//           </div>
//           <br />
//           <textarea
//             id="input"
//             value={input}  // Use value instead of defaultValue
//             onChange={(e) => setInput(e.target.value)}  // Update the input state on change
//             name="code"
//             className="w-full h-1/2 bg-gray-800 text-white p-2 mt-4 rounded-lg"
//             placeholder="Input for your code"
//           ></textarea>


//           <button
//             type="submit" // Use type="submit" for the button inside a form
//             className="w-full mt-4 bg-[#3481ff] px-4 py-2 text-white"
//           >
//             Run Code
//           </button>
//           <textarea
//             className="w-full h-1/2 mt-4 bg-gray-800 text-white text-xl p-2 rounded-lg"
//             placeholder="Output will be displayed here..."
//             value={output}
//             readOnly
//           ></textarea>

//         </form>

//       </div>
//       <div className="bg-white">
//         <h4>{setClients ? "Connected" : "No one in room"}</h4>
//         {myStream && <button onClick={sendStreams}>Send Stream</button>}
//         {setClients && <button onClick={handleCallUser}>CALL</button>}
//         {myStream && (
//           <>
//             <h1>My Stream</h1>
//             <ReactPlayer
//               playing
//               muted
//               height="100px"
//               width="200px"
//               url={myStream}
//             />
//           </>
//         )}
//         {remoteStream && (
//           <>
//             <h1>Remote Stream</h1>
//             <ReactPlayer
//               playing
//               muted
//               height="100px"
//               width="200px"
//               url={remoteStream}
//             />
//           </>
//         )}
//       </div>

//     </div>
//   );
// }

// export default EditorPage;



import React, { useEffect, useRef, useState, useCallback } from "react";
import Client from "./Client";
import Editor from "./Editor";
import axios from 'axios';
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import CursorTracker from "./CurosrTracker";
import ReactPlayer from "react-player";
import peer from "../peer";

function EditorPage() {
  const [clients, setClients] = useState([]);

  const [output, setOutput] = useState("");
  const [inputRadio, setInputRadio] = useState(false);
  const [lang, setLang] = useState("C");
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [incomingTime, setIncomingTime] = useState(null);
  const [outgoingTime, setOutgoingTime] = useState(null);
  const [cursor, setcusror] = useState([]);
  const codeRef = useRef(null);
  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const peers = {};

  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  // console.log("THESE ARE CLIENTS",clients)

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();
        socketRef.current.on("connect_error", (err) => handleErrors(err));
        socketRef.current.on("connect_failed", (err) => handleErrors(err));

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: Location.state?.username,
        });

        // Listen for new clients joining the chatroom
        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId }) => {
            // this insure that new user connected message do not display to that user itself
            if (username !== Location.state?.username) {
            }
            setClients(clients);

            setIncomingTime(new Date().toLocaleTimeString());

            toast.success(`${username} joined the room at ${new Date().toLocaleTimeString()}`);

            // toast.success(`${username} joined the room.`);

            // also send the code to sync
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
            setTimeout(() => {
              // console.log(codeRef.current);
            }, 2000);
          }
        );

        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          // console.log("LOGGING SOCKET ID ",socketId)
          setOutgoingTime(new Date().toLocaleTimeString());

          toast.success(`${username} Left the room at ${new Date().toLocaleTimeString()}`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        });

        socketRef.current.on(ACTIONS.JOINED, handleJoined);
        socketRef.current.on(ACTIONS.DISCONNECTED, handleDisconnected);
      } catch (error) {
        handleErrors(error);
      }
    };

    if (socketRef.current) {
      console.log(socketRef.current);
      socketRef.current.on(ACTIONS.CODE_EXECUTED, ({ output }) => {
        setOutput(output);
      });
    }

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED, handleJoined);
        socketRef.current.off(ACTIONS.DISCONNECTED, handleDisconnected);
      }

      // Cleanup code...
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_EXECUTED);
      }

    };
  }, []);

  const handleErrors = (err) => {
    console.log("Error", err);
    toast.error("Socket connection failed, Try again later");
    navigate("/home");
  };

  const handleJoined = ({ clients, username, socketId }) => {
    if (username !== Location.state?.username) {
      // this insure that new user connected message do not display to that user itself
      setClients(clients);
      setIncomingTime(new Date().toLocaleTimeString());

      toast.success(`${username} joined the room at ${new Date().toLocaleTimeString()}`);

      socketRef.current.emit(ACTIONS.SYNC_CODE, {
        code: codeRef.current,
        socketId,
      });
    }
  };

  const handleDisconnected = ({ socketId, username }) => {
    setOutgoingTime(new Date().toLocaleTimeString());

    toast.success(`${username} Left the room at ${new Date().toLocaleTimeString()}`);
    setClients((prev) => prev.filter((client) => client.socketId !== socketId));
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`roomId is copied`);
    } catch (error) {
      console.log(error);
      toast.error("unable to copy the room Id");
    }
  };

  const runCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/editor/${roomId}`, {
        code: codeRef.current,
        input: input,
        inputRadio: inputRadio,
        lang: lang,
      });

      if (response.status === 200) {
        const result = response.data;
        setOutput(result.output);
        console.log(result.compiledCode); // This will log the compiled code from the server

        // Emit an event to the server with the code execution result
        socketRef.current.emit(ACTIONS.CODE_EXECUTED, {
          roomId,
          output: result.output,
        });

      } else {
        console.error("Error:", response.status, response.statusText);
        setOutput("Error occurred while running the code.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setOutput("Error occurred while running the code.");
    }
  };

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    console.log("sending an offer", offer);

    // Filter out the socket ID of the current user
    const otherClients = clients.filter((client) => client.socketId !== socketRef.current.id);

    // Iterate over each client and emit the offer to their socket ID
    otherClients.forEach((client) => {
      console.log("from handleCallUser function", client)
      socketRef.current.emit("user:call", { to: client.socketId, offer });
    });

    setMyStream(stream);
  }, [clients]);

  const handleIncommingCall = async ({ from, offer }) => {
    console.log(`Incoming call from ${from}.`);
    const acceptCall = window.confirm(`Incoming call from ${from}. Do you want to accept?`);
    if (acceptCall) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);

        const answer = await peer.getAnswer(offer);
        console.log(`This is the answer: ${answer}`);

        socketRef.current.emit("call:accepted", { to: from, ans: answer });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }

  };

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        // Add each track to the peer connection
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream, peer]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    const otherClients = clients.filter((client) => client.socketId !== socketRef.current.id);

    // Iterate over each client and emit the offer to their socket ID
    otherClients.forEach((client) => {
      console.log("from handleCallUser function", client)
      socketRef.current.emit("peer:nego:needed", { to: client.socketId, offer });
    });

  }, [clients]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socketRef.current.emit("peer:nego:done", { to: from, ans });
    },
    [socketRef]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socketRef.current && socketRef.current.on("incoming:call", ({ from, offer }) => {
      handleIncommingCall({ from, offer });
    });
    //  socketRef.current &&   socketRef.current.on("user:joined", handleUserJoined);

    socketRef.current && socketRef.current.on("call:accepted", handleCallAccepted);
    socketRef.current && socketRef.current.on("peer:nego:needed", handleNegoNeedIncomming);
    socketRef.current && socketRef.current.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socketRef.current && socketRef.current.off("incomming:call", handleIncommingCall);
      socketRef.current && socketRef.current.off("call:accepted", handleCallAccepted);
      socketRef.current && socketRef.current.off("peer:nego:needed", handleNegoNeedIncomming);
      socketRef.current && socketRef.current.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  // useEffect(() => {
  //   peer.peer.addEventListener("track", async (ev) => {
  //     const remoteStream = ev.streams;
  //     console.log("GOT TRACKS!!");
  //     setRemoteStream(remoteStream[0]);
  //   });
  // }, []);
  const leaveRoom = async () => {
    navigate("/login");
    toast.success(`Left the room`)
  };
  return (
    <div className="flex bg-[#3e4444]">

      <div className="flex flex-col bg-gray-100 text-gray-900">
        <aside className="flex h-screen w-[6rem] flex-col items-center border-r border-gray-200"
        >

          <div className="flex h-[4.5rem] w-full items-center justify-center border-b border-gray-200 p-2">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqVxAUItmoFJCdGEBVkPdROrk9JdJ6wUAcxQ&usqp=CAU" alt="Logo" className="h-12 w-13" />
          </div>
          <nav className="flex flex-1 flex-col gap-y-4 pt-10">
            <a href="#" className="group relative rounded-xl bg-gray-100 p-2 text-blue-600 hover:bg-gray-50">
              <svg className="h-6 w-6 stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 9V15M9 12H15H9Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                <div className="relative whitespace-nowrap rounded-md z-50 bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                  <div className="absolute inset-0 -left-1 flex items-center">
                    <div className="h-2 w-2 rotate-45 bg-white"></div>
                  </div>
                  Layouts <span className="text-gray-400">(Y)</span>
                </div>
              </div>
            </a>

            <a href="#" className="text-gary-400 group relative rounded-xl p-2 hover:bg-gray-50">
              <svg width="24" height="24" className="h-6 w-6 stroke-current group-hover:text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C14.3869 3 16.6761 3.84285 18.364 5.34315C20.0518 6.84344 21 8.87827 21 11C21 12.0609 20.5259 13.0783 19.682 13.8284C18.8381 14.5786 17.6935 15 16.5 15H14C13.5539 14.9928 13.1181 15.135 12.7621 15.404C12.4061 15.673 12.1503 16.0533 12.0353 16.4844C11.9203 16.9155 11.9528 17.3727 12.1276 17.7833C12.3025 18.1938 12.6095 18.5341 13 18.75C13.1997 18.9342 13.3366 19.1764 13.3915 19.4425C13.4465 19.7085 13.4167 19.9851 13.3064 20.2334C13.196 20.4816 13.0107 20.6891 12.7764 20.8266C12.5421 20.9641 12.2705 21.0247 12 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 11C7.77614 11 8 10.7761 8 10.5C8 10.2239 7.77614 10 7.5 10C7.22386 10 7 10.2239 7 10.5C7 10.7761 7.22386 11 7.5 11Z" fill="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8C12.2761 8 12.5 7.77614 12.5 7.5C12.5 7.22386 12.2761 7 12 7C11.7239 7 11.5 7.22386 11.5 7.5C11.5 7.77614 11.7239 8 12 8Z" fill="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.5 11C16.7761 11 17 10.7761 17 10.5C17 10.2239 16.7761 10 16.5 10C16.2239 10 16 10.2239 16 10.5C16 10.7761 16.2239 11 16.5 11Z" fill="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="absolute inset-y-0 left-12 hidden items-center group-hover:flex">
                <div className="relative whitespace-nowrap z-50 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg">
                  <div className="absolute  inset-0 -left-1  flex items-center">
                    <div className="h-2 w-2 rotate-45 bg-white"></div>
                  </div>
                  Color Scheme <span className="text-black">(Y)</span>
                </div>
              </div>

            </a>

          </nav>
          <div className="mt-6 ">
            <h3 className="font-medium text-lg  mt-2  text-center">Connected</h3>
            <div className=" p-[2rem]">
              {clients.map((client) => (
                <Client
                  key={client.socketId}
                  username={client.username}
                  incomingTime={incomingTime}
                  outgoingTime={outgoingTime}
                />
              ))}

            </div>
          </div>
          {/* <button onClick={() => startCall()}>Start Video Call</button> */}

          <button className="relative group overflow-hidden bg-[#3481ff] px-8 mb-10 h-12 flex space-x-2 items-center ">
            <span className="relative text-sm w-[4rem]  text-white" onClick={copyRoomId}>
              Copy RoomId
            </span>
          </button>
          <button className="relative group px-8 h-14 mb-6 bg-red-500 before:absolute before:inset-0 before:bg-red-700 before:scale-x-0 before:origin-right before:transition before:duration-300 hover:before:scale-x-100 hover:before:origin-left">
            <span className="relative text-sm w-[8rem] text-white" onClick={leaveRoom}>
              LEAVE
            </span>
          </button>
        </aside>
      </div>

      {/* Editor panel */}
      <div className="flex flex-1">
        <CursorTracker roomId={roomId} socketRef={socketRef}
          username={Location.state?.username}
          clients={clients} // Pass the clients state to CursorTracker

        />
        <Editor
          socketRef={socketRef}
          username={Location.state?.username}
          clients={clients} // Pass the clients state to CursorTracker

          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}

        />

        <form
          className="flex flex-col w-1/2 p-4 bg-gray-100 rounded-tl-lg	rounded-bl-lg"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form submission
            runCode(e); // Call your runCode function manually
          }}
        >
          <div className="flex flex-row items-center  mt-4 gap-x-2">
            <h6 className="">INPUT FOR CODE</h6>
            <input
              type="radio"
              name="inputRadio"
              id="inputRadioYes"
              checked={inputRadio}
              onChange={() => setInputRadio(true)}
            />
            <label htmlFor="inputRadioYes" className="text-sm ">
              Yes
            </label>

            <input
              type="radio"
              name="inputRadio"
              id="inputRadioNo"
              checked={!inputRadio}
              onChange={() => setInputRadio(false)}
            />
            <label htmlFor="inputRadioNo" className="text-sm ">
              No
            </label>
            <h6>SELECT LANGUAGE</h6>
            <select
              className="custom-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{ appearance: "none", paddingRight: "1rem" }}
            >
              <option value="C">C</option>
              <option value="JavaScript">JavaScript</option>
              <option value="C++">C++</option>
              <option value="Python">Python</option>


            </select>
          </div>
          <br />
          <textarea
            id="input"
            value={input}  // Use value instead of defaultValue
            onChange={(e) => setInput(e.target.value)}  // Update the input state on change
            name="code"
            className="w-full h-1/2 bg-gray-800 text-white p-2 mt-4 rounded-lg"
            placeholder="Input for your code"
          ></textarea>


          <button
            type="submit" // Use type="submit" for the button inside a form
            className="w-full mt-4 bg-[#3481ff] px-4 py-2 text-white"
          >
            Run Code
          </button>
          <textarea
            className="w-full h-1/2 mt-4 bg-gray-800 text-white text-xl p-2 rounded-lg"
            placeholder="Output will be displayed here..."
            value={output}
            readOnly
          ></textarea>

        </form>

      </div>
      <div className="bg-white">
        <h4>{setClients ? "Connected" : "No one in room"}</h4>
        {myStream && <button onClick={sendStreams}>Send Stream</button>}
        {setClients && <button onClick={handleCallUser}>CALL</button>}
        {myStream && (
          <>
            <h1>My Stream</h1>
            <ReactPlayer
              playing
              muted
              height="100px"
              width="200px"
              url={myStream}
            />
          </>
        )}
        {remoteStream && (
          <>
            <h1>Remote Stream</h1>
            <ReactPlayer
              playing
              muted
              height="100px"
              width="200px"
              url={remoteStream}
            />
          </>
        )}
      </div>

    </div>
  );
}

export default EditorPage;