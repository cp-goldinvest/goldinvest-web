/**
 * Renders a JSON-LD schema.org script tag.
 * Works in Server Components - no "use client" needed.
 * Pass one schema object per component instance.
 *
 * Usage:
 *   <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
 *   <SchemaScript schema={buildFaqSchema(faqItems)} />
 */
export function SchemaScript({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
