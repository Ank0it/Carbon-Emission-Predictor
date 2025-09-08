'use server';

/**
 * @fileOverview Suggests relevant public datasets based on user input for more informed CO₂ emission predictions.
 *
 * - suggestRelevantDatasets - A function that suggests relevant public datasets.
 * - SuggestRelevantDatasetsInput - The input type for the suggestRelevantDatasets function.
 * - SuggestRelevantDatasetsOutput - The return type for the suggestRelevantDatasets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantDatasetsInputSchema = z.object({
  fuelConsumption: z.number().optional().describe('Fuel consumption in liters per 100 km.'),
  vehicleType: z.string().optional().describe('Type of vehicle (e.g., car, truck, SUV).'),
  distanceTraveled: z.number().optional().describe('Distance traveled in kilometers.'),
  industrialActivity: z.string().optional().describe('Type of industrial activity.'),
});
export type SuggestRelevantDatasetsInput = z.infer<typeof SuggestRelevantDatasetsInputSchema>;

const SuggestRelevantDatasetsOutputSchema = z.object({
  datasets: z.array(z.string()).describe('A list of relevant public datasets.'),
});
export type SuggestRelevantDatasetsOutput = z.infer<typeof SuggestRelevantDatasetsOutputSchema>;

export async function suggestRelevantDatasets(input: SuggestRelevantDatasetsInput): Promise<SuggestRelevantDatasetsOutput> {
  return suggestRelevantDatasetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantDatasetsPrompt',
  input: {schema: SuggestRelevantDatasetsInputSchema},
  output: {schema: SuggestRelevantDatasetsOutputSchema},
  prompt: `Based on the following input parameters related to CO₂ emissions, suggest relevant public datasets that the user can refer to for more accurate information. Focus on datasets that provide official ratings, statistics, or benchmarks related to these parameters.

Fuel Consumption: {{{fuelConsumption}}}
Vehicle Type: {{{vehicleType}}}
Distance Traveled: {{{distanceTraveled}}}
Industrial Activity: {{{industrialActivity}}}

Provide a list of dataset names and a brief description of their relevance to the input parameters.`,
});

const suggestRelevantDatasetsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantDatasetsFlow',
    inputSchema: SuggestRelevantDatasetsInputSchema,
    outputSchema: SuggestRelevantDatasetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
