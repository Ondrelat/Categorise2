'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LoginPage() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [shake, setShake] = useState(false);
   const googleIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIyLjU2IDEyLjI1Yy0uMDEtLjU5LS4wNS0xLjE1LS4xMi0xLjY5SDEydjMuMTloNS44NWMtLjI1IDEuMzYtMS4wNCAyLjUyLTIuMjEgMy4zdi4wMWgyLjU4YTguNTIgOC41MiAwIDAgMCAyLjYyLTQuODh6IiBmaWxsPSIjNDI4NWY0Ii8+PHBhdGggZD0iTTEyIDIzYzIuOTcgMCA1LjQ2LS45OCA3LjI4LTIuNjZsLTIuNTgtMmMtLjcxLjQ4LTEuNjMuNzctMi43Ljc3LTIuMDcgMC0zLjgzLTEuNC00LjQ2LTMuMjhoLTIuNjZ2Mi4wN0E3Ljk5NyA3Ljk5NyAwIDAgMCAxMiAyM3oiIGZpbGw9IiMzNGE4NTMiLz48cGF0aCBkPSJNNy41NCAxNS44M2MtLjE2LS40OC0uMjUtMS4wMi0uMjUtMS41N3MuMDktMS4wOC4yNS0xLjU3VjEwLjYySDQuODhBNy45OTQgNy45OTQgMCAwIDAgNCAxNWMwIDEuNDUuMzkgMi44MyAxLjA3IDQuMDJsMi40Ny0zLjE5eiIgZmlsbD0iI2ZiYmMwNSIvPjxwYXRoIGQ9Ik0xMiA3LjU4Yy4zNyAwIC43MS4wNiAxLjAzLjE3bDIuNC0yLjRBNy45NyA3Ljk3IDAgMCAwIDEyIDVjLTIuODggMC01LjQgMS41Mi02LjgzIDMuNzhsMi41MSAyLjA3Yy42My0xLjg4IDIuMzktMy4yNyA0LjQ2LTMuMjd6IiBmaWxsPSIjZWE0MzM1Ii8+PC9zdmc+" 

   useEffect(() => {
       if (shake) {
           const timer = setTimeout(() => setShake(false), 500);
           return () => clearTimeout(timer);
       }
   }, [shake]);

   const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       const result = await signIn('credentials', {
           email,
           password,
           redirect: false
       });

       if (result?.error) {
           setError("Email ou mot de passe incorrect");
           setShake(true);
           setPassword('');
       } else {
           window.location.href = '/';
       }
   };

   return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <div className={`max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow ${shake ? 'animate-shake' : ''}`}>
               <div className="text-center">
                   <h2 className="text-3xl font-bold">Bienvenue</h2>
                   <p className="mt-2 text-gray-600">Connectez-vous ou créez un compte</p>
               </div>

               {error && (
                   <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                       {error}
                   </div>
               )}

               <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                   <div className="space-y-4">
                       <input
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="Adresse email"
                           className="w-full px-3 py-2 border rounded-md"
                           required
                       />
                       <input
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="Mot de passe"
                           className="w-full px-3 py-2 border rounded-md"
                           required
                       />
                   </div>

                   <button
                       type="submit"
                       className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                   >
                       Se connecter
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

                   <div className="mt-6 flex justify-center">
                       <button
                           onClick={() => signIn('google', { callbackUrl: '/' })}
                           className="flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 w-1/2"
                       >
                           <Image 
                               src={googleIcon}
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
                   Pas encore de compte ?{' '}
                   <a href="/auth/register" className="text-blue-600 hover:underline">
                       Créer un compte
                   </a>
               </p>
           </div>
       </div>
   );
}