'use client';

import React from 'react';
import { MessageCircle, Trophy, BookOpen, Eye } from 'lucide-react';

interface CategoryLayoutProps {
  children: React.ReactNode;
  information: React.ReactNode;
  ranking: React.ReactNode;
  tutorials: React.ReactNode;
  forum: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default function CategoryLayout({
  children,
  information,
  ranking,
  tutorials,
  forum,
  params
}: CategoryLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col">
        {/* Header principal avec les informations de la catégorie */}
        <div className="mb-8">
          {children}
        </div>

        {/* Grid responsive pour les sections, avec flex-1 pour remplir la hauteur restante */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale : flex-col pour que les cards s'étendent */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {information}
            {ranking}
            {tutorials}
          </div>

          {/* Sidebar : flex-col pour l'extension */}
          <div className="flex flex-col space-y-6">
            {forum}
          </div>
        </div>
      </div>
    </div>
  );
}