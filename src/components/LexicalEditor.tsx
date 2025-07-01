// components/LexicalEditor.tsx
'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

// Nodes
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';

// Import du plugin de toolbar
import ToolbarPlugin from './ToolbarPlugin';

import type {
  LexicalEditorProps,
  EditorConfig,
  EditorTheme
} from '../types/lexical.types';
import { EditorState, LexicalEditor as LexicalEditorInstance } from 'lexical';

// Plugin pour gérer les changements d'état
const OnChangePlugin: React.FC<{
  onChange?: (editorState: EditorState, editor: LexicalEditorInstance) => void;
}> = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onChange) return;

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState, editor);
    });

    return unregister;
  }, [editor, onChange]);

  return null;
};

// Thème par défaut avec classes CSS améliorées
const defaultTheme: EditorTheme = {
  root: 'lexical-editor',
  paragraph: 'lexical-paragraph',
  text: {
    bold: 'lexical-text-bold',
    italic: 'lexical-text-italic',
    underline: 'lexical-text-underline',
    strikethrough: 'lexical-text-strikethrough',
    code: 'lexical-text-code',
  },
  heading: {
    h1: 'lexical-heading-h1',
    h2: 'lexical-heading-h2',
    h3: 'lexical-heading-h3',
    h4: 'lexical-heading-h4',
    h5: 'lexical-heading-h5',
    h6: 'lexical-heading-h6',
  },
  list: {
    ol: 'lexical-list-ol',
    ul: 'lexical-list-ul',
    listitem: 'lexical-list-item',
  },
  quote: 'lexical-quote',
  code: 'lexical-code',
  link: 'lexical-link',
};

// Configuration par défaut de l'éditeur
const createEditorConfig = (
  onError: (error: Error, editor: LexicalEditorInstance) => void
): EditorConfig => ({
  namespace: 'lexical-editor',
  theme: defaultTheme,
  onError,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
});

// Composant principal
const LexicalEditor: React.FC<LexicalEditorProps> = ({
  placeholder = 'Entrez votre texte...',
  onChange,
  onError,
  className = '',
  readOnly = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Gestionnaire d'erreur par défaut
  const handleError = useCallback(
    (error: Error, editor: LexicalEditorInstance): void => {
      console.error('Erreur Lexical:', error);
      console.error('Erreur Lexical:', editor);
      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  // Configuration de l'éditeur
  const editorConfig = React.useMemo(
    () => createEditorConfig(handleError),
    [handleError]
  );

  // Styles CSS intégrés pour l'éditeur
  const editorStyles: React.CSSProperties = {
    minHeight: '200px',
    resize: 'vertical',
    fontSize: '14px',
    position: 'relative',
    tabSize: 1,
    outline: '0px solid transparent',
    padding: '12px',
    border: '0', // Supprimé car géré par le conteneur
    borderRadius: '0 0 6px 6px',
  };

  const placeholderStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#64748b',
    overflow: 'hidden',
    position: 'absolute',
    textOverflow: 'ellipsis',
    top: '12px',
    left: '12px',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  return (
    <div className={`lexical-editor-container border border-gray-300 rounded-lg overflow-hidden ${className}`} ref={editorRef}>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="lexical-editor-inner">
          {/* Barre d'outils */}
          {!readOnly && <ToolbarPlugin />}

          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="lexical-content-editable focus:outline-none"
                style={editorStyles}
                aria-placeholder={placeholder}
                placeholder={
                  <div
                    className="lexical-placeholder"
                    style={placeholderStyles}
                  >
                    {placeholder}
                  </div>
                }
                spellCheck={true}
                readOnly={readOnly}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          {onChange && <OnChangePlugin onChange={onChange} />}
        </div>

        {/* Styles CSS globaux pour l'éditeur */}
        <style jsx global>{`
          .lexical-editor {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .lexical-paragraph {
            margin: 0 0 8px 0;
            line-height: 1.6;
          }
          
          .lexical-text-bold {
            font-weight: bold;
          }
          
          .lexical-text-italic {
            font-style: italic;
          }
          
          .lexical-text-underline {
            text-decoration: underline;
          }
          
          .lexical-text-strikethrough {
            text-decoration: line-through;
          }
          
          .lexical-text-code {
            background-color: #f1f5f9;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
          }
          
          .lexical-heading-h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 16px 0 12px 0;
            line-height: 1.2;
          }
          
          .lexical-heading-h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 14px 0 10px 0;
            line-height: 1.3;
          }
          
          .lexical-heading-h3 {
            font-size: 1.25em;
            font-weight: bold;
            margin: 12px 0 8px 0;
            line-height: 1.4;
          }
          
          .lexical-heading-h4 {
            font-size: 1.1em;
            font-weight: bold;
            margin: 10px 0 6px 0;
            line-height: 1.4;
          }
          
          .lexical-heading-h5 {
            font-size: 1em;
            font-weight: bold;
            margin: 8px 0 4px 0;
            line-height: 1.5;
          }
          
          .lexical-heading-h6 {
            font-size: 0.9em;
            font-weight: bold;
            margin: 6px 0 2px 0;
            line-height: 1.5;
          }
          
          .lexical-list-ol {
            padding-left: 24px;
            margin: 8px 0;
          }
          
          .lexical-list-ul {
            padding-left: 24px;
            margin: 8px 0;
          }
          
          .lexical-list-item {
            margin: 4px 0;
            line-height: 1.5;
          }
          
          .lexical-quote {
            border-left: 4px solid #e2e8f0;
            padding-left: 16px;
            margin: 16px 0;
            font-style: italic;
            color: #64748b;
          }
          
          .lexical-code {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin: 12px 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            line-height: 1.4;
            overflow-x: auto;
          }
          
          .lexical-link {
            color: #3b82f6;
            text-decoration: underline;
          }
          
          .lexical-link:hover {
            color: #1d4ed8;
          }
          
          .lexical-content-editable[data-lexical-editor] p {
            margin: 0 0 8px 0;
            line-height: 1.6;
          }
          
          .lexical-content-editable[data-lexical-editor] p:last-child {
            margin-bottom: 0;
          }
          
          .lexical-content-editable[data-lexical-editor]:focus {
            outline: none;
          }
          
          .lexical-editor-container:focus-within {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          /* Styles pour les éléments alignés */
          .lexical-paragraph[style*="text-align: center"],
          .lexical-heading-h1[style*="text-align: center"],
          .lexical-heading-h2[style*="text-align: center"],
          .lexical-heading-h3[style*="text-align: center"] {
            text-align: center;
          }
          
          .lexical-paragraph[style*="text-align: right"],
          .lexical-heading-h1[style*="text-align: right"],
          .lexical-heading-h2[style*="text-align: right"],
          .lexical-heading-h3[style*="text-align: right"] {
            text-align: right;
          }
        `}</style>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;