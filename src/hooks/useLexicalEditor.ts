// hooks/useLexicalEditor.ts
import { useCallback, useState } from 'react';
import { EditorState, LexicalEditor } from 'lexical';

export interface UseLexicalEditorReturn {
    editorState: EditorState | null;
    editor: LexicalEditor | null;
    handleChange: (editorState: EditorState, editor: LexicalEditor) => void;
    getContent: () => string;
    setContent: (content: string) => void;
    clearEditor: () => void;
}

export const useLexicalEditor = (): UseLexicalEditorReturn => {
    const [editorState, setEditorState] = useState<EditorState | null>(null);
    const [editor, setEditor] = useState<LexicalEditor | null>(null);

    const handleChange = useCallback((newEditorState: EditorState, newEditor: LexicalEditor): void => {
        setEditorState(newEditorState);
        setEditor(newEditor);
    }, []);

    const getContent = useCallback((): string => {
        if (!editorState) return '';

        return JSON.stringify(editorState.toJSON());
    }, [editorState]);

    const setContent = useCallback((content: string): void => {
        if (!editor) return;

        try {
            const newEditorState = editor.parseEditorState(content);
            editor.setEditorState(newEditorState);
        } catch (error) {
            console.error('Erreur lors du chargement du contenu:', error);
        }
    }, [editor]);

    const clearEditor = useCallback((): void => {
        if (!editor) return;

        editor.update(() => {
            const root = editor.getRootElement();
            if (root) {
                root.innerHTML = '';
            }
        });
    }, [editor]);

    return {
        editorState,
        editor,
        handleChange,
        getContent,
        setContent,
        clearEditor,
    };
};