import { CSVRow } from "./types";
import { convertUSDateToISO8601, getSex } from "./csv";
import { isEmpty } from "lodash";
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
  return {
    ...(row["First name"] && { first_name: row["First name"].trim() }),
    ...(row["Last name"] && { last_name: row["Last name"].trim() }),
    ...(row["Date of Birth"] && {
      birth_date: convertUSDateToISO8601(row["Date of Birth"].trim()),
    }),
    ...(row["Gender"] && { sex: getSex(row["Gender"].trim()) }),
    ...(row.Email && { email: row.Email.trim() }),
    ...(row["Preferred Language"] && {
      preferred_language: row["Preferred Language"].toLowerCase(),
    }),
    ...(row["Phone Number"] && { phone: row["Phone Number"].trim() }),
    ...(row["Mobile Phone"] && { mobile_phone: row["Mobile Phone"].trim() }),
    ...(!isEmpty(address) && { address }),
  };
}
