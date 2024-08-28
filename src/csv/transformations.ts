import { parse, formatISO, isValid, parseISO } from "date-fns";
import { capitalize, lowerCase, startCase, trim } from "lodash";

export const convertUSDateToISO8601 = (dateString: string): string => {
  const parseAs = (fmt:string) => parse(dateString, fmt, new Date());
  const DATE_FMT_1 = "yyyy/MM/dd"
  const DATE_FMT_2 = "yyyy-MM-dd"
  switch (true) {
    case isValid(parseAs(DATE_FMT_1)): {
      return formatISO(parseAs(DATE_FMT_1), { representation: "date" });
    }
    case isValid(parseAs(DATE_FMT_2)): {
      return formatISO(parseAs(DATE_FMT_2), { representation: "date" });
    }
  }
  throw new Error(`Invalid date: ${dateString}`);
};

export const convertDatetimeToISO8601 = (dtString: string): string => {
  try {
    return parseISO(dtString).toISOString()
  } catch (err) {
    const date = parse(dtString, "yyyy-MM-ddTHH:mm:ssxxxxx", new Date());
    if (!isValid(date)) {
      throw new Error(`Invalid date: ${dtString}`);
    }
    const result = formatISO(date);
    return result
  }
}

enum Sex {
  Female = "FEMALE",
  Male = "MALE",
  NotKnown = "NOT_KNOWN",
}

export const getSex = (gender: string = ""): Sex => {
  switch (gender.toLowerCase()) {
    case "male": {
      return Sex.Male;
    }
    case "female": {
      return Sex.Female;
    }
    default: {
      return Sex.NotKnown;
    }
  }
};

export function makePatientName(nameString: string) {
  const nameParts = nameString.split("~").flatMap(n => n.split("    ")).map(trim); // common to have multiple spaces
  const firstAndLast = nameParts[0].split(" ")
  if (firstAndLast.length === 0) {
    return {
      first_name: "",
      last_name: "",
    }
  }
  if (firstAndLast.length === 1) {
    return {
      first_name: "",
      last_name: firstAndLast[0],
    }
  }
  if (firstAndLast.length === 2) {
    const [first_name, last_name] = firstAndLast.map(lowerCase).map(startCase);
    return {
      first_name,
      last_name,
    }
  }
  const last_name = capitalize(firstAndLast[0]);
  const first_name = startCase(lowerCase(firstAndLast.slice(1).join(" ")));
  return {
    first_name,
    last_name,
  }
}