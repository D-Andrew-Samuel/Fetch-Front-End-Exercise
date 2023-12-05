// DogSearch.tsx
import React, { useState, useEffect } from 'react';
import { searchDogs, Dog, SearchParams, getBreeds, searchLocationsWithCriteria, fetchDogsByIds, matchWithDog } from './api';
import { getCities } from './api';

interface DogSearchProps {
    handleLogout: () => void;
    userName: string;
}

const ITEMS_PER_PAGE = 5;

const DogSearch: React.FC<DogSearchProps> = ({handleLogout, userName}) => {
    const [breed, setBreed] = useState('');
    const [breeds, setBreeds] = useState<string[]>([]);
    const [city, setCity] = useState('');
    const [ageMin, setAgeMin] = useState<number | undefined>();
    const [ageMax, setAgeMax] = useState<number | undefined>();
    const [size, setSize] = useState<number | undefined>(25);    
    const [sort, setSort] = useState('breed-asc');
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [match, setMatch] = useState<{ match: string } | null>(null);
    const [searchError, setSearchError] = useState('');

const [currentPage, setCurrentPage] = useState(0);

const handleAgeMinChange = (value: number | undefined) => {
    if (value !== undefined && ageMax !== undefined && value > ageMax) {
        alert('Minimum age cannot be greater than maximum age');
    } else {
        setAgeMin(value);
    }
};

const handleAgeMaxChange = (value: number | undefined) => {
    if (value !== undefined && ageMin !== undefined && value < ageMin) {
        alert('Maximum age cannot be less than minimum age');
    } else {
        setAgeMax(value);
    }
};

const handleReset = () => {
    setBreed('');
    setCity('');
    setAgeMin(undefined);
    setAgeMax(undefined);
    setSize(25);
    setSort('breed-asc');
    setDogs([]);
    setSearchError('');
    setCurrentPage(0);
};
const [cities, setCities] = useState<string[]>([]);

    useEffect((() => {
        const fetchBreedsAndCities = async () => {
            try {
                const breeds = await getBreeds();
                console.log('Fetched breeds:', breeds);
                setBreeds(breeds);
    
                const citiesFromApi = await getCities();
                console.log('Fetched cities:', citiesFromApi);
                setCities(citiesFromApi);
            } catch (error) {
                console.error('Failed to fetch breeds or cities:', error);
            }
        };
        fetchBreedsAndCities();

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

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        try {
            const searchParams: SearchParams = {
                breeds: breed ? [breed] : undefined,
                city: city ? [city] : undefined,
                ageMin,
                ageMax,
                size,
            };
            console.log('Search params:', searchParams);
            const searchResult = await searchDogs(searchParams);
            console.log('Search result:', searchResult);
            const dogDetails = await fetchDogsByIds(searchResult.map(dog => dog.id));
            const match = await matchWithDog(dogDetails.map(dog => dog.id));
    
            //  sorting logic
            switch (sort) {
                case 'age-asc':
                    dogDetails.sort((a, b) => a.age - b.age);
                    break;
                case 'age-desc':
                    dogDetails.sort((a, b) => b.age - a.age);
                    break;
                case 'breed-asc':
                    dogDetails.sort((a, b) => a.breed.localeCompare(b.breed));
                    break;
                case 'breed-desc':
                    dogDetails.sort((a, b) => b.breed.localeCompare(a.breed));
                    break;
                case 'name-asc':
                    dogDetails.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    dogDetails.sort((a, b) => b.name.localeCompare(a.name));
                    break;
            }
            setDogs(dogDetails);
            setMatch(match);
            setSearchError('');
            setCurrentPage(0);
        } catch (error) {
            setSearchError('Failed to search for dogs. Please try again.');
        }
    };

    console.log('Current breeds state:', breeds);

const dogsOnCurrentPage = dogs.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

const totalPages = Math.ceil(dogs.length / ITEMS_PER_PAGE);

return (
    <div className="bg-slate-200 p-6">
        <div className="mt-6 text-center">
        <h2 className="text-2xl font-light font-mono">Hello {userName}!</h2>
            <button onClick={handleLogout} className="mt-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 bg-red-500 text-white rounded hover:bg-red-600">Not you? Log Out</button>
            </div>
        <form onSubmit={handleSearch}>
            <div className="space-y-4">
                <label>
                    Breed:
                    <select className="w-full p-2 border border-gray-300 rounded" value={breed} onChange={(e) => setBreed(e.target.value)}>
                        <option disabled value="">Select Breed</option>
                        {breeds.map((breed) => (
                            <option key={breed} value={breed}>
                                {breed}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    City:
                    <select className="w-full p-2 border border-gray-300 rounded" value={city} onChange={(e) => setCity(e.target.value)}>
                        <option disabled value="">Select City</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Age Range:
                    <select className="w-full p-2 border border-gray-300 rounded mb-4" value={ageMin || ''} onChange={(e) => handleAgeMinChange(e.target.value ? Number(e.target.value) : undefined)}>
                        <option disabled value="">Select Min Age</option>
                        {Array.from({ length: 21 }, (_, i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <select className="w-full p-2 border border-gray-300 rounded" value={ageMax || ''} onChange={(e) => handleAgeMaxChange(e.target.value ? Number(e.target.value) : undefined)}>
                        <option disabled value="">Select Max Age</option>
                        {Array.from({ length: 21 }, (_, i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </label>      

                <label>
                    How many dogs would you like to fetch?
                    <select className="w-full p-2 border border-gray-300 rounded" value={size} onChange={(e) => setSize(e.target.value ? Number(e.target.value) : 25)}>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="60">60</option>
                        <option value="80">80</option>
                        <option value="100">100</option>
                    </select>
                </label>

                <label>
                    Sort by:
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="none">None</option>
                        <option value="age-asc">Age (youngest first)</option>
                        <option value="age-desc">Age (oldest first)</option>
                        <option value="breed-asc">Alphabetical (breed)</option>
                        <option value="breed-desc">Reverse alphabetical (breed)</option>
                        <option value="name-asc">Alphabetical (name)</option>
                        <option value="name-desc">Reverse alphabetical (name)</option>
                    </select>
                </label>
                <div className="mt-4 flex justify-center space-x-5">
    <button type="submit" className="p-4 bg-orange-500 text-white rounded hover:bg-orange-600">Search</button>
    <button type="button" className="p-4 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={handleReset}>Reset</button>
</div>
</div>
        </form>
            {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
        <div className="mt-4 space-y-2">
     
        {dogsOnCurrentPage.map(dog => {
            console.log(`Zip Code for ${dog.name}:`, dog.zip_code);
            return (
            <div key={dog.id} className="max-w-xl mx-auto p-4 border border-gray-300 rounded bg-white text-center">
                <p className="font-bold">{dog.name}</p>
                <p>{dog.breed} | Age {dog.age}</p>
                <p>Zip Code: {dog.zip_code} </p>
                <div className="flex justify-center">
        <img src={dog.img} alt={dog.name} className="w-64 h-64 object-cover transition-transform duration-200 ease-in hover:scale-110" />
      </div>
            </div>
            );
            })}
                    
            </div>
            
            <div className="flex justify-center items-center mt-4">
    {dogs.length > 0 && totalPages > 1 && (
        <>
            <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>  
            <div className="flex flex-wrap justify-center space-x-2 mx-2">
                {Array.from({length: totalPages}, (_, i) => (
                    <button
                        key={i}
                        className={`px-2 py-1 border rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-900 text-blue-500'}`}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </>
    )}
</div>
            </div>
        )

};         

export default DogSearch;
