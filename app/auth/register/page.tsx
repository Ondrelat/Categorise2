'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const googleIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIyLjU2IDEyLjI1Yy0uMDEtLjU5LS4wNS0xLjE1LS4xMi0xLjY5SDEydjMuMTloNS44NWMtLjI1IDEuMzYtMS4wNCAyLjUyLTIuMjEgMy4zdi4wMWgyLjU4YTguNTIgOC41MiAwIDAgMCAyLjYyLTQuODh6IiBmaWxsPSIjNDI4NWY0Ii8+PHBhdGggZD0iTTEyIDIzYzIuOTcgMCA1LjQ2LS45OCA3LjI4LTIuNjZsLTIuNTgtMmMtLjcxLjQ4LTEuNjMuNzctMi43Ljc3LTIuMDcgMC0zLjgzLTEuNC00LjQ2LTMuMjhoLTIuNjZ2Mi4wN0E3Ljk5NyA3Ljk5NyAwIDAgMCAxMiAyM3oiIGZpbGw9IiMzNGE4NTMiLz48cGF0aCBkPSJNNy41NCAxNS44M2MtLjE2LS40OC0uMjUtMS4wMi0uMjUtMS41N3MuMDktMS4wOC4yNS0xLjU3VjEwLjYySDQuODhBNy45OTQgNy45OTQgMCAwIDAgNCAxNWMwIDEuNDUuMzkgMi44MyAxLjA3IDQuMDJsMi40Ny0zLjE5eiIgZmlsbD0iI2ZiYmMwNSIvPjxwYXRoIGQ9Ik0xMiA3LjU4Yy4zNyAwIC43MS4wNiAxLjAzLjE3bDIuNC0yLjRBNy45NyA3Ljk3IDAgMCAwIDEyIDVjLTIuODggMC01LjQgMS41Mi02LjgzIDMuNzhsMi41MSAyLjA3Yy42My0xLjg4IDIuMzktMy4yNyA0LjQ2LTMuMjd6IiBmaWxsPSIjZWE0MzM1Ii8+PC9zdmc+" 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            // Inscription
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify(formData),
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
                password: formData.password,
                callbackUrl: '/'
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Créer un compte</h2>
                    <p className="mt-2 text-gray-600">Rejoignez-nous pour commencer</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nom complet
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                minLength={8}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Ou continuer avec
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center"> {/* Modifié ici */}
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            className="flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 w-1/2" 
                        >
<Image 
    src={googleIcon}  // ou utilisez l'URL directement
    alt="Google"
    width={20} 
    height={20} 
    className="mr-2" 
/>
                            Google
                        </button>
                    </div>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Déjà un compte ?{' '}
                    <a href="/auth/login" className="text-blue-600 hover:underline">
                        Se connecter
                    </a>
                </p>
            </div>
        </div>
    );
}