'use client';

import { useState, useEffect } from 'react';
import { Leaf, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EcoPredictForm, type EcoPredictFormValues } from '@/components/eco-predict-form';
import { EcoPredictResults } from '@/components/eco-predict-results';
import { ComparisonForm } from '@/components/comparison-form';
import { CarbonTracker } from '@/components/carbon-tracker';
import { calculateCO2 } from '@/lib/co2-calculator';
import { useToast } from '@/hooks/use-toast';
import type { SuggestRelevantDatasetsInput, SuggestRelevantDatasetsOutput } from '@/ai/flows/suggest-relevant-datasets';
import { suggestRelevantDatasets } from '@/ai/flows/suggest-relevant-datasets';
import { getEcoTip } from '@/lib/eco-tips';
import type { Trip } from '@/lib/types';


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [ecoTip, setEcoTip] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);

  const { toast } = useToast();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = savedTheme;
    setTheme(savedTheme);
    
    const savedTrips = localStorage.getItem('carbon-trips');
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'theme-dark-blue' : 'light';
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
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
    setEcoTip(getEcoTip());

    const co2 = calculateCO2(data);
    setPrediction(co2);

    const newTrip: Trip = { id: Date.now(), ...data, co2 };
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem('carbon-trips', JSON.stringify(updatedTrips));

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
      });
    } finally {
      setLoading(false);
    }
  };

  const clearTrips = () => {
    setTrips([]);
    localStorage.removeItem('carbon-trips');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background transition-colors duration-300">
      <header className="absolute top-4 right-4 z-10">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
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
            Estimate, compare, and track your CO₂ emissions to reduce your carbon footprint.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="tracker">Tracker</TabsTrigger>
            </TabsList>
            <TabsContent value="calculator">
              <EcoPredictForm onCalculate={handleCalculate} loading={loading} />
              {showResults && (
                <div className="mx-auto mt-10 max-w-2xl">
                  <EcoPredictResults
                    loading={loading}
                    prediction={prediction}
                    suggestions={suggestions}
                    ecoTip={ecoTip}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="comparison">
              <ComparisonForm />
            </TabsContent>
            <TabsContent value="tracker">
              <CarbonTracker trips={trips} onClear={clearTrips} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Powered by GenAI and Next.js
      </footer>
    </div>
  );
}
