import { defineArrayMember, defineField, defineType } from 'sanity'

export const visualChartType = defineType({
  name: 'visualChart',
  title: 'Grafikon',
  type: 'object',
  fields: [
    defineField({
      name: 'chartId',
      title: 'ID grafikona',
      type: 'string',
      description:
        'Interni identifikator (npr. "chart-1") koji tekst u telu clanka referencira preko {{CHART_PLACEHOLDER}} oznake.',
      readOnly: true,
    }),
    defineField({
      name: 'chartType',
      title: 'Tip grafikona',
      type: 'string',
      options: {
        list: [
          { title: 'Trakasti (bar)', value: 'bar' },
          { title: 'Linijski (line)', value: 'line' },
          { title: 'Kruzni (pie)', value: 'pie' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Naslov grafikona',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labels',
      title: 'Oznake (X-osa)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'data',
      title: 'Vrednosti',
      type: 'array',
      of: [defineArrayMember({ type: 'number' })],
      validation: (Rule) =>
        Rule.required().custom((data, context) => {
          const labels = (context.parent as { labels?: unknown[] })?.labels
          if (Array.isArray(labels) && Array.isArray(data) && labels.length !== data.length) {
            return `Broj vrednosti (${data.length}) mora da odgovara broju oznaka (${labels.length}).`
          }
          return true
        }),
    }),
  ],
  preview: {
    select: { title: 'title', chartType: 'chartType' },
    prepare({ title, chartType }) {
      return { title, subtitle: chartType }
    },
  },
})
