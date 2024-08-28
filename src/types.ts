/**
 * Rows can have empty cell values, hence the "?"
 * Enforces some defensive programming
 */

export type PatientProfile = {
  "Patient ID"?: string;
  "Patient Name"?: string;
  "First name"?: string;
  "Last name"?: string;
  "Date of Birth"?: string;
  "DOB"?: string
  Gender?: string;
  Email?: string;
  "Phone Number"?: string;
  "Preferred Language"?: string;
  "Mobile Phone"?: string;
  Street?: string;
  City?: string;
  State?: string;
  Zip?: string;
  Country?: string;
};

export type AdditionalPatientInfo = {
  [key: string]: string;
};

export type CSVRow = PatientProfile & AdditionalPatientInfo;

export enum ProcessingStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}
