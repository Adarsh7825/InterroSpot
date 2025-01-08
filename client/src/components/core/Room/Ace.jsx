import React, { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import { useDispatch, useSelector } from 'react-redux';
import { diff_match_patch } from 'diff-match-patch';
import { updateRooms } from '../../../services/operations/roomAPI';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-vibrant_ink';
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/ext-language_tools';
import Settings from './Settings';
import useDebouncedEffect from './useDebouncedEffect';

const Ace = ({
    updateRoom,
    code,
    setCode,
    language,
    setLanguage,
    roomid,
    EditorRef,
    input,
    setInput,
    output,
    IOEMIT,
    running,
    run
}) => {
    const dispatch = useDispatch();
    const dmp = new diff_match_patch();
    const [theme, setTheme] = useState('cobalt');
    const [fontSize, setFontSize] = useState(18);
    const [fontFamily, setFontFamily] = useState('monospace');
    const { user } = useSelector((state) => state.profile);

    // Ensure code is initialized
    const [initializedCode, setInitializedCode] = useState(code || '');

    useDebouncedEffect(() => {
        if (initializedCode !== undefined) {
            dispatch(updateRooms(roomid, code, language, user.token));
        }
    }, [code], 2000);

    const handleChange = (newValue) => {
        if (initializedCode === undefined) {
            console.error('Old Value is undefined');
            return;
        }
        const patch = dmp.patch_make(initializedCode, newValue);
        setInitializedCode(newValue);
        updateRoom(patch);
        setCode(newValue);
    };

    const handleIOChange = (newValue) => {
        setInput(newValue);
        IOEMIT(newValue, output, language);
    };

    const handleLangChange = (e) => {
        setLanguage(e);
        IOEMIT(input, output, e);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="bg-[#0F3460]/50 backdrop-blur-md p-4 border-b border-[#533483]/20">
                <Settings
                    setLanguage={setLanguage}
                    setTheme={setTheme}
                    setFontSize={setFontSize}
                    setFontFamily={setFontFamily}
                    language={language}
                    theme={theme}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    updateRoom={(patch) => socket.emit('update', { roomid, patch })}
                    run={run}
                    handleLangChange={handleLangChange}
                    running={running}
                />
            </div>
            <div id='workspace' className="flex-1 bg-[#1A1A2E]">
                <AceEditor
                    setOptions={{
                        useWorker: false,
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        fontFamily,
                        fontSize,
                    }}
                    onChange={handleChange}
                    mode={language}
                    theme={theme}
                    name="ACE_EDITOR"
                    value={code}
                    fontSize={18}
                    height='100%'
                    width='100%'
                    setAutoScrollEditorIntoView
                    defaultValue=''
                    ref={EditorRef}
                    editorProps={{ $blockScrolling: true }}
                    className="rounded-lg shadow-lg"
                    style={{
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(83, 52, 131, 0.2)',
                    }}
                />
            </div>
        </div>
    );
};

export default Ace;