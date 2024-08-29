import { IDENTIFIER_SYSTEM } from "./config";
import { CSVRow } from "./types";
import {
  type CareflowDefinition,
  AwellClient,
  createBaselineDatapoints,
} from "./awell";
import { StartPathwayInput } from "./awell/graphql-codegen/sdk";
import { createProfile } from "./PatientProfile";
import logger from './logger'

export class PatientEnrollment {
  _client: AwellClient;
  _row: CSVRow;
  careflowDefinition: CareflowDefinition;
  patientId: string;
  baselineDataPoints: StartPathwayInput["data_points"];
  patientProfile: Record<string, any>;

  constructor(
    _row: CSVRow,
    careflowDefinition: CareflowDefinition,
    client: AwellClient,
  ) {
    if (!_row["Patient ID"]) {
      throw new Error("Missing patient ID");
    }
    this._client = client;
    this._row = _row;
    this.careflowDefinition = careflowDefinition;
    this.patientId = _row["Patient ID"];
    this.patientProfile = createProfile(_row);
    this.baselineDataPoints = this.createBaselineDataPoints();
    logger.info({
      message: `PatientEnrollment created for patient ID: ${this.patientId}`,
      patientId: this.patientId,
      baselineDataPoints: this.baselineDataPoints,
      profile: this.patientProfile,
    });
  }

  /**
   * Finds the patient by identifier, then either updates the patient or creates a new one
   */
  async syncPatient() {
    /**
     * Check if patient exists based on their identifier
     */
    const searchResult = await this._client.sdk.GetPatientByIdentifier({
      system: IDENTIFIER_SYSTEM,
      value: this.patientId,
    });

    const patientExists =
      searchResult.data.patientByIdentifier.patient !== null;

    /** If patient exists, we will update the demographics so most recent information is present
     *  If not, create the patient
     */
    if (patientExists) {
      await this._client.sdk.UpdatePatient({
        input: {
          patient_id: searchResult.data.patientByIdentifier.patient?.id ?? "",
          profile: this.patientProfile,
        },
      });
    } else {
      await this._client.sdk.CreatePatient({
        input: {
          identifier: [
            {
              system: IDENTIFIER_SYSTEM,
              value: this.patientId,
            },
          ],
          patient_code: this.patientId, // allows for easier search in Awell Care
          ...this.patientProfile,
        },
      });
    }
    logger.info({ message: `patient ${this.patientId} synced` });
  }

  /**
   * Populates baseline datapoints
   */
  createBaselineDataPoints() {
    return createBaselineDatapoints(
      this._row,
      this.careflowDefinition.data_point_definitions ?? [],
    );
  }

  /**
   * Starts the pathway for the patient
   */
  async enrollPatient() {
    const resp = await this._client.sdk.StartPathwayWithPatientIdentifier({
      input: {
        pathway_definition_id: this.careflowDefinition.id,
        patient_identifier: {
          system: IDENTIFIER_SYSTEM,
          value: this.patientId,
        },
        // Only pass data points that have a value
        data_points: (this.baselineDataPoints ?? []).filter(
          (d) => d.value !== "",
        ),
      },
    });
    logger.info({
      message: `patient ${this.patientId} pathway started for pathway_definition_id: ${this.careflowDefinition.id}`,
      data: resp?.data?.startPathwayWithPatientIdentifier,
    });
  }
}
