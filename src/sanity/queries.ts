import { client } from './lib/client'
import { urlFor } from './lib/image'
import type { Post } from '@/components/blog/BlogGrid'

type SanityPost = {
  _id: string
  title: string
  slug: string
  category: Post['category']
  readMin: number
  featured?: boolean
  excerpt?: string
  publishedAt?: string
  mainImage?: {
    asset: { _ref: string }
    alt?: string
  }
}

type SanityPostFull = SanityPost & {
  body?: unknown[]
  metaTitle?: string
  metaDescription?: string
}

const POST_CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  category,
  readMin,
  featured,
  excerpt,
  publishedAt,
  mainImage { asset, alt }
`

function toPost(p: SanityPost): Post {
  const image = p.mainImage?.asset
    ? urlFor(p.mainImage).width(800).url()
    : '/images/bento-gold-bar.webp'

  const date = p.publishedAt
    ? new Date(p.publishedAt).toLocaleDateString('sr-RS', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? '',
    category: p.category,
    date,
    readMin: p.readMin,
    image,
    imageAlt: p.mainImage?.alt ?? p.title,
    featured: p.featured,
  }
}

export async function getSanityPosts(): Promise<Post[]> {
  const posts = await client.fetch<SanityPost[]>(
    `*[_type == "post"] | order(publishedAt desc) { ${POST_CARD_FIELDS} }`,
    {},
    { next: { revalidate: 60 } }
  )
  return posts.map(toPost)
}

export async function getSanityPost(slug: string): Promise<{
  post: Post
  body: unknown[]
  metaTitle?: string
  metaDescription?: string
} | null> {
  const p = await client.fetch<SanityPostFull | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      ${POST_CARD_FIELDS},
      body,
      metaTitle,
      metaDescription
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
  if (!p) return null

  return {
    post: toPost(p),
    body: (p.body as unknown[]) ?? [],
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
  }
}
