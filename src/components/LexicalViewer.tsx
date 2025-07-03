"use client";

import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { $getRoot, SerializedLexicalNode } from "lexical";
import { $generateNodesFromSerializedNodes } from "@lexical/clipboard";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { LinkNode, AutoLinkNode } from "@lexical/link";

type SerializedEditorState = {
    root: {
        children: SerializedLexicalNode[];
        direction?: string;
        format?: string;
        indent?: number;
        type: string;
        version: number;
    };
};

function ReadOnlyPlugin({ initialJson }: { initialJson: SerializedEditorState | string | null }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        console.log("=== DEBUG LEXICAL VIEWER ===");
        console.log("initialJson:", initialJson);
        console.log("initialJson type:", typeof initialJson);

        // Parse le JSON s'il est en string
        let parsedJson: SerializedEditorState;
        try {
            parsedJson = typeof initialJson === 'string' ? JSON.parse(initialJson) : initialJson;
        } catch (error: unknown) {
            console.error("Erreur parsing JSON:", error);
            return;
        }

        console.log("parsedJson:", parsedJson);
        console.log("parsedJson.root:", parsedJson?.root);
        console.log("parsedJson.root.children:", parsedJson?.root?.children);
        console.log("parsedJson.root.children length:", parsedJson?.root?.children?.length);
        console.log("===============================");

        editor.update(() => {
            try {
                const root = $getRoot();
                root.clear();

                if (parsedJson?.root?.children && Array.isArray(parsedJson.root.children)) {
                    console.log("Génération des nœuds...");
                    const nodes = $generateNodesFromSerializedNodes(parsedJson.root.children);
                    console.log("Nœuds générés:", nodes);
                    root.append(...nodes);
                    console.log("Nœuds ajoutés avec succès");
                } else {
                    console.warn("Pas de contenu à afficher - children non valides");
                }
            } catch (error: unknown) {
                console.error("Erreur lors de la génération des nœuds Lexical:", error);
            }
        });
    }, [editor, initialJson]);

    return null;
}

export default function LexicalViewer({ initialJson }: { initialJson: SerializedEditorState | string }) {
    const config = {
        namespace: "ReadOnlyEditor",
        theme: {
            paragraph: "mb-4",
            heading: {
                h1: "text-3xl font-bold mb-4",
                h2: "text-2xl font-bold mb-3",
                h3: "text-xl font-bold mb-2",
                h4: "text-lg font-bold mb-2",
                h5: "text-base font-bold mb-1",
                h6: "text-sm font-bold mb-1",
            },
            text: {
                bold: "font-bold",
                italic: "italic",
                underline: "underline",
                strikethrough: "line-through",
                underlineStrikethrough: "underline line-through",
                code: "font-mono bg-gray-100 px-1 py-0.5 rounded text-sm",
                highlight: "bg-yellow-200",
                subscript: "text-xs align-sub",
                superscript: "text-xs align-super",
            },
            link: "text-blue-600 hover:text-blue-800 underline",
            list: {
                listitem: "ml-4",
                listitemChecked: "ml-4 line-through",
                listitemUnchecked: "ml-4",
                nested: {
                    listitem: "ml-8",
                },
                ol: "list-decimal ml-6 mb-4",
                ul: "list-disc ml-6 mb-4",
            },
            quote: "border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4",
            code: "bg-gray-100 rounded-md p-4 font-mono text-sm mb-4 overflow-x-auto",
            codeHighlight: {
                atrule: "text-blue-600",
                attr: "text-green-600",
                boolean: "text-purple-600",
                builtin: "text-red-600",
                cdata: "text-gray-600",
                char: "text-green-600",
                class: "text-blue-600",
                className: "text-blue-600",
                comment: "text-gray-500 italic",
                constant: "text-purple-600",
                deleted: "text-red-600",
                doctype: "text-gray-600",
                entity: "text-orange-600",
                function: "text-blue-600",
                important: "text-red-600 font-bold",
                inserted: "text-green-600",
                keyword: "text-purple-600 font-semibold",
                namespace: "text-blue-600",
                number: "text-orange-600",
                operator: "text-gray-700",
                prolog: "text-gray-600",
                property: "text-blue-600",
                punctuation: "text-gray-700",
                regex: "text-green-600",
                selector: "text-blue-600",
                string: "text-green-600",
                symbol: "text-orange-600",
                tag: "text-red-600",
                url: "text-blue-600 underline",
                variable: "text-orange-600",
            },
            table: "border-collapse border border-gray-300 w-full mb-4",
            tableCell: "border border-gray-300 px-3 py-2",
            tableCellHeader: "border border-gray-300 px-3 py-2 bg-gray-100 font-semibold",
            tableRow: "border-b border-gray-300",
            tableRowAlt: "border-b border-gray-300 bg-gray-50",
            image: "max-w-full h-auto rounded-lg shadow-md mb-4",
            mark: "bg-yellow-300 px-1 rounded",
            hr: "border-0 border-t-2 border-gray-300 my-6",
        },
        onError: (error: Error) => console.error("Erreur Lexical:", error),
        editable: false,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            LinkNode,
            AutoLinkNode,
        ], // Support de tous les nœuds de base
    };

    return (
        <LexicalComposer initialConfig={config}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable className="prose max-w-none border p-4 rounded bg-white focus:outline-none" />
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <ReadOnlyPlugin initialJson={initialJson} />
        </LexicalComposer>
    );
}