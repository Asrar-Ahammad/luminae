import React, { useCallback, useEffect, useState } from 'react'
import { Editor, Range } from '@tiptap/core'
import { SuggestionOptions } from '@tiptap/suggestion'
import { 
  Heading1, Heading2, Heading3, Text, List, ListOrdered, 
  Quote, Code, Minus 
} from 'lucide-react'

interface CommandItemProps {
  title: string
  description: string
  icon: React.ReactNode
  command: ({ editor, range }: { editor: Editor; range: Range }) => void
}

export const SlashCommandList = ({
  items,
  command,
}: {
  items: CommandItemProps[]
  command: any
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    },
    [command, items]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length)
        return true
      }
      if (e.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % items.length)
        return true
      }
      if (e.key === 'Enter') {
        selectItem(selectedIndex)
        return true
      }
      return false
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [items, selectedIndex, selectItem])

  return (
    <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
      {items.length > 0 ? (
        items.map((item, index) => (
          <button
            key={index}
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
              index === selectedIndex ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-zinc-500">{item.description}</p>
            </div>
          </button>
        ))
      ) : (
        <div className="px-2 py-2 text-sm text-zinc-500 font-medium">No results</div>
      )}
    </div>
  )
}

export const slashCommandSettings: Partial<SuggestionOptions> = {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: 'Heading 1',
        description: 'Big section heading.',
        icon: <Heading1 size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
      },
      {
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: <Heading2 size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
      },
      {
        title: 'Heading 3',
        description: 'Small section heading.',
        icon: <Heading3 size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
        },
      },
      {
        title: 'Text',
        description: 'Just start writing with plain text.',
        icon: <Text size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setNode('paragraph').run()
        },
      },
      {
        title: 'Bullet List',
        description: 'Create a simple bullet list.',
        icon: <List size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
      },
      {
        title: 'Numbered List',
        description: 'Create a list with numbering.',
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
      },
      {
        title: 'Quote',
        description: 'Capture a quote.',
        icon: <Quote size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        },
      },
      {
        title: 'Code Block',
        description: 'Add a block of code.',
        icon: <Code size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
      },
      {
        title: 'Horizontal Rule',
        description: 'Add a separator line.',
        icon: <Minus size={18} />,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
      },
    ].filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
  },
}
