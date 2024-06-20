import { diff_match_patch } from 'diff-match-patch';

const dmp = new diff_match_patch();

export const setupSocketHandlers = (socket, {
    name,
    roomid,
    code,
    language,
    token,
    input,
    output,
    avatar,
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
}) => {
    socket.on('connect', () => {
        console.log('Connected');
    });

    socket.emit('join', {
        name,
        roomid,
        code,
        language,
        token,
        input,
        output,
        avatar
    });

    socket.on('join', (msg, room) => {
        console.log("join gave me this data\n", room, "\n");
        toast(msg);

        setCode(room.code);
        setLanguage(room.language);
        setInput(room.input);
        setOutput(room.output);
        setInRoomUsers(room.users);
        socket.off('join');
        console.log(room);
    });

    socket.on('userJoin', ({ msg, newUser }) => {
        const arr = [newUser, ...inRoomUsers];
        setInRoomUsers(arr);
        toast.success(msg);
    });

    socket.on('userLeft', ({ msg, userId }) => {
        console.log('userLeft', msg);
        const arr = inRoomUsers.filter(user => user.id !== userId);
        setInRoomUsers(arr);
        console.log('userLeft', inRoomUsers);
        toast.error(msg);
    });

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

    socket.on('getRoom', ({ room }) => {
        setCode(room.code);
        setLanguage(room.language);
        setInput(room.input);
        setOutput(room.output);
        console.log('Received full room data:', room);
    });

    socket.on('updateIO', ({ newinput, newoutput, newlanguage }) => {
        console.log('updateIo', newinput, newoutput, newlanguage);
        setLanguage(newlanguage);
        setInput(newinput);
        setOutput(newoutput);
    });

    socket.on('updateOutput', ({ newOutput }) => {
        setOutput(newOutput);
    });

    socket.on('error', ({ error }) => {
        console.log('error from socket call', error);
    });
};

export const leaveRoom = (socket, roomid, navigate) => {
    socket.emit('leave', { roomid });
    socket.off();
    navigate('/');
};