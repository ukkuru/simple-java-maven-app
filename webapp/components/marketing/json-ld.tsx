/**
 * Renders a JSON-LD structured-data block. `data` is pre-built plain JSON
 * (schema.org shape), not user input, so a plain script tag is safe here.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
