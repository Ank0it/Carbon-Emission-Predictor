import type { EcoPredictFormValues } from "@/components/eco-predict-form";

export interface Trip extends EcoPredictFormValues {
    id: number;
    co2: number;
}
