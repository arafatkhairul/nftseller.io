import { Card, CardContent } from '@/components/ui/card';

export default function NFTCardSkeleton() {
    return (
        <Card className="group vercel-card relative overflow-hidden rounded-2xl border transition-all duration-200 p-0 animate-pulse">
            {/* Image Container Skeleton */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80"></div>
            </div>

            {/* Content Skeleton - Vercel Style */}
            <CardContent className="p-4 space-y-3">
                {/* NFT Name Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>

                {/* Price Section Skeleton */}
                <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                        <div className="h-6 bg-muted rounded w-24"></div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                </div>

                {/* Action Buttons Skeleton - Vercel Style */}
                <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-8 bg-accent rounded-xl"></div>
                    <div className="flex-1 h-8 bg-primary/10 rounded-xl"></div>
                </div>
            </CardContent>
        </Card>
    );
}
