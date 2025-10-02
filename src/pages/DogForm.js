import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { vibrate, showToast } from '../utils/helpers';

const DogForm = () => {
    const navigate = useNavigate();
    const { dogId } = useParams();
    const { getDogById, addDog, updateDog } = useAppContext();

    const dog = dogId ? getDogById(dogId) : null;
    const title = dog ? 'Edit Dog Profile' : 'Add a New Dog';

    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        age: '',
        vet: '',
        allergies: '',
        likes: '',
        dislikes: '',
        notes: '',
        avatar: '🐶'
    });

    useEffect(() => {
        if (dog) {
            setFormData({
                name: dog.name || '',
                breed: dog.breed || '',
                age: dog.age || '',
                vet: dog.vet || '',
                allergies: dog.allergies || '',
                likes: dog.likes || '',
                dislikes: dog.dislikes || '',
                notes: dog.notes || '',
                avatar: dog.avatar || '🐶'
            });
        }
    }, [dog]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        vibrate();

        if (dog) {
            updateDog(dog.id, formData);
            showToast('Dog profile updated');
        } else {
            addDog(formData);
            showToast('Dog added successfully');
        }

        navigate('/dogs');
    };

    const handleBack = () => {
        vibrate();
        navigate('/dogs');
    };

    return (
        <div>
            <div className="page-header">
                <button className="back-btn" onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1>{title}</h1>
            </div>
            <form id="dog-form" className="space-y-4" onSubmit={handleSubmit}>
                <h3 className="font-semibold">Basic Info</h3>
                <div className="input-group">
                    <input
                        name="name"
                        type="text"
                        placeholder="Dog's Name"
                        required
                        className="input-field"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <input
                        name="breed"
                        type="text"
                        placeholder="Breed"
                        required
                        className="input-field"
                        value={formData.breed}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <input
                        name="age"
                        type="number"
                        placeholder="Age (years)"
                        required
                        className="input-field"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </div>
                <h3 className="font-semibold pt-2">Health & Care</h3>
                <div className="input-group">
                    <input
                        name="vet"
                        type="text"
                        placeholder="Veterinarian"
                        className="input-field"
                        value={formData.vet}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <input
                        name="allergies"
                        type="text"
                        placeholder="Allergies"
                        className="input-field"
                        value={formData.allergies}
                        onChange={handleChange}
                    />
                </div>
                <h3 className="font-semibold pt-2">Behavior</h3>
                <div className="input-group">
                    <input
                        name="likes"
                        type="text"
                        placeholder="Likes (e.g., toys, parks)"
                        className="input-field"
                        value={formData.likes}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <input
                        name="dislikes"
                        type="text"
                        placeholder="Dislikes (e.g., loud noises)"
                        className="input-field"
                        value={formData.dislikes}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-full !mt-6">
                    Save Profile
                </button>
            </form>
        </div>
    );
};

export default DogForm;
