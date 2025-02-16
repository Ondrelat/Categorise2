import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/src/lib/prisma" 
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

const googleId = process.env.GOOGLE_ID;
const googleSecret = process.env.GOOGLE_SECRET;

if(!githubId || !githubSecret || !googleId || !googleSecret){
    throw new Error('Missing GITHUB_ID or GITHUB_SECRET environnement')
}

export const authConfig = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Email et mot de passe", // Changé ici
            credentials: {
                email: { 
                    label: "Email", 
                    type: "email", 
                    placeholder: "exemple@email.com" 
                },
                password: { 
                    label: "Mot de passe", 
                    type: "password" 
                }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Email et mot de passe requis');
                    }
            
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    });
            
                    if (!user || !user.password) {
                        throw new Error('Email ou mot de passe incorrect');
                    }
            
                    const isPasswordValid = await compare(credentials.password, user.password);
            
                    if (!isPasswordValid) {
                        throw new Error('Email ou mot de passe incorrect');
                    }
            
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
            
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    } else {
                        throw new Error('Une erreur inattendue est survenue');
                    }
                }
            }
        }),
        GoogleProvider({
            clientId: googleId,
            clientSecret: googleSecret,
        }),
    ],
    pages: {
        signIn: '/auth/login' 
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                accessToken: token.accessToken,
            }
        }
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
} satisfies NextAuthOptions;

export default NextAuth(authConfig)