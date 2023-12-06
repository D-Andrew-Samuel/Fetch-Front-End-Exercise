const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';




export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  city: string;
  breed: string;
}




export interface SearchParams {
  breeds?: string[];
  city?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}


export const login = async (name: string, email: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Login error response:", errorText);
      throw new Error(`Login failed with status: ${response.status} and message: ${errorText}`);
    }

    const responseText = await response.text();
    if (responseText !== "OK") {
      throw new Error(`Unexpected response: ${responseText}`);
    }

    console.log('Login successful');
    return 'Login successful';
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Unable to connect to the server");
  }
};

export const getBreeds = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Fetching breeds failed with status: ${response.status} and message: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch breeds error:", error);
    throw new Error("Unable to fetch breeds");
  }
};


export const getCities = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/search`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetching cities failed with status: ${response.status} and message: ${errorText}`);
    }

    const data = await response.json();
    return data.results.map((location: { city: string }) => location.city);
  } catch (error) {
    console.error("Fetch cities error:", error);
    throw new Error("Unable to fetch cities");
  }
};



export const searchDogs = async (params: SearchParams): Promise<Dog[]> => {
  const queryParams = new URLSearchParams();

  if (params.breeds && params.breeds.length) queryParams.append('breeds', params.breeds.join(','));
  if (params.city && params.city.length) queryParams.append('city', params.city.join(','));
  if (params.ageMin !== undefined) queryParams.append('ageMin', params.ageMin.toString());
  if (params.ageMax !== undefined) queryParams.append('ageMax', params.ageMax.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.from !== undefined) queryParams.append('from', params.from.toString());
  if (params.sort) queryParams.append('sort', params.sort);

  try {
    const response = await fetch(`${API_BASE_URL}/dogs/search?${queryParams.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search failed with status: ${response.status} and message: ${errorText}`);
    }

    const data = await response.json();
    return data.resultIds.map((id: string) => ({ id }));
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Unable to search for dogs");
  }
};


export const fetchDogsByIds = async (dogIds: string[]): Promise<Dog[]> => {
  const chunkSize = 100;
  const dogIdChunks = [];
  for (let i = 0; i < dogIds.length; i += chunkSize) {
    dogIdChunks.push(dogIds.slice(i, i + chunkSize));
  }

  const dogs = [];
  for (const dogIdChunk of dogIdChunks) {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dogIdChunk),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetching dogs failed with status: ${response.status} and message: ${errorText}`);
      }

      const data = await response.json();
      console.log(data)
      dogs.push(...data);
    } catch (error) {
      console.error("Fetch dogs error:", error);
      throw new Error("Unable to fetch dogs");
    }
  }

  return dogs;
};


export const matchWithDog = async (dogIds: string[]): Promise<{ match: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dogs/match`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dogIds),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Matching with a dog failed with status: ${response.status} and message: ${errorText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Matching with a dog error:", error);
    throw new Error("Unable to match with a dog");
  }
};
  

export async function searchLocationsWithCriteria(searchCriteria: any): Promise<{ results: Location[], total: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/search`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchCriteria),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search locations with criteria failed with status: ${response.status} and message: ${errorText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Search locations with criteria error:", error);
    throw new Error("Unable to search locations with criteria");
  }
}