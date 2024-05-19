import { convertUSDateToISO8601 } from "../csv";
import { CSVRow } from "../types";
import { DataPointDefinition, DataPointValueType } from "./graphql-codegen/sdk";
import { isEmpty, isNil } from "lodash";

export function createBaselineDatapoints(
  row: CSVRow,
  dataPointDefinitions: DataPointDefinition[]
) {
  const dpds = dataPointDefinitions.map(
    ({ id, title, valueType, optional }) => {
      const value = row[title as keyof CSVRow];

      if (!value && !optional) {
        throw new Error(`Missing required value for ${title}`);
      }
      if (isNil(value) || isEmpty(value)) {
        return null;
      }

      if (valueType === DataPointValueType.Date) {
        return {
          data_point_definition_id: id,
          value: convertUSDateToISO8601(value),
        };
      } else {
        return {
          data_point_definition_id: id,
          value: value,
        };
      }
    }
  );

  return dpds.filter((d) => !isNil(d)) as {
    data_point_definition_id: string;
    value: string;
  }[];
}
