interface SeoProps {
  /** Schema.org objects. Each becomes a separate <script type="application/ld+json"> tag. */
  schemas: Record<string, unknown>[];
}

/**
 * Renders JSON-LD structured data scripts. Escapes '<' → '<' to prevent XSS.
 * Server component. Place anywhere in the tree; Next.js includes it in the HTML output.
 *
 * @example
 * <Seo schemas={[faqPage(items), lodgingBusiness()]} />
 */
export function Seo({ schemas }: SeoProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}

export default Seo;
