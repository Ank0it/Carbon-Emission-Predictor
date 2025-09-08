'use client';

import { useState, useEffect } from 'react';
import { Leaf, Palette } from 'lucide-react';

import type { SuggestRelevantDatasetsInput, SuggestRelevantDatasetsOutput } from '@/ai/flows/suggest-relevant-datasets';
import { suggestRelevantDatasets } from '@/ai/flows/suggest-relevant-datasets';

import { EcoPredictForm, type EcoPredictFormValues } from '@/components/eco-predict-form';
import { EcoPredictResults } from '@/components/eco-predict-results';
import { calculateCO2 } from '@/lib/co2-calculator';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = savedTheme;
  }, []);

  const handleThemeChange = (theme: string) => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  };

  const handleCalculate = async (data: EcoPredictFormValues) => {
    if (Object.values(data).every(val => !val)) {
        toast({
            title: 'No input provided',
            description: 'Please fill at least one field to calculate emissions.',
            variant: 'destructive',
        });
        return;
    }
      
    setLoading(true);
    setShowResults(true);
    setPrediction(null);
    setSuggestions([]);

    const co2 = calculateCO2(data);
    setPrediction(co2);

    try {
      const aiInput: SuggestRelevantDatasetsInput = {
        fuelConsumption: data.fuelConsumption,
        vehicleType: data.vehicleType,
        distanceTraveled: data.distanceTraveled,
        industrialActivity: data.industrialActivity,
      };
      const result: SuggestRelevantDatasetsOutput = await suggestRelevantDatasets(aiInput);
      setSuggestions(result.datasets);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      toast({
        title: 'AI Suggestion Error',
        description: 'Could not fetch AI-powered dataset suggestions.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
       <header className="absolute top-4 right-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Palette className="h-4 w-4" />
                  <span className="sr-only">Change theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleThemeChange('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('theme-dark-blue')}>Dark Blue</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </header>
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-card border px-4 py-1 text-sm text-muted-foreground mb-4">
                <Leaf className="h-4 w-4 text-accent" />
                <span>Your Partner in Sustainability</span>
            </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            EcoPredict
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Estimate your CO₂ emissions with our smart calculator and get insights to reduce your carbon footprint.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <EcoPredictForm onCalculate={handleCalculate} loading={loading} />
        </div>

        {showResults && (
           <div className="mx-auto mt-10 max-w-2xl">
                <EcoPredictResults
                    loading={loading}
                    prediction={prediction}
                    suggestions={suggestions}
                />
           </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Powered by GenAI and Next.js
      </footer>
    </div>
  );
}
