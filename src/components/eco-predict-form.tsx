'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Car, Fuel, Loader2, Route } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  fuelConsumption: z.coerce.number({invalid_type_error: "Must be a number"}).min(0, 'Must be non-negative').optional().or(z.literal('')),
  vehicleType: z.string().optional(),
  distanceTraveled: z.coerce.number({invalid_type_error: "Must be a number"}).min(0, 'Must be non-negative').optional().or(z.literal('')),
  roadType: z.string().optional(),
});

export type EcoPredictFormValues = z.infer<typeof formSchema>;

interface EcoPredictFormProps {
  onCalculate: (data: EcoPredictFormValues) => void;
  loading: boolean;
}

const InputWithIcon = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      {children}
    </div>
);

export function EcoPredictForm({ onCalculate, loading }: EcoPredictFormProps) {
  const form = useForm<EcoPredictFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fuelConsumption: '',
      vehicleType: '',
      distanceTraveled: '',
      roadType: '',
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>CO₂ Emission Calculator</CardTitle>
        <CardDescription>Enter your activity details below. Fill at least one field to get an estimate.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fuelConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Consumption</FormLabel>
                    <FormControl>
                        <InputWithIcon icon={<Fuel className="h-4 w-4 text-muted-foreground" />}>
                            <Input type="number" placeholder="e.g., 50" {...field} className="pl-10" />
                        </InputWithIcon>
                    </FormControl>
                    <FormDescription>In Liters (L)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distanceTraveled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance Traveled by Car</FormLabel>
                    <FormControl>
                        <InputWithIcon icon={<Route className="h-4 w-4 text-muted-foreground" />}>
                            <Input type="number" placeholder="e.g., 200" {...field} className="pl-10" />
                        </InputWithIcon>
                    </FormControl>
                    <FormDescription>In Kilometers (km)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <InputWithIcon icon={<Car className="h-4 w-4 text-muted-foreground" />}>
                                <SelectTrigger className="pl-10">
                                    <SelectValue placeholder="Select a vehicle type" />
                                </SelectTrigger>
                            </InputWithIcon>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="2-Wheeler">2-Wheeler</SelectItem>
                            <SelectItem value="3-Wheeler">3-Wheeler</SelectItem>
                            <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                            <SelectItem value="5-Wheeler">5-Wheeler</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>Helps AI find better datasets.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="roadType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Road Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <InputWithIcon icon={<Route className="h-4 w-4 text-muted-foreground" />}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select a road type" />
                        </SelectTrigger>
                      </InputWithIcon>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Highway">Highway</SelectItem>
                      <SelectItem value="City Roads">City Roads</SelectItem>
                      <SelectItem value="Mountains">Mountains</SelectItem>
                      <SelectItem value="Desert">Desert</SelectItem>
                      <SelectItem value="Rural Roads">Rural Roads</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Helps AI find better datasets.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Calculating...' : 'Calculate Emissions'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
