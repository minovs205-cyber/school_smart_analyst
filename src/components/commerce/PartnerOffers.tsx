import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { partnersFor, withUtm, type PartnerOffer } from '@/lib/partners';

interface PartnerOffersProps {
  placement: PartnerOffer['placements'][number];
  campaign: string;
  title?: string;
  compact?: boolean;
}

export function PartnerOffers({
  placement,
  campaign,
  title = 'Полезные инструменты',
  compact = false,
}: PartnerOffersProps) {
  const offers = partnersFor(placement);
  if (offers.length === 0) return null;

  return (
    <Card className="border-border bg-card/80">
      <CardHeader className={compact ? 'pb-2' : undefined}>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline">партнёрские ссылки</Badge>
        </div>
        <CardDescription>
          Рекомендации к практике. Покупки по ссылкам могут поддерживать платформу — без навязчивой
          рекламы.
        </CardDescription>
      </CardHeader>
      <CardContent className={compact ? 'space-y-2' : 'space-y-3'}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium">{offer.title}</p>
              <p className="text-xs text-muted-foreground">{offer.blurb}</p>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0 border-primary text-primary">
              <a
                href={withUtm(offer.url, { campaign, content: offer.id })}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                Открыть
              </a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
