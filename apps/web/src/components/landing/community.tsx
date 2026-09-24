import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Adaeze • Lagos Builders Guild",
    quote: "Convex makes native USDC staking feel simple. One wallet confirmation, clear odds, and payouts that stay on Arc.",
  },
  {
    name: "Kwesi • Accra Web3 Club",
    quote: "We launched a rugby prediction ladder in under 30 minutes. The admin tools and creator fee split make it worth showing to every community lead.",
  },
];

const metrics = [
  { label: "Mobile-first NPS", value: "92", helper: "Feedback from our private beta cohort" },
  { label: "Creator retention", value: "87%", helper: "Markets relaunched week-over-week" },
  { label: "Average payout time", value: "21s", helper: "From resolution to wallet balance" },
];

export function CommunitySection() {
  return (
    <section className="bg-foreground/5 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold sm:text-4xl">Built with community curators in the loop</h2>
            <p className="text-base text-muted-foreground sm:text-lg">
              Convex grows with communities that want lightweight, trusted prediction experiences. The market builder and payout tooling make conviction games easy to launch on Arc.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-primary/20 bg-background p-5">
                  <p className="text-2xl font-semibold text-primary">{metric.value}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{metric.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{metric.helper}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-border/80 bg-background/90">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold uppercase text-primary">
                    {item.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">“{item.quote}”</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary/80">{item.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


