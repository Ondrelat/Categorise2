// src/lib/api-client.ts
const API_BASE = '/api';

export const apiClient = {
  // Like article
  likeArticle: async (articleId: string, liked: boolean) => {
    const response = await fetch(`${API_BASE}/article/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, liked }),
      credentials: 'include', // <-- Nécessaire pour les cookies
    });
    
    if (!response.ok) {
      throw new Error('Failed to like article');
    }
    
    return response.json();
  },

  // Rate article
  NoteArticle: async (articleId: string, rating: number) => {
    const response = await fetch(`${API_BASE}/article/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, rating }),
      credentials: 'include', // <-- Nécessaire pour les cookies
    });
    
    if (!response.ok) {
      throw new Error('Failed to rate article');
    }
    
    return response.json();
  },

// Add to my list
addToMyList: async (articleId: string, categoryName: string) => {
  const response = await fetch(`${API_BASE}/mylist/manage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articleId, isAdding: true, categoryName }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to add to list');
  }

  return response.json();
},

// Remove from my list
removeFromMyList: async (articleId: string, categoryName: string) => {
  const response = await fetch(`${API_BASE}/mylist/manage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articleId, isAdding: false, categoryName }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to remove from list');
  }

  return response.json();
},

  // Reorder my list
  reorderMyList: async (articleIds: string[], categoryName: string) => {
    const response = await fetch(`${API_BASE}/mylist/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleIds, categoryName }),
      credentials: 'include', // <-- Nécessaire pour les cookies
    });
    
    if (!response.ok) {
      throw new Error('Failed to reorder list');
    }
    
    return response.json();
  },
};

// Hook personnalisé pour gérer les erreurs
export const useApiCall = () => {
  const handleApiCall = async (apiCall: () => Promise<any>) => {
    try {
      const result = await apiCall();
      if (!result.success) {
        throw new Error(result.error || 'API call failed');
      }
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return { handleApiCall };
};