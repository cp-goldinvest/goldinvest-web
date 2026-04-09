import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategorija',
      type: 'string',
      options: {
        list: [
          { title: 'Investiciono zlato', value: 'Investiciono zlato' },
          { title: 'Tržište', value: 'Tržište' },
          { title: 'Saveti', value: 'Saveti' },
          { title: 'Vodič', value: 'Vodič' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readMin',
      title: 'Vreme čitanja (min)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Istaknuti post',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'mainImage',
      title: 'Naslovna slika',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Kratak opis',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Sadržaj',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt tekst',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Datum objave',
      type: 'datetime',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta naslov (SEO)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta opis (SEO)',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})
