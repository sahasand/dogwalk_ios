import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate } from '../utils/helpers';

const Dogs = () => {
    const navigate = useNavigate();
    const { dogs } = useAppContext();

    const handleEditDog = (dogId) => {
        vibrate();
        navigate(`/dogs/edit/${dogId}`);
    };

    const handleAddDog = () => {
        vibrate();
        navigate('/dogs/new');
    };

    return (
        <div>
            <div className="page-header">
                <div className="placeholder"></div>
                <h1>My Dogs</h1>
            </div>
            <div className="space-y-4" id="dog-list-container">
                {dogs.map(dog => (
                    <div key={dog.id} className="glass-card p-4 flex items-center gap-4">
                        <span className="text-5xl">{dog.avatar}</span>
                        <div className="flex-grow">
                            <p className="font-bold text-lg text-white">{dog.name}</p>
                            <p className="text-sm text-soft">{dog.breed}, {dog.age} years old</p>
                        </div>
                        <button
                            className="btn-secondary px-3 py-2 text-sm rounded-lg dog-edit-btn"
                            onClick={() => handleEditDog(dog.id)}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
            <button id="btn-add-dog" className="btn btn-secondary w-full mt-6" onClick={handleAddDog}>
                Add New Dog
            </button>
        </div>
    );
};

export default Dogs;
