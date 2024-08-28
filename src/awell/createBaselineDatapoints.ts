import { CSVRow } from "../types";
import {
  DataPointDefinition,
  DataPointValueType,
  BaselineInfoInput,
} from "./graphql-codegen/sdk";
import { isEmpty, isNil } from "lodash";
import { parseISO } from "date-fns";

export function createBaselineDatapoints(
  row: CSVRow,
  dataPointDefinitions: DataPointDefinition[],
): BaselineInfoInput[] {
  const dpds = dataPointDefinitions.map(
    ({ id: data_point_definition_id, title, valueType, optional }) => {
      const value = row[title as keyof CSVRow];

      if (!value && !optional) {
        throw new Error(`Missing required value for ${title}`);
      }
      if (isNil(value) || isEmpty(value)) {
        return null;
      }

      switch (valueType) {
        case DataPointValueType.Date:
          return {
            data_point_definition_id,
            value: parseISO(value).toISOString(),
          };
        case DataPointValueType.Telephone:
          if (!value.startsWith("+1")) {
            return {
              data_point_definition_id,
              value: `+1${value}`,
            };
          // we don't technically need this else statement, but it's here for clarity
          } else {
            return {
              data_point_definition_id,
              value,
            };
          }
        default:
          return {
            data_point_definition_id,
            value,
          };
      }
    },
  );

  return dpds.filter(isValidBaselineInfo);
}

function isValidBaselineInfo(d: unknown): d is BaselineInfoInput {
  return (
    typeof d === "object" &&
    !isNil(d) &&
    !isNil((d as BaselineInfoInput).value) &&
    !isEmpty((d as BaselineInfoInput).value) &&
    !isNil((d as BaselineInfoInput).data_point_definition_id) &&
    !isEmpty((d as BaselineInfoInput).data_point_definition_id)
  );
}
