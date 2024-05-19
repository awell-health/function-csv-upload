import { convertUSDateToISO8601 } from "../src/csv/transformations";
describe("date parse", () => {
  it("should fail parse MM/dd/yyyy", () => {
    expect(() => convertUSDateToISO8601("12/31/2021")).toThrow(
      "Invalid date: 12/31/2021"
    );
  });
  it("should parse yyyy-MM-dd", () => {
    expect(convertUSDateToISO8601("2021-12-31")).toBe("2021-12-31");
  });
});
