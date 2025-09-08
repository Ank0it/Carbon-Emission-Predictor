import type { EcoPredictFormValues } from '@/components/eco-predict-form';

// These are simplified, illustrative emission factors for CO₂ equivalent (CO₂e).
// Real-world calculations are more complex and depend on many variables.
export const EMISSION_FACTORS = {
  FUEL_LITER_GASOLINE: 2.31, // kg CO₂e per liter of gasoline
  DISTANCE_KM_CAR: 0.17, // kg CO₂e per km for an average passenger car
  COAL_KG: 2.86, // kg CO₂e per kg of coal burned
  TREE_YEAR: 21.77, // kg CO₂ absorbed by one tree in a year
  FLIGHT_PASSENGER_KM: 0.25, // kg CO₂e per passenger-km
};

export const VEHICLE_EMISSIONS = {
    '2-Wheeler': 0.05, // kg CO2e per km
    '3-Wheeler': 0.08,
    '4-Wheeler': 0.17,
    '5-Wheeler': 0.25, // Assuming larger vehicle/truck
};


/**
 * Calculates a simplified CO₂ emission estimate based on provided data.
 * @param data - The user's input from the form, where values can be numbers or empty strings.
 * @returns The total estimated CO₂ emissions in kilograms.
 */
export function calculateCO2(data: EcoPredictFormValues): number {
  let totalCO2 = 0;

  const fuelConsumption = Number(data.fuelConsumption) || 0;
  const distanceTraveled = Number(data.distanceTraveled) || 0;
  const vehicleType = data.vehicleType as keyof typeof VEHICLE_EMISSIONS;

  if (fuelConsumption > 0) {
    totalCO2 += fuelConsumption * EMISSION_FACTORS.FUEL_LITER_GASOLINE;
  }
  
  if (distanceTraveled > 0) {
    // If vehicle type is selected, use its specific emission factor. Otherwise, use a default.
    const emissionFactor = vehicleType && VEHICLE_EMISSIONS[vehicleType] ? VEHICLE_EMISSIONS[vehicleType] : EMISSION_FACTORS.DISTANCE_KM_CAR;
    totalCO2 += distanceTraveled * emissionFactor;
  }

  // `roadType` is not used in this simple calculation
  // but are passed to the AI for more relevant dataset suggestions.

  return totalCO2;
}


export function getEquivalents(co2: number) {
    return {
        coal: co2 / EMISSION_FACTORS.COAL_KG,
        trees: co2 / EMISSION_FACTORS.TREE_YEAR,
        flights: co2 / EMISSION_FACTORS.FLIGHT_PASSENGER_KM,
    };
}
