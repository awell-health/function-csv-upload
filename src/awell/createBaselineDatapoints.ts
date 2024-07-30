import { parseISO } from "date-fns";
import { CSVRow } from "../types";
import {
  DataPointDefinition,
  DataPointValueType,
  BaselineInfoInput,
} from "./graphql-codegen/sdk";
import { isEmpty, isNil } from "lodash";

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

      if (valueType === DataPointValueType.Date) {
        return {
          data_point_definition_id,
          value: parseISO(value),
        };
      } else {
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
