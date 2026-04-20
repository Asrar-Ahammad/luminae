"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useCallback, useEffect, useState } from "react";
import { 
  Bold, Italic, 
  Highlighter, Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSuggestionItems, CommandList } from "./SlashCommand";

const lowlight = createLowlight(common);

const SlashCommand = Extension.create({
  name: "slashCommand",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

interface JournalEditorProps {
  content: any;
  onUpdate: (json: any) => void;
  editable: boolean;
}

export default function JournalEditor({ content, onUpdate, editable }: JournalEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Typography,
      Placeholder.configure({
        placeholder: "Start writing your thoughts... (Type '/' for commands)",
      }),
      CharacterCount,
      Highlight.configure({ multicolor: true }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = new ReactRenderer(CommandList, {
                  props,
                  editor: props.editor,
                });

                if (!props.clientRect) {
                  return;
                }

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },
              onUpdate(props: any) {
                component.updateProps(props);

                if (!props.clientRect) {
                  return;
                }

                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },
              onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                  popup[0].hide();
                  return true;
                }
                return component.ref?.onKeyDown(props);
              },
              onExit() {
                popup[0].destroy();
                component.destroy();
              },
            };
          },
        },
      }),
    ],
    content: content || {},
    editable: editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const words = editor.storage.characterCount.words();
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200));
      onUpdate(json);
    },
  });

  useEffect(() => {
    if (editor && content) {
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="relative w-full min-h-[500px]">
      {editor && editable && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-1.5 rounded hover:bg-zinc-800 transition-colors",
              editor.isActive("bold") ? "text-white bg-zinc-800" : "text-zinc-400"
            )}
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "p-1.5 rounded hover:bg-zinc-800 transition-colors",
              editor.isActive("italic") ? "text-white bg-zinc-800" : "text-zinc-400"
            )}
          >
            <Italic size={16} />
          </button>
          <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              "p-1.5 rounded hover:bg-zinc-800 transition-colors",
              editor.isActive("highlight") ? "text-white bg-zinc-800" : "text-zinc-400"
            )}
          >
            <Highlighter size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              "p-1.5 rounded hover:bg-zinc-800 transition-colors",
              editor.isActive("code") ? "text-white bg-zinc-800" : "text-zinc-400"
            )}
          >
            <Code size={16} />
          </button>
        </BubbleMenu>
      )}

      <EditorContent 
        editor={editor} 
        className="prose prose-zinc dark:prose-invert max-w-none min-h-[500px] border border-zinc-800/50 rounded-xl p-6 focus-within:border-zinc-700 transition-colors bg-zinc-900/20"
      />

      <div className="fixed bottom-6 right-6 flex items-center gap-4 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800 text-xs text-zinc-500 font-medium z-40">
        <span>{wordCount} words</span>
        <span className="w-1 h-1 rounded-full bg-zinc-800" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
}
