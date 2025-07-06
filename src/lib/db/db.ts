// /lib/db.ts
import { PrismaClient } from '@prisma/client';

// Déclare la variable globale pour la compatibilité avec TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Recherche une instance existante sur l'objet global, sinon en crée une nouvelle.
const db = globalThis.prisma ?? new PrismaClient({
  // Il est recommandé de simplifier les logs en production
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error'],
});

// Assigne l'instance à la variable globale.
// En production, cela se produit une fois au démarrage du serveur.
// En développement, cela préserve l'instance à travers les rechargements à chaud.
globalThis.prisma = db;

export default db;