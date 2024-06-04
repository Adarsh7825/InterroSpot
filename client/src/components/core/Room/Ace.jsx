import { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import { diff_match_patch } from 'diff-match-patch';
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
import { useSelector } from 'react-redux';

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
    const dmp = new diff_match_patch();
    const [theme, setTheme] = useState('monokai');
    const [fontSize, setFontSize] = useState(18);
    const [fontFamily, setFontFamily] = useState('monospace');
    const sent = useRef(true);
    const REACT_APP_BACKEND_URL = 'http://localhost:8181/';
    const { user } = useSelector((state) => state.profile);

    // Ensure code is initialized
    const [initializedCode, setInitializedCode] = useState(code || '');

    useEffect(() => {
        if (!sent.current) return;

        sent.current = false;
        const sendData = setTimeout(() => {
            axios({
                method: 'patch',
                url: `${REACT_APP_BACKEND_URL}rooms/update`,
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                data: {
                    'room': {
                        roomid,
                        code,
                        language
                    },
                }
            })
                .then((res) => {
                    console.log("patched successfully", res)
                })
                .catch((err) => {
                    console.log("error from axios", err)
                })
            sent.current = true;
        }, 2000)
        console.log("sendData", sendData)

    }, [code])

    function handleChange(newValue, event) {
        if (initializedCode === undefined) {
            console.error('Old Value is undefined');
            return;
        }
        const patch = dmp.patch_make(initializedCode, newValue);
        console.log('Generated patch:', patch);
        setInitializedCode(newValue);
        updateRoom(patch);
        setCode(newValue);
    }

    const handleIOChange = (newValue) => {
        setInput(newValue);
        IOEMIT(newValue, output, language);
    };

    function handleLangChange(e) {
        // save this code in localsotrage in roomid
        setLanguage(e);
        IOEMIT(input, output, e);
    }

    return (
        <div id="editor">
            <div id='workspace' style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
                    value={initializedCode}
                    fontSize={18}
                    height='50%'
                    width='100%'
                    setAutoScrollEditorIntoView
                    defaultValue=''
                    ref={EditorRef}
                    editorProps={{ $blockScrolling: true }}
                />
                <div id='io' style={{ display: 'flex', flexDirection: 'column', height: '50%' }}>
                    <div className="input" style={{ flex: 1 }}>
                        <h5>Input</h5>
                        <AceEditor
                            theme={theme}
                            mode={''}
                            value={input}
                            width="100%"
                            height="100%"
                            onChange={handleIOChange}
                            fontSize={fontSize}
                        />
                    </div>
                    <div className="output" style={{ flex: 1 }}>
                        <h5>Output</h5>
                        <AceEditor
                            theme={theme}
                            mode={''}
                            value={output}
                            width="100%"
                            height="100%"
                            readOnly={true}
                            fontSize={fontSize}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ace;