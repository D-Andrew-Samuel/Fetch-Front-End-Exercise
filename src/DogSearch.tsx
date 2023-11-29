// DogSearch.tsx
import React, { useState, useEffect } from 'react';
import { searchDogs, Dog, SearchParams, getBreeds } from './api';

const DogSearch: React.FC = () => {
    const [breed, setBreed] = useState('');
    const [breeds, setBreeds] = useState<string[]>([]);
    const [zipCode, setZipCode] = useState('');
    const [ageMin, setAgeMin] = useState<number | undefined>();
    const [ageMax, setAgeMax] = useState<number | undefined>();
    const [size, setSize] = useState<number | undefined>();
    const [from, setFrom] = useState<number | undefined>();
    const [sort, setSort] = useState<string | undefined>();
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [searchError, setSearchError] = useState('');

    useEffect((() => {
        const fetchBreeds = async () => {
            try {
                const breeds = await getBreeds();
                console.log('Fetched breeds:', breeds);
                setBreeds(breeds);
            } catch (error) {
                console.error('Failed to fetch breeds:', error);
            }
        };
        fetchBreeds();
    }), []);

    const handleSearch = async () => {
        try {
            const searchParams: SearchParams = {
                breeds: breed ? [breed] : undefined,
                zipCodes: zipCode ? [zipCode] : undefined,
                ageMin,
                ageMax,
                size,
                from,
                sort,
            };
            const results = await searchDogs(searchParams);
            setDogs(results);
            setSearchError('');
        } catch (error) {
            setSearchError('Failed to search for dogs. Please try again.');
        }
    };

    console.log('Current breeds state:', breeds);

    return (
        <div className="bg-gray-100 p-6">
            <div className="space-y-4">
            <label>
                    Breed:
                    <select className="w-full p-2 border border-gray-300 rounded" value={breed} onChange={(e) => setBreed(e.target.value)}>
                        console.log('Selected breeds:', e.target.value);
                        setBreed(e.target.value);
                        {breeds.map((breed) => (
                            <option key={breed} value={breed}>
                                {breed}
                            </option>
                        ))}
                    </select>
                </label>
                <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
                <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                <input className="w-full p-2 border border-gray-300 rounded" type="number" placeholder="Min Age" value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value))} />
                <input className="w-full p-2 border border-gray-300 rounded" type="number" placeholder="Max Age" value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value))} />
                <input className="w-full p-2 border border-gray-300 rounded" type="number" placeholder="Size" value={size} onChange={(e) => setSize(Number(e.target.value))} />
                <input className="w-full p-2 border border-gray-300 rounded" type="number" placeholder="From" value={from} onChange={(e) => setFrom(Number(e.target.value))} />
                <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Sort" value={sort} onChange={(e) => setSort(e.target.value)} />
                <button className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={handleSearch}>Search</button>
            </div>
            {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
            <div className="mt-4 space-y-2">
                {/* Display search results */}
                {dogs.map(dog => (
                    <div key={dog.id} className="p-4 border border-gray-300 rounded bg-white">
                        <p className="font-bold">{dog.name}</p>
                        <p>{dog.breed} - Age: {dog.age}</p>
                        {/* More dog details */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DogSearch;
