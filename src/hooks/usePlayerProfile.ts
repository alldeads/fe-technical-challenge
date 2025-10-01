import { useState, useEffect } from 'react';

interface PlayerProfile {
  player_id: number;
  '@id': string;
  url: string;
  username: string;
  followers: number;
  country: string;
  last_online: number;
  joined: number;
  status: string;
  name?: string;
  avatar?: string;
  location?: string;
  league?: string;
  streaming_platforms?: string[];
  is_streamer?: boolean;
  verified?: boolean;
  fide?: number;
}

interface CountryInfo {
  '@id': string;
  name: string;
  code: string;
}

interface UsePlayerProfileReturn {
  profile: PlayerProfile | null;
  countryInfo: CountryInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePlayerProfile = (username: string | undefined): UsePlayerProfileReturn => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileAndCountry = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch player profile
      const profileResponse = await fetch(`https://api.chess.com/pub/player/${username}`);
      
      if (!profileResponse.ok) {
        throw new Error(`HTTP error! status: ${profileResponse.status}`);
      }
      
      const profileData: PlayerProfile = await profileResponse.json();
      setProfile(profileData);
      
      // Extract country code from the country URL and fetch country info
      if (profileData.country) {
        const countryCode = profileData.country.split('/').pop();
        
        if (countryCode) {
          try {
            const countryResponse = await fetch(`https://api.chess.com/pub/country/${countryCode}`);
            
            if (countryResponse.ok) {
              const countryData: CountryInfo = await countryResponse.json();
              setCountryInfo(countryData);
            }
          } catch (countryErr) {
            // If country fetch fails, continue without country info
            console.warn('Failed to fetch country info:', countryErr);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndCountry();
  }, [username]);

  const refetch = () => {
    fetchProfileAndCountry();
  };

  return {
    profile,
    countryInfo,
    loading,
    error,
    refetch
  };
};