'use client';

import { Lightbulb, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface EcoPredictResultsProps {
  loading: boolean;
  prediction: number | null;
  suggestions: string[];
}

export function EcoPredictResults({ loading, prediction, suggestions }: EcoPredictResultsProps) {
  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Prediction Result
                </CardTitle>
                <CardDescription>
                    Your estimated CO₂ equivalent emissions based on the provided data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading && prediction === null ? (
                    <Skeleton className="h-12 w-1/2 rounded-md" />
                ) : prediction !== null ? (
                    <p className="text-4xl font-bold text-foreground">
                        {prediction.toFixed(2)}
                        <span className="text-xl font-medium text-muted-foreground"> kg CO₂e</span>
                    </p>
                ) : null}
            </CardContent>
        </Card>

        {(loading || suggestions.length > 0) && (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        AI-Powered Suggestions
                    </CardTitle>
                    <CardDescription>
                        For more context, our AI suggests exploring these public datasets.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && suggestions.length === 0 ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-4/5 rounded-md" />
                        </div>
                    ) : (
                        suggestions.length > 0 && (
                            <Accordion type="single" collapsible className="w-full">
                                {suggestions.map((suggestion, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>Relevant Dataset #{index + 1}</AccordionTrigger>
                                        <AccordionContent>
                                            {suggestion}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}
