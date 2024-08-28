import { parseISO } from "date-fns";
import { convertUSDateToISO8601, makePatientName } from "../src/csv/transformations";

describe("transformations", () => {
  describe("convertUSDateToISO8601", () => {
    it("should fail parse MM/dd/yyyy", () => {
      expect(() => convertUSDateToISO8601("12/31/2021")).toThrow(
        "Invalid date: 12/31/2021"
      );
    });
    it("should parse yyyy-MM-dd", () => {
      expect(convertUSDateToISO8601("2021/12/31")).toBe("2021-12-31");
    });
    it("Should throw if datetime", () => {
      const dtString = "2021-12-31T12:00:00+00:00";
      expect(() => convertUSDateToISO8601(dtString)).toThrow();
    });
  });
  describe("convertDatetimeToISO8601", () => {
    it.each([
      {
        value: "2024-08-06T21:22:25+00:00",
        expected: "2024-08-06T21:22:25.000Z",
      },
      {
        value: "2021-01-01T12:00:00+00:00",
        expected: "2021-01-01T12:00:00.000Z",
      },
      {
        value: "2024-08-26T16:59:00+00:00",
        expected: "2024-08-26T16:59:00.000Z",
      },
    ])(
      "should convert a datetime string to ISO8601 format",
      ({ value, expected }) => {
        // Act
        const result = parseISO(value).toISOString();
        // Assert
        expect(result).toEqual(expected);
      }
    );
    it("should throw an error for an invalid datetime string", () => {
      // Arrange
      const dtString = "invalid";
      // Act
      // Assert
      const result = () => parseISO(dtString).toISOString();
      expect(() => result()).toThrow();
    });
  });
  describe("makePatientName", () => {
    const names = [
      {
        name: 'SDJFIJDSIFIJSDF ARTEMIS     CURRENT',
        expected: {
          first_name: 'Sdjfijdsifijsdf',
          last_name: 'Artemis'
        }
      },
      {
        name: 'BHEHEH Hy S    L',
        expected: {
          first_name: 'Hy S',
          last_name: 'Bheheh'
        }
      },
      {
        name: 'CHRISTOPH RAYMOND BLACK    L~CHRISTOPH RAYMOND     A~CHRISTOPH RAYMOND     A',
        expected: {
          first_name: 'Raymond Black',
          last_name: 'Christoph'
        }
      },
      {
        name: 'LEE MEE GEE    L~LEE MEE     A',
        expected: {
          first_name: 'Mee Gee',
          last_name: 'Lee'
        }
      },
      {
        name: 'F    L~sjidfjd',
        expected: {
          first_name: '',
          last_name: 'F'
        }
      }
    ]
      
    it.each(names)('given name from ADT, should create readable name %s',
      ({ name: providedName, expected }) => {
      // Act
      const result = makePatientName(providedName);
      // Assert
      expect(result).toEqual(expected);
    })
  })
});
