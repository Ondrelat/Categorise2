'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createArticle, type ActionState } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const initialState: ActionState = {
 success: false,
 message: '',
 errors: {},
};

function SubmitButton() {
 const { pending } = useFormStatus();
 
 return (
   <button
     type="submit"
     disabled={pending}
     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
   >
     {pending ? 'Création...' : 'Créer l&apos;article'}
   </button>
 );
}

export default function ArticleCreationForm({ categoryId }: { categoryId: string }) {
 const router = useRouter();
 const [state, formAction] = useFormState(createArticle, initialState);

 return (
   <form action={formAction} className="space-y-6 max-w-2xl mx-auto">
     {state.message && (
       <div className={`p-4 ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} border-l-4 border-current`}>
         {state.message}
       </div>
     )}

     <div className="space-y-4">
       <div>
         <label htmlFor="type" className="block text-sm font-medium text-gray-700">
           Type d&apos;article
         </label>
         <select
           id="type"
           name="type"
           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
           required
         >
           <option value="">Sélectionnez un type</option>
           <option value="classement">classement</option>
           <option value="forum">forum</option>
           <option value="apprentissage">apprentissage</option>
           <option value="media">media</option>
         </select>
         {state.errors?.type && (
           <p className="mt-1 text-sm text-red-600">{state.errors.type[0]}</p>
         )}
       </div>

       <input type="hidden" name="categoryId" value={categoryId} />

       <div>
         <label htmlFor="title" className="block text-sm font-medium text-gray-700">
           Titre
         </label>
         <input
           type="text"
           id="title"
           name="title"
           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
           required
         />
         {state.errors?.title && (
           <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>
         )}
       </div>

       <div>
         <label htmlFor="content" className="block text-sm font-medium text-gray-700">
           Contenu
         </label>
         <textarea
           id="content"
           name="content"
           rows={10}
           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
           required
         />
         {state.errors?.content && (
           <p className="mt-1 text-sm text-red-600">{state.errors.content[0]}</p>
         )}
       </div>

       <div className="flex justify-end gap-4">
         <button
           type="button"
           onClick={() => router.back()}
           className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
         >
           Annuler
         </button>
         <SubmitButton />
       </div>
     </div>
   </form>
 );
}