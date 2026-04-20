"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Code, 
  Quote, 
  CheckSquare,
  Minus
} from 'lucide-react';

interface CommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: ({ editor, range }: { editor: any; range: any }) => void;
}

export const getSuggestionItems = () => {
  return [
    {
      title: 'Text',
      description: 'Just start writing with plain text.',
      icon: <Type size={18} />,
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('paragraph')
          .run();
      },
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      icon: <Heading1 size={18} />,
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: <Heading2 size={18} />,
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .run();
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      icon: <Heading3 size={18} />,
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 3 })
          .run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      icon: <List size={18} />,
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleBulletList()
          .run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleOrderedList()
          .run();
      },
    },
    {
      title: 'Blockquote',
      description: 'Capture a quote.',
      icon: <Quote size={18} />,
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleBlockquote()
          .run();
      },
    },
    {
      title: 'Code Block',
      description: 'Write some code.',
      icon: <Code size={18} />,
      command: ({ editor, range }: { editor: any; range: any }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleCodeBlock()
          .run();
      },
    },
    {
        title: 'Divider',
        description: 'Insert a horizontal rule.',
        icon: <Minus size={18} />,
        command: ({ editor, range }: { editor: any; range: any }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHorizontalRule()
            .run();
        },
      },
  ];
};

export const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="z-50 h-auto overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl max-h-80 w-72 scrollbar-hide no-scrollbar">
      {props.items.length > 0 ? (
        props.items.map((item: any, index: number) => (
          <button
            key={index}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
              index === selectedIndex ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50'
            }`}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
              {item.icon}
            </div>
            <div>
              <div className="font-medium text-zinc-200">{item.title}</div>
              <div className="text-[10px] text-zinc-500">{item.description}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="p-3 text-sm text-zinc-500">No results found</div>
      )}
    </div>
  );
});

CommandList.displayName = 'CommandList';
