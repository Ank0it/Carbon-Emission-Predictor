'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car, Route, GitCompareArrows, BarChart, Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Bar } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartConfig, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { BarChart as RechartsBarChart } from 'recharts';

import { calculateCO2, VEHICLE_EMISSIONS } from '@/lib/co2-calculator';

const comparisonSchema = z.object({
  distance: z.coerce.number().min(1, 'Distance must be positive'),
  vehicle1: z.string().nonempty('Please select a vehicle'),
  vehicle2: z.string().nonempty('Please select a vehicle'),
});

type ComparisonFormValues = z.infer<typeof comparisonSchema>;

const chartConfig = {
  co2: {
    label: 'CO₂ (kg)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function ComparisonForm() {
  const [results, setResults] = useState<{ name: string, co2: number }[] | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<ComparisonFormValues>({
    resolver: zodResolver(comparisonSchema),
    defaultValues: {
      distance: 100,
    },
  });

  const onSubmit: SubmitHandler<ComparisonFormValues> = (data) => {
    setLoading(true);
    const co2_1 = calculateCO2({ distanceTraveled: data.distance, vehicleType: data.vehicle1 });
    const co2_2 = calculateCO2({ distanceTraveled: data.distance, vehicleType: data.vehicle2 });
    
    setTimeout(() => {
        setResults([
            { name: data.vehicle1, co2: parseFloat(co2_1.toFixed(2)) },
            { name: data.vehicle2, co2: parseFloat(co2_2.toFixed(2)) },
        ]);
        setLoading(false);
    }, 500);
  };

  return (
    <>
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompareArrows className="h-6 w-6 text-primary" />
            Compare Emissions
          </CardTitle>
          <CardDescription>See the difference in CO₂ emissions between two vehicle types for the same distance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance to Travel</FormLabel>
                    <div className="relative">
                       <Route className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input type="number" placeholder="e.g., 100" {...field} className="pl-10" />
                    </div>
                    <FormDescription>In Kilometers (km)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vehicle1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle 1</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle 1" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(VEHICLE_EMISSIONS).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicle2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle 2</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle 2" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(VEHICLE_EMISSIONS).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground" disabled={loading}>
                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                 Compare
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && (
        <Card className="mt-8 shadow-lg animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-primary" />
                Comparison Result
            </CardTitle>
            <CardDescription>
                For a {form.getValues('distance')} km trip, the estimated emissions are:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <RechartsBarChart accessibilityLayer data={results}>
                    <Bar dataKey="co2" fill="var(--color-co2)" radius={4} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}
