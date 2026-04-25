import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { BLOG_POSTS } from '@/lib/content/blog';

export function BlogPreview() {
  return (
    <Section label="From the Madhuban Journal" id="blog-preview" className="bg-cream">
      <Container>
        <Heading
          as="h2"
          text="From the Madhuban Journal"
          subheading="Stories, guides, and field notes from the forest."
          className="mb-12"
        />

        <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <article aria-labelledby={`blog-title-${post.slug}`}>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="relative aspect-[3/2] overflow-hidden bg-warm-beige/20">
                    <Image
                      src={post.image.webp.desktop}
                      alt={post.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>

                  <CardHeader>
                    <p className="text-xs text-charcoal/60">
                      <time dateTime={post.publishedAt}>
                        {format(parseISO(post.publishedAt), 'MMM d, yyyy')}
                      </time>
                      {' · '}{post.readMinutes} min read
                    </p>
                    <h3
                      id={`blog-title-${post.slug}`}
                      className="line-clamp-2 font-display text-base font-medium leading-snug text-charcoal"
                    >
                      {post.title}
                    </h3>
                  </CardHeader>

                  <CardContent>
                    <p className="line-clamp-3 text-sm leading-relaxed text-charcoal/70">
                      {post.excerpt}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <Link
                      href={post.href}
                      className="rounded-sm text-sm font-medium text-earth-brown underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-1"
                    >
                      Read more →
                    </Link>
                  </CardFooter>
                </Card>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex h-12 items-center justify-center rounded-md border border-earth-brown px-8 text-sm font-medium text-earth-brown transition-colors duration-200 hover:bg-earth-brown hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            View All Posts
          </Link>
        </div>
      </Container>
    </Section>
  );
}
