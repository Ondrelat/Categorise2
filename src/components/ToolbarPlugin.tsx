// components/ToolbarPlugin.tsx
'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
} from 'lexical';
import {
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
    $createQuoteNode,
} from '@lexical/rich-text';
import {
    $setBlocksType,
} from '@lexical/selection';

import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    ListIcon,
    ListOrderedIcon,
    QuoteIcon,
} from 'lucide-react';

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();

    const formatQuote = (): void => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className="p-2 rounded hover:bg-gray-200"
                title="Gras"
                type="button"
            >
                <BoldIcon className="w-5 h-5" />
            </button>

            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className="p-2 rounded hover:bg-gray-200"
                title="Italique"
                type="button"
            >
                <ItalicIcon className="w-5 h-5" />
            </button>

            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className="p-2 rounded hover:bg-gray-200"
                title="Souligné"
                type="button"
            >
                <UnderlineIcon className="w-5 h-5" />
            </button>

            <button
                onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                className="p-2 rounded hover:bg-gray-200"
                title="Liste à puces"
                type="button"
            >
                <ListIcon className="w-5 h-5" />
            </button>

            <button
                onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                className="p-2 rounded hover:bg-gray-200"
                title="Liste numérotée"
                type="button"
            >
                <ListOrderedIcon className="w-5 h-5" />
            </button>

            <button
                onClick={formatQuote}
                className="p-2 rounded hover:bg-gray-200"
                title="Citation"
                type="button"
            >
                <QuoteIcon className="w-5 h-5" />
            </button>


            {/* Exemple pour un lien : nécessite implémentation complète */}
            {/* <button
                onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: 'https://exemple.com' })}
                className="p-2 rounded hover:bg-gray-200"
                title="Lien"
                type="button"
            >
                <LinkIcon className="w-5 h-5" />
            </button> */}
        </div>
    );
}