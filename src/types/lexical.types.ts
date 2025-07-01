// types/lexical.types.ts
import { EditorState, LexicalEditor, Klass, LexicalNode } from 'lexical';

export interface EditorTheme {
    root?: string;
    paragraph?: string;
    text?: {
        bold?: string;
        italic?: string;
        underline?: string;
        strikethrough?: string;
        subscript?: string;
        superscript?: string;
        code?: string;
    };
    heading?: {
        h1?: string;
        h2?: string;
        h3?: string;
        h4?: string;
        h5?: string;
        h6?: string;
    };
    list?: {
        ol?: string;
        ul?: string;
        listitem?: string;
    };
    quote?: string;
    code?: string;
    link?: string;
    table?: string;
    tableRow?: string;
    tableCell?: string;
}

export interface EditorConfig {
    namespace: string;
    theme: EditorTheme;
    onError: (error: Error, editor: LexicalEditor) => void;
    nodes: Array<Klass<LexicalNode>>;
}

export interface LexicalEditorProps {
    placeholder?: string;
    onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
    onError?: (error: Error) => void;
    className?: string;
    readOnly?: boolean;
}