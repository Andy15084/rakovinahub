"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Vložte obsah článku... Môžete vložiť text z Wordu alebo iného editora vrátane obrázkov.",
  className,
  minHeight = "400px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none min-h-[300px] px-4 py-4 focus:outline-none",
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const src = e.target?.result as string;
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({ src })
                  )
                );
              };
              reader.readAsDataURL(file);
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    const handler = () => onChange(editor.getHTML());
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, onChange]);

  const addImage = useCallback(() => {
    const url = window.prompt("Zadajte URL obrázka:");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/80 px-3 py-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Tučné"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Kurzíva"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Nadpis 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Nadpis 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Odrážky"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Číslovaný zoznam"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Citácia"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Späť">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Dopredu">
          <Redo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Pridať obrázok">
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <div style={{ minHeight }} className="prose-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "rounded-lg p-2 transition-colors",
        active
          ? "bg-orange-100 text-orange-700"
          : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
      )}
    >
      {children}
    </button>
  );
}
