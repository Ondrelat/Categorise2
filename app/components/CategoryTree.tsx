import React from 'react';
import { getCategories, getCategoryBySlug } from '../lib/categories';
import ClientCategoryTree from './ClientCategoryTree';

const CategoryTree = async () => {
    const categoriesSlug = await getCategoryBySlug("film");
    const categories = await getCategories();
    console.log("categories" + categories)
    console.log("categoriesSlug" + categoriesSlug)
    return <ClientCategoryTree categories={categories} />;
};

export default CategoryTree;