// components/ToolbarPlugin.tsx
'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    UNDO_COMMAND,
    REDO_COMMAND,
    $createParagraphNode,
} from 'lexical';
import {
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
    $createQuoteNode,
    $createHeadingNode,
} from '@lexical/rich-text';
import {
    $setBlocksType,
} from '@lexical/selection';
import {
    TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import {
    INSERT_HORIZONTAL_RULE_COMMAND,
} from '@lexical/react/LexicalHorizontalRuleNode';

import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    ListIcon,
    ListOrderedIcon,
    QuoteIcon,
    LinkIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    CodeIcon,
    MinusIcon,
    UndoIcon,
    RedoIcon,
    TypeIcon,
    SuperscriptIcon,
    SubscriptIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState<boolean>(false);
    const [linkUrl, setLinkUrl] = useState<string>('');

    const formatQuote = (): void => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    };

    const formatHeading = (headingSize: 'h1' | 'h2' | 'h3'): void => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(headingSize));
            }
        });
    };

    const formatParagraph = (): void => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };

    const insertLink = (): void => {
        if (linkUrl.trim()) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: linkUrl.trim() });
            setLinkUrl('');
            setIsLinkDialogOpen(false);
        }
    };

    const handleLinkClick = (): void => {
        setIsLinkDialogOpen(true);
    };

    const insertHorizontalRule = (): void => {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    };

    return (
        <>
            <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
                {/* Undo/Redo */}
                <button
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Annuler"
                    type="button"
                >
                    <UndoIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Refaire"
                    type="button"
                >
                    <RedoIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Block formatting */}
                <button
                    onClick={formatParagraph}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Paragraphe normal"
                    type="button"
                >
                    <TypeIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => formatHeading('h1')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Titre 1"
                    type="button"
                >
                    <Heading1Icon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => formatHeading('h2')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Titre 2"
                    type="button"
                >
                    <Heading2Icon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => formatHeading('h3')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Titre 3"
                    type="button"
                >
                    <Heading3Icon className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Text formatting */}
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Gras"
                    type="button"
                >
                    <BoldIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Italique"
                    type="button"
                >
                    <ItalicIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Souligné"
                    type="button"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Barré"
                    type="button"
                >
                    <StrikethroughIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Code inline"
                    type="button"
                >
                    <CodeIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Exposant"
                    type="button"
                >
                    <SuperscriptIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Indice"
                    type="button"
                >
                    <SubscriptIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Lists and blocks */}
                <button
                    onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Liste à puces"
                    type="button"
                >
                    <ListIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Liste numérotée"
                    type="button"
                >
                    <ListOrderedIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={formatQuote}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Citation"
                    type="button"
                >
                    <QuoteIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Links and special elements */}
                <button
                    onClick={handleLinkClick}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Insérer un lien"
                    type="button"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>

                <button
                    onClick={insertHorizontalRule}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Ligne horizontale"
                    type="button"
                >
                    <MinusIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Link Dialog */}
            {isLinkDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-medium mb-4">Insérer un lien</h3>
                        <input
                            type="url"
                            value={linkUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
                            placeholder="https://exemple.com"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            autoFocus
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter') {
                                    insertLink();
                                } else if (e.key === 'Escape') {
                                    setIsLinkDialogOpen(false);
                                    setLinkUrl('');
                                }
                            }}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsLinkDialogOpen(false);
                                    setLinkUrl('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                type="button"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={insertLink}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                type="button"
                                disabled={!linkUrl.trim()}
                            >
                                Insérer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}