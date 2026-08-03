import { defineArrayMember, defineField, defineType } from 'sanity'

export const tableBlockType = defineType({
  name: 'tableBlock',
  title: 'Tabela',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: 'Naslov tabele',
      type: 'string',
    }),
    defineField({
      name: 'columns',
      title: 'Kolone',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) =>
        Rule.required().min(1).error('Tabela mora imati najmanje jednu kolonu.'),
    }),
    defineField({
      name: 'rows',
      title: 'Redovi',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          title: 'Red',
          fields: [
            defineField({
              name: 'cells',
              title: 'Ćelije',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }) {
              return { title: Array.isArray(cells) ? cells.join(' | ') : 'Red' }
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).error('Tabela mora imati najmanje jedan red.'),
    }),
  ],
  preview: {
    select: { caption: 'caption', columns: 'columns' },
    prepare({ caption, columns }) {
      return {
        title: caption || 'Tabela',
        subtitle: Array.isArray(columns) ? `${columns.length} kolona` : undefined,
      }
    },
  },
})
