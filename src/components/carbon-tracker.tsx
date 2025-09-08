'use client';

import { Trash2, TrendingUp, TrendingDown, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Trip } from '@/lib/types';
import { VEHICLE_EMISSIONS } from '@/lib/co2-calculator';

interface CarbonTrackerProps {
  trips: Trip[];
  onClear: () => void;
}

export function CarbonTracker({ trips, onClear }: CarbonTrackerProps) {
  const totalCO2 = trips.reduce((acc, trip) => acc + trip.co2, 0);

  // Calculate potential savings by switching to the cleanest option (2-Wheeler)
  const potentialSavings = trips.reduce((acc, trip) => {
    if (trip.distanceTraveled && trip.vehicleType && trip.vehicleType !== '2-Wheeler') {
        const greenerCO2 = trip.distanceTraveled * VEHICLE_EMISSIONS['2-Wheeler'];
        const currentCO2 = trip.co2;
        if (currentCO2 > greenerCO2) {
            return acc + (currentCO2 - greenerCO2);
        }
    }
    return acc;
  }, 0);

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            Carbon Savings Tracker
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClear} disabled={trips.length === 0}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear Trips</span>
          </Button>
        </div>
        <CardDescription>A local log of your calculated trips and potential savings.</CardDescription>
      </CardHeader>
      <CardContent>
        {trips.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No trips calculated yet.</p>
            <p className="text-sm">Use the calculator to log your first trip.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCO2.toFixed(2)} kg</div>
                        <p className="text-xs text-muted-foreground">across {trips.length} trips</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{potentialSavings.toFixed(2)} kg</div>
                        <p className="text-xs text-muted-foreground">by switching to a 2-wheeler</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="max-h-60 overflow-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead className="text-right">CO₂ Emission</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trips.map((trip) => (
                    <TableRow key={trip.id}>
                        <TableCell>
                        <Badge variant="outline">{trip.vehicleType || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell>{trip.distanceTraveled || trip.fuelConsumption ? `${trip.distanceTraveled || '-'} km / ${trip.fuelConsumption || '-'} L` : 'N/A'}</TableCell>
                        <TableCell className="text-right font-medium">{trip.co2.toFixed(2)} kg</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
