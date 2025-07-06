import React, { Suspense } from 'react';
import SideBar from '@/components/Category/Sidebar';
import { getSession } from '@/lib/session';

async function SidebarLoader({ categoryName }: { categoryName?: string }) {
    const session = await getSession();
    return <SideBar categoryName={categoryName} session={session} />;
}

export default function CategoriesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-1 h-full mt-4 justify-center">
            <div className="relative">
                {/* Sidebar fixe qui ne dépend pas des paramètres de route */}
                <div className="absolute -translate-x-full">
                    <Suspense fallback={<div>Chargement sidebar...</div>}>
                        <SidebarLoader />
                    </Suspense>
                </div>

                {children}
            </div>
        </div>
    );
}