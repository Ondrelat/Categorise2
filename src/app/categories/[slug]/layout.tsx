// src/app/categories/[slug]/layout.tsx
import { ReactNode } from 'react';

export default async function CategoryLayout({
  children,
  information,
  ranking,
  tutorials,
  forum,
  params,
}: {
  children: ReactNode;
  information: ReactNode;
  ranking: ReactNode;
  tutorials: ReactNode;
  forum: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  console.log("params slug:", slug);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col">
        <div className="mb-8">
          {children}
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {information}
            {ranking}
            {tutorials}
          </div>
          <div className="flex flex-col space-y-6">
            {forum}
          </div>
        </div>
      </div>
    </div>
  );
}