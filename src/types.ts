/**
 * Rows can have empty cell values, hence the "?"
 * Enforces some defensive programming
 */

export type PatientProfile = {
  "Patient ID"?: string;
  "First name"?: string;
  "Last name"?: string;
  "Date of Birth"?: string;
  Gender?: string;
  Email?: string;
  "Phone Number"?: string;
  "Preferred Language"?: string;
};

export type AdditionalPatientInfo = {
  "AWV Due Date"?: string;
  Program?: string;
  Priority?: string;
  PCP?: string;
  "Health Plan"?: string;
  IPA?: string;
  "Eligibility Start"?: string;
  "Eligibility End"?: string;
  AWV?: string;
  RAF?: string;
  HCCs?: string;
  "Gaps in Care"?: string;
  "Discharge Event Type"?: string;
  "Admission Reason"?: string;
  "Discharge Facility"?: string;
  "Discharge Data Source"?: string;
  "Discharge Date"?: string;
};

export type CSVRow = PatientProfile & AdditionalPatientInfo;

export enum ProcessingStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}
