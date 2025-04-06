import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import "./RealTimeEditor.css";
import config from "@/config";
import { Socket } from "socket.io-client";
import * as monaco from "monaco-editor";

export default function RealTimeCodeEditor() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [editorReady, setEditorReady] = useState(false);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const isEditing = useRef(false);

    // Initialize socket connection
    useEffect(() => {
        const socketUrl = config.SOCKET_URL;
        const s = io(socketUrl);
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    const handleEditorMount = (editor :any) => {
        editorRef.current = editor;
        setEditorReady(true);
    };

    useEffect(() => {
        if (!editorRef.current || !socket || !editorReady) return;
    
        // Set up the editor change event
        const handleEditorChange = () => {
            if (isEditing.current) return;
            
            const content = editorRef.current ? editorRef.current.getValue() : "";
            socket.emit("send-changes", content);
            console.log("Content sent to server:", content);
        };
    
        const handleContentChange = (content :any) => {
            isEditing.current = true;
            if (editorRef.current) {
                editorRef.current.setValue(content);
                console.log("Content received from server:", content);
            }
            setTimeout(() => {
                isEditing.current = false;
            }, 0);
        };
    
        // Store the disposable and dispose it properly
        const disposable = editorRef.current.onDidChangeModelContent(handleEditorChange);
        socket.on("receive-changes", handleContentChange);
    
        return () => {
            disposable.dispose();
            socket.off("receive-changes", handleContentChange);
        };
    }, [socket, editorReady]);

    return (
        <div className="code-editor-container">
            <Editor
                height="1000px"
                width={"1000px"}
                defaultLanguage="javascript"
                defaultValue="// Start coding here..."
                theme="vs-dark"
                onMount={handleEditorMount}
                options={{
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    lineNumbers: "on",
                    tabSize: 2
                }}
            />
        </div>
    );
}