import { parse, formatISO, isValid } from "date-fns";

export const convertUSDateToISO8601 = (dateString: string): string => {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  if (!isValid(date)) {
    throw new Error(`Invalid date: ${dateString}`);
  }
  const result = formatISO(date, { representation: "date" });
  return result;
};

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
