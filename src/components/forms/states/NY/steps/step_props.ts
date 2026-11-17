// Props shared by every step of the New York workflow.
import type { FieldErrors } from '../../../fields/field_errors.ts';
import type { NyEstimate } from '../ny_calculator.ts';

export interface StepProps {
  errors: FieldErrors;
  estimate: NyEstimate;
}
