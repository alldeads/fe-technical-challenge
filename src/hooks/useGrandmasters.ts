import { useState, useEffect } from 'react';

interface GrandmasterData {
  players: string[];
}

interface UseGrandmastersReturn {
  grandmasters: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGrandmasters = (): UseGrandmastersReturn => {
  const [grandmasters, setGrandmasters] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrandmasters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://api.chess.com/pub/titled/GM');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GrandmasterData = await response.json();
      setGrandmasters(data.players || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grandmasters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrandmasters();
  }, []);

  const refetch = () => {
    fetchGrandmasters();
  };

  return {
    grandmasters,
    loading,
    error,
    refetch
  };
};