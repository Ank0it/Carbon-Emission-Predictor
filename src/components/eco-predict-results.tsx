'use client';

import { Lightbulb, Sparkles, Wind, Droplets, Mountain, Trees, Cloud, AlertTriangle, Download, Share2 } from 'lucide-react';
import { Twitter, MessageCircle } from 'lucide-react'; // More specific icons
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { getEquivalents } from '@/lib/co2-calculator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { EcoPredictFormValues } from './eco-predict-form';


interface EcoPredictResultsProps {
  loading: boolean;
  prediction: number | null;
  suggestions: string[];
  ecoTip: string;
  formData: EcoPredictFormValues;
}

const EmissionGauge = ({ value }: { value: number }) => {
  let colorClass = 'bg-green-500';
  let level = 'Low';
  if (value > 50 && value <= 150) {
    colorClass = 'bg-yellow-500';
    level = 'Medium';
  } else if (value > 150) {
    colorClass = 'bg-red-500';
    level = 'High';
  }

  // Normalize value for progress bar (0 to 100). Cap at a reasonable max (e.g., 500kg CO2)
  const normalizedValue = Math.min((value / 500) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">Emission Level</span>
        <Badge variant={level === 'Low' ? 'default' : level === 'Medium' ? 'secondary' : 'destructive'} className={colorClass}>{level}</Badge>
      </div>
      <Progress value={normalizedValue} className="h-3 [&>div]:transition-all [&>div]:duration-500" indicatorClassName={colorClass} />
    </div>
  );
};


const EmissionIcon = ({ value }: { value: number | null }) => {
    if (value === null) return null;

    if (value <= 50) {
        return <Trees className="h-12 w-12 text-green-500 animate-bounce" />;
    } else if (value <= 150) {
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
    } else {
        return <Cloud className="h-12 w-12 text-red-500 animate-pulse" />;
    }
};

export function EcoPredictResults({ loading, prediction, suggestions, ecoTip, formData }: EcoPredictResultsProps) {
  const equivalents = prediction !== null ? getEquivalents(prediction) : null;

  const handleDownload = () => {
    if (prediction === null || !equivalents) return;

    const headers = ['Metric', 'Value', 'Unit'];
    const rows = [
      ['Date', new Date().toLocaleString(), ''],
      ['Predicted CO2', prediction.toFixed(2), 'kg CO2e'],
      ['Fuel Consumption', formData.fuelConsumption || 'N/A', 'L'],
      ['Vehicle Type', formData.vehicleType || 'N/A', ''],
      ['Distance Traveled', formData.distanceTraveled || 'N/A', 'km'],
      ['Road Type', formData.roadType || 'N/A', ''],
      ['Equivalent Coal Burned', equivalents.coal.toFixed(2), 'kg'],
      ['Equivalent Trees/Year', equivalents.trees.toFixed(2), ''],
      ['Equivalent Passenger Flight', equivalents.flights.toFixed(2), 'km'],
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(',') + '\n'
      + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ecopredict_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getShareText = () => {
    if (prediction === null) return { whatsapp: '', twitter: '' };
    
    const emission = prediction.toFixed(2);
    const distance = formData.distanceTraveled || 'your trip';
    const vehicle = formData.vehicleType || 'your vehicle';
    const appLink = 'https://carbon-emission-predictor.netlify.app/'; // Placeholder for the app's URL

    const text = `Checked my CO₂ footprint 🚗🌱 → ${emission} kg CO₂ for ${distance} km on a ${vehicle}. Check your carbon footprint here: ${appLink}`;

    return { whatsapp: text, twitter: text };
  };
  
  const { whatsapp, twitter } = getShareText();

  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Prediction Result
              </CardTitle>
              <CardDescription>
                Your estimated CO₂ equivalent emissions.
              </CardDescription>
            </div>
            <EmissionIcon value={prediction} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && prediction === null ? (
            <Skeleton className="h-12 w-1/2 rounded-md" />
          ) : prediction !== null ? (
            <>
              <p className="text-4xl font-bold text-foreground">
                {prediction.toFixed(2)}
                <span className="text-xl font-medium text-muted-foreground"> kg CO₂e</span>
              </p>
              <EmissionGauge value={prediction} />
            </>
          ) : null}
        </CardContent>
      </Card>
      
      {prediction !== null && equivalents && (
        <>
          <Card className="shadow-lg">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Wind className="h-6 w-6 text-primary" />
                      Emission Equivalents
                  </CardTitle>
                  <CardDescription>
                      This is equivalent to...
                  </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center space-y-1">
                      <Droplets className="h-8 w-8 text-accent"/>
                      <p className="font-bold text-lg">{equivalents.coal.toFixed(2)} kg</p>
                      <p className="text-sm text-muted-foreground">Coal Burned</p>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                      <Trees className="h-8 w-8 text-accent"/>
                      <p className="font-bold text-lg">{equivalents.trees.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Trees/Year</p>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                      <Mountain className="h-8 w-8 text-accent"/>
                      <p className="font-bold text-lg">{equivalents.flights.toFixed(2)} km</p>
                      <p className="text-sm text-muted-foreground">Passenger Flight</p>
                  </div>
              </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-6 w-6 text-primary" />
                Export & Share
              </CardTitle>
              <CardDescription>
                Download your report or share your results.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Report (CSV)
              </Button>
              <div className="flex w-full gap-4">
                 <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(whatsapp)}`, '_blank')}
                >
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </Button>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitter)}`, '_blank')}
                >
                    <Twitter className="mr-2 h-4 w-4" /> Twitter/X
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {(loading || suggestions.length > 0 || ecoTip) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Insights & Suggestions
            </CardTitle>
            <CardDescription>
              Tips and data to help you reduce your footprint.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ecoTip && (
                <div className="p-4 bg-accent/10 rounded-lg">
                    <p className="font-semibold text-accent-foreground">💡 Daily Eco Tip</p>
                    <p className="text-sm text-muted-foreground">{ecoTip}</p>
                </div>
            )}
            {loading && suggestions.length === 0 ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-4/5 rounded-md" />
              </div>
            ) : (
              suggestions.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>AI-Suggested Public Datasets</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
