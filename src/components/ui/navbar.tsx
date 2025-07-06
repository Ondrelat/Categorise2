import React from "react";

import { getSession } from '@/lib/session';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from '@/auth';

import '@/app/fontButterfly.css';

// Composant LoginButton
function LoginButton() {
    return (
        <Link href="/sign-in">
            <button className="bg-blue-600 text-white font-bold py-3 px-5 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition duration-200">
                Se connecter
            </button>
        </Link>
    );
}

// Composant LogoutButton
function LogoutButton() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
            }}
        >
            <button
                type="submit"
                className="bg-red-600 text-white font-bold py-3 px-5 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition duration-200"
            >
                Se déconnecter
            </button>
        </form>
    );
}

// Define a User type or interface
interface UserProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

function User({ user }: UserProps) {
    return (
        <div className="flex items-center space-x-3">
            <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-gray-700">
                    {user?.name || user?.email}
                </span>
                <span className="text-xs text-gray-500">
                    Connecté
                </span>
            </div>
            {user?.image && (
                <Image
                    src={user.image}
                    alt="Photo de profil"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            )}
        </div>
    );
}


export default async function Navbar() {


    const session = await getSession();
    const user = session?.user

    return (
        <nav className="bg-gray-50 text-gray-800 py-5 shadow-md">
            <div className="flex flex-row items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center lg:justify-start space-x-6">
                    {/* mobile - Logo uniquement */}
                    <div className="block lg:hidden">
                        <Image src="/favicon.ico" width={35} height={35} alt="Icone de stylo" className="rounded-full" />
                    </div>
                    {/* desktop - Logo + titre */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-4">
                        <Image src="/favicon.ico" width={50} height={50} alt="Icone de stylo" className="rounded-full" />
                        <Link href="/">
                            <h1 className="font-bold text-3xl text-[min(7vw,2.5rem)] leading-tight transition-all duration-300 hover:text-blue-600">
                                Categorise
                            </h1>
                        </Link>
                    </div>
                    {/* mobile - titre seul */}
                    <div className="block lg:hidden">
                        <Link href="/">
                            <h1 className="font-bold text-2xl leading-tight transition-all duration-300 hover:text-blue-600">
                                Categorise
                            </h1>
                        </Link>
                    </div>
                </div>

                {/* Navigation mobile */}
                <div className="block lg:hidden">
                    <div className="flex items-center space-x-2">
                        {user ? (
                            <>
                                <User user={user} />
                                <LogoutButton />
                            </>
                        ) : (
                            <LoginButton />
                        )}
                    </div>
                </div>

                {/* Navigation desktop */}
                <div className="hidden lg:block">
                    <div className="flex items-center space-x-4">
                        <Link href="/contact">
                            <button className="bg-white text-gray-700 font-bold py-3 px-5 rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-200">
                                Contact
                            </button>
                        </Link>
                        {user ? (
                            <>
                                <User user={user} />
                                <LogoutButton />
                            </>
                        ) : (
                            <LoginButton />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}