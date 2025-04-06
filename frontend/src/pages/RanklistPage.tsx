import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '@/config';

interface RankEntry {
  user_id: string;
  score: number;
  rank: number;
}

const RanklistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get contest ID from the URL
  const [ranklist, setRanklist] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanklist = async () => {
      try {
        const response = await axios.get(`${config.HOST}/contests/${id}/ranklist`);
        setRanklist(response.data.ranklist);
        console.log(response.data.ranklist);
      } catch (err) {
        setError('Failed to load ranklist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanklist();
  }, [id]);
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Final Ranklist</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Rank</th>
            <th className="border border-gray-300 px-4 py-2">User ID</th>
            <th className="border border-gray-300 px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {/* {ranklist.map((entry) => (
            <tr key={entry.user_id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{entry.rank}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{entry.user_id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{entry.score}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default RanklistPage;
