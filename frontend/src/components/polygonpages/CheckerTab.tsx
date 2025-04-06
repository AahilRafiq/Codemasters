import React,{useState,useEffect} from "react";
import { Button } from "@/components/ui/button";
import { fetchendpoint } from "@/services/polygon";
import { Textarea } from "@/components/ui/textarea";
import config from "@/config";

export const CheckerTab: React.FC<{  apiKey: string, secret: string, problemId: string }> = ({ apiKey, secret, problemId }) => {
    const [files, setFiles] = useState<any>({});
    const [checker, setChecker] = useState('');
    const [selectedChecker, setSelectedChecker] = useState(checker);
    const [checkerCode, setCheckerCode] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        fetchChecker();
        fetchFilesData();
    
    },[])

    useEffect(() => {
        if (checker) {
            setSelectedChecker(checker);
            fetchCheckerCode(checker);
        }
    }, [checker, apiKey, secret, problemId]);

     const fetchFilesData = async () => {
        const filesData = await fetchendpoint(apiKey, secret, problemId, 'files');
        setFiles(filesData.files);
    }
    const fetchChecker = async () => {
        const checkerData= await fetchendpoint(apiKey, secret,problemId,'checker');
                setChecker(checkerData.checker)
                setSelectedChecker(checkerData.checker);
                setCheckerCode(checkerData.checkerCode);
        }
    const fetchCheckerCode = async (checkerName: string) => {
        if (!checkerName) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${config.HOST}/polygon/view-file`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    type: 'source',
                    name: checkerName
                })
            });
            
            const data = await response.text();
            const content = await JSON.parse(data);
            setCheckerCode(content.file);
        } catch (error) {
            console.error("Error fetching checker code:", error);
            
        } finally {
            setLoading(false);
        }
    };

    const handleCheckerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedChecker(e.target.value);
        fetchCheckerCode(e.target.value);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCheckerCode(e.target.value);
    };

    const handleSaveChecker = async () => {
        setSaving(true);
        setMessage(null);
        
        try {
            // First save the checker file
            await fetch(`${config.HOST}/polygon/save-file`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    type: 'source',
                    name: selectedChecker,
                    file: checkerCode,
                    sourceType: 'cpp.g++' // Adjust based on file type
                })
            });
            
            // Then set it as the checker
            await fetch(`${config.HOST}/polygon/set-checker`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    checker: selectedChecker
                })
            });
            
            setMessage('Checker saved and set successfully');
        } catch (error) {
            setMessage('Error saving checker');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const sourceFiles = files.sourceFiles || [];

    return (
        <div className="checker-tab">
            <h2>Checker</h2>
            
            {message && <div className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</div>}
            
            <div className="checker-selection">
                <label>Select Checker:</label>
                <select value={selectedChecker} onChange={handleCheckerChange}>
                    <option value="">-- Select a checker --</option>
                    {sourceFiles.map((file: any) => (
                        <option key={file.name} value={file.name}>{file.name}</option>
                    ))}
                </select>
            </div>
            
            {loading ? (
                <div className="loading">Loading checker code...</div>
            ) : (
                <div className="checker-code">
                    <label>Checker Code:</label>
                    <Textarea
                        value={checkerCode}
                        onChange={handleCodeChange}
                        rows={20}
                        placeholder="Enter checker code here"
                    />
                    
                    <Button onClick={handleSaveChecker} disabled={saving || !selectedChecker}>
                        {saving ? 'Saving...' : 'Save Checker'}
                    </Button>
                </div>
            )}
        </div>
    );
};
