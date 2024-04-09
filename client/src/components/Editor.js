import React, { useEffect, useRef, useState } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, username, onCodeChange }) {
  const [userCursors, setUserCursors] = useState({});
  const editorRef = useRef(null);
  const cursorWidgets = useRef({});

  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current = editor;
      // editor.setSize(null, "100%");

      editor.on("change", (instance, changes) => {
        const { origin } = changes;

        const code = instance.getValue();
        const cursorPos = editor.getCursor();

        onCodeChange(code);

        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
            username,
            cursorPos,
          });
        }
      });
    };

    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, cursorPositions }) => {
        if (code !== null) {
          editorRef.current.setValue(code);

          // Clear existing widgets
          for (const user in cursorWidgets.current) {
            const widget = cursorWidgets.current[user];
            const parentElement = widget.parentNode;
            parentElement.removeChild(widget);
          }

          // Set new cursor positions
          setUserCursors(cursorPositions);

          // Add or update widgets for each user's cursor
          for (const user in cursorPositions) {
            const cursor = cursorPositions[user].cursorPos;
            if (cursor && user !== username) {
              const widget = document.createElement("div");
              widget.className = `cursor-widget cursor-widget-${user} bg-blue-500 text-white p-1 rounded`;
              widget.textContent = user;

              editorRef.current.addWidget(cursor, widget, true);
              cursorWidgets.current[user] = widget;
            }
          }
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current, username]);


  return (
    <div className="relative">
      <textarea id="realtimeEditor" className="CodeMirror-cursors"></textarea>
    </div>
  );
}

export default Editor;
