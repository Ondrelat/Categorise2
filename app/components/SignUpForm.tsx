'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function FormulaireInscription() {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        motDePasse: ''
    });
    const [erreur, setErreur] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.nom,
                    email: formData.email,
                    password: formData.motDePasse
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Une erreur est survenue');
            }

            // Connexion automatique après l'inscription
            await signIn('credentials', {
                email: formData.email,
                password: formData.motDePasse,
                callbackUrl: '/'
            });
        } catch (err) {
            if (err instanceof Error) {
                setErreur(err.message);
            } else {
                setErreur('Une erreur inattendue est survenue');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {erreur && <p className="text-red-500 text-sm font-medium">{erreur}</p>}
            
            <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom
                </label>
                <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Adresse e-mail
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>

            <div>
                <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                </label>
                <input
                    type="password"
                    id="motDePasse"
                    value={formData.motDePasse}
                    onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    minLength={8}
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
                Créer mon compte
            </button>
        </form>
    );
}