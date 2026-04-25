import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { STATS } from '@/lib/content/homepage';

export function StatsBar() {
  return (
    <Section
      label="Key facts about Madhuban Eco Retreat"
      className="bg-cream py-10 md:py-12"
    >
      <Container>
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center px-4 py-6 md:border-l md:border-border md:first:border-l-0"
            >
              <dt className="font-display text-4xl font-medium text-earth-brown leading-none">
                {stat.value}
              </dt>
              <dd className="mt-1 font-body text-sm text-muted-foreground text-center">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
