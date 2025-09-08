import type { EcoPredictFormValues } from '@/components/eco-predict-form';

// These are simplified, illustrative emission factors for CO₂ equivalent (CO₂e).
// Real-world calculations are more complex and depend on many variables.
const EMISSION_FACTORS = {
  FUEL_LITER_GASOLINE: 2.31, // kg CO₂e per liter of gasoline
  ELECTRICITY_KWH: 0.37, // kg CO₂e per kWh (US Grid average 2022, varies greatly)
  DISTANCE_KM_CAR: 0.17, // kg CO₂e per km for an average passenger car
};

/**
 * Calculates a simplified CO₂ emission estimate based on provided data.
 * @param data - The user's input from the form, where values can be numbers or empty strings.
 * @returns The total estimated CO₂ emissions in kilograms.
 */
export function calculateCO2(data: EcoPredictFormValues): number {
  let totalCO2 = 0;

  const fuelConsumption = Number(data.fuelConsumption) || 0;
  const energyUsage = Number(data.energyUsage) || 0;
  const distanceTraveled = Number(data.distanceTraveled) || 0;

  if (fuelConsumption > 0) {
    totalCO2 += fuelConsumption * EMISSION_FACTORS.FUEL_LITER_GASOLINE;
  }

  if (energyUsage > 0) {
    totalCO2 += energyUsage * EMISSION_FACTORS.ELECTRICITY_KWH;
  }
  
  if (distanceTraveled > 0) {
    totalCO2 += distanceTraveled * EMISSION_FACTORS.DISTANCE_KM_CAR;
  }

  // `vehicleType` and `industrialActivity` are not used in this simple calculation
  // but are passed to the AI for more relevant dataset suggestions.

  return totalCO2;
}
