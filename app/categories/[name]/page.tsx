import React from 'react';
import { notFound, redirect } from 'next/navigation';

import { getCategoryByName } from '@/app/lib/categories';
import dynamic from "next/dynamic";

const FilmPage = dynamic(() => import("@/app/components/Cinema/FilmPage"), { ssr: true });

export default async function CategoryPage({ params }: { params: { name: string } }) {


}

