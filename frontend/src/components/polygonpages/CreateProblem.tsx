import {useState,useEffect} from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function CreateProblem() {

const [apiKey, setApiKey] = useState('');
const [secret, setSecret] = useState('');
const [name, setName] = useState('');
    useEffect(() => { 
        const loadCredentials = () => {
            const creds = localStorage.getItem('polygoncreds');
            if (creds) {
                try {
                    const { apiKey, secret } = JSON.parse(creds);
                    setSecret(secret);
                    setApiKey(apiKey);
                    return { apiKey, secret };
                } catch (e) {
                    console.error("Failed to parse credentials", e);
                    return null;
                }
            }
            return null;
        };
     loadCredentials();
    
        }, [])
    const handleCreateProblem = async () => {
        try {
            const response = await fetch('`${config.HOST}/polygon/create-problem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    name
                })
            });
            
            const data = await response.json();
            if (data.status === 'success') {
                alert('Problem created successfully');
            } else {
                alert('Error creating problem ' + data.message);
                
            }
        } catch (error) {
            alert('Error creating problem');
            console.error(error);
        } 
      };
  return (

    <div className="p-4 w-1/2" >
      <h3 className="text-1xl font-bold">Create Problem</h3>
      
        
        <label className="block mb-2">
          <span className="block text-sm font-medium text-gray-700">Name</span>
          <Input value={name} name="name" onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </label>
        <Button type="submit" onClick={handleCreateProblem} className="mt-4 px-4 py-2 bg-indigo-500 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring-indigo-700">
          Create Problem
        </Button>
    
    </div>
  );
}
