import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { StarIcon, LockIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link,useNavigate } from "react-router-dom";
import { PolygonProblemType } from "../types/polygon";
import {loadCredentials } from "@/services/polygon";
import config from "@/config";

interface ProblemTileProps {
    problem: PolygonProblemType;
}

const ProblemTile: React.FC<ProblemTileProps> = ({ problem}) => {
    const navigate = useNavigate();
    
    return (
            <Card className={cn(
                "h-full border-l-4 p-4 space-y-2 transition-all",
                problem.favourite ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-l-slate-200 dark:border-l-slate-700"
            )}>
        <Link to={`/polygon/${problem.id}`} className="">
                <CardHeader className="pb-2 flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold line-clamp-2 text-foreground">
                        {problem.name}
                    </CardTitle>
                    {problem.favourite && (
                        <StarIcon className="h-5 w-5 text-amber-500 fill-amber-500" />
                    )}
                </CardHeader>

                <CardContent className="text-sm text-muted-foreground">
                    <p className="font-medium">Rev {problem.revision}</p>
                    {problem.latestPackage && <p>Package {problem.latestPackage}</p>}
                    <p>Owner: <span className="font-medium text-foreground">{problem.owner}</span></p>
                </CardContent>

                <CardFooter className="pt-2 flex gap-2 flex-wrap">
                    <Badge variant="outline" className={cn("flex items-center gap-1", accessTypeColor(problem.accessType))}>
                        <LockIcon className="h-3 w-3" /> {problem.accessType}
                    </Badge>
                    {problem.modified && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <PencilIcon className="h-3 w-3" /> Modified
                        </Badge>
                    )}
                </CardFooter>
                </Link>
                <Button className="mx-9 bg-blue-600 " onClick={()=>{navigate(`/addquestion/${problem.id}`)}}> Add question</Button>
                
            </Card>
    );
};

function accessTypeColor(accessType: string) {
    switch (accessType) {
        case "OWNER": return "text-green-600 dark:text-green-400";
        case "READ": return "text-red-600 dark:text-red-400";
        case "protected": return "text-blue-600 dark:text-blue-400";
        default: return "";
    }
}

const PolygonHomePage = () => {
    const [problems, setProblems] = useState<PolygonProblemType[]>([]);
    const [secret, setSecret] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       
           const data =loadCredentials();
           setSecret(data?.secret);
           setApiKey(data?.apiKey);
        const fetchProblems = async (apiKey: string, secret: string) => {
            try {
                const response = await fetch(`${config.HOST}/polygon/problems`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey, secret })
                });
                const data = await response.json();
                console.log("API response:", data);
                if (data.status === 'OK') {
                    setProblems(data.result);
                } else {
                    console.error("API error:", data);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        const credentials = loadCredentials();
        if (credentials) {
            console.log("Fetching problems...");
            fetchProblems(credentials.apiKey, credentials.secret);
            console.log("Fetched problems.");
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <div className="container">Loading...</div>;

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const apiKey = formData.get('apiKey') as string;
        const secret = formData.get('secret') as string;
        localStorage.setItem('polygoncreds', JSON.stringify({ apiKey, secret }));
        window.location.reload();
    }

    return (!secret || !apiKey) ? (
        <div className="container flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <label className="flex flex-col gap-1">
                    API Key:
                    <input type="text" name="apiKey" className="p-2 border rounded" />
                </label>
                <label className="flex flex-col gap-1">
                    Secret:
                    <input type="password" name="secret" className="p-2 border rounded" />
                </label>
                <button type="submit" className="p-3 bg-blue-500 text-white rounded">Submit</button>
            </form>
        </div>
    ) : (
        <div className="container p-9 flex flex-col items-center">
            <h1 className="text-xl font-bold mb-4">Polygon Problems</h1>
            {/* create problem */}
            <div className="mb-4 w-80">

                <Link to="/polygon/create" className="block p-4 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Create Problem
                </Link>
            </div>
            {problems.length > 0 ? (
                <ul className="grid gap-4 w-2/3">
                    {problems.map(problem => <ProblemTile key={problem.id} problem={problem} />)}
                </ul>
            ) : (
                <p>No problems found.</p>
            )}
        </div>
    );
};

export default PolygonHomePage;
