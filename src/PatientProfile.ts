import { CSVRow } from "./types";
import { convertUSDateToISO8601, getSex, makePatientName } from "./csv";
import { isEmpty, isNil } from "lodash";
import logger from "./logger"

const isMaybeValidPhone = (phone?: string): phone is string => {
  return (
    !isNil(phone) &&
    typeof phone === "string" &&
    !isEmpty(phone) &&
    phone.startsWith("+")
  );
};
/**
 * Creates a profile object from a CSV row
 * @param row CSV row
 * @returns
 */
export function createProfile(row: CSVRow) {
  const address = {
    ...(row.Street && { street: row.Street.trim() }),
    ...(row.City && { city: row.City.trim() }),
    ...(row.State && { state: row.State.trim() }),
    ...(row.Zip && { zip: row.Zip.trim() }),
    ...(row.Country && { country: row.Country.trim() }),
  };
  let patientName: { first_name?: string, last_name?: string } = { first_name: undefined, last_name: undefined };
  let dob: string | undefined = undefined;
  // Check for patient name in different columns
  switch (true) {
    case (!isEmpty(row["First name"]) && !isEmpty(row["Last name"])): {
      patientName = {
        first_name: row["First name"]?.trim(),
        last_name: row["Last name"]?.trim(),
      }
      break;
    }
    case (!isEmpty(row["Patient Name"]) && !isNil(row["Patient Name"])): {
      patientName = makePatientName(row["Patient Name"]);
      break;
    }
    default: {
      // do nothing
      logger.info("No patient name found")
    }
  }

  // Check for DOB in different columns
  switch (true) {
    case (!isEmpty(row["Date of Birth"]) && !isNil(row["Date of Birth"])): {
      dob = convertUSDateToISO8601(row["Date of Birth"].trim());
      break;
    }
    case (!isEmpty(row.DOB) && !isNil(row.DOB)): {
      dob = convertUSDateToISO8601(row.DOB.trim());
      break;
    }
  }
  return {
    ...(patientName.first_name && { first_name: patientName.first_name }),
    ...(patientName.last_name && { last_name: patientName.last_name }),
    ...(dob && { birth_date: dob }),
    ...(row["Gender"] && { sex: getSex(row["Gender"].trim()) }),
    ...(row.Email && { email: row.Email.trim() }),
    ...(row["Preferred Language"] && {
      preferred_language: row["Preferred Language"].toLowerCase(),
    }),
    ...(isMaybeValidPhone(row["Phone Number"]) && {
      phone: row["Phone Number"].trim(),
    }),
    ...(row["Mobile Phone"] && { mobile_phone: row["Mobile Phone"].trim() }),
    ...(row["National Registry Number"] && {
      national_registry_number: row["National Registry Number"].trim(),
    }),
    ...(!isEmpty(address) && { address }),
  };
}
