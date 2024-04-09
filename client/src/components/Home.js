import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room Id is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both the field is requried");
      return;
    }

    // redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("room is created");
  };

  // when enter then also join
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div>
      <div
        className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white"
      >
        <div className="flex w-[30rem] flex-col space-y-10">
          <div className="text-center text-4xl font-medium">CODE AND COLLAB</div>

          <div
            className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
          >
            <input
              type="text"
              placeholder="Username"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />
          </div>

          <div
            className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
          >
            <input
              type="value"
              placeholder="RoomID"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}

            />
          </div>

          <button
            className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
            onClick={joinRoom}
          >
            GO
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a
              onClick={generateRoomId}
              href=""
              className="text-xl"

            >
              new room
            </a>
          </span>


        </div>
      </div>
    </div >
  );
}

export default Home;
