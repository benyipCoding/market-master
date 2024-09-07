import { indexOfVol, transferToDateStr } from "../utils/helpers";

describe("indexOfVol function", () => {
  test("should return -1 when input array is null or empty", () => {
    expect(indexOfVol(null as any)).toBe(-1);
    expect(indexOfVol([])).toBe(-1);
  });

  test("should return -1 when array length is less than 6", () => {
    expect(indexOfVol([1, 2, 3, 4, 5])).toBe(-1);
  });

  test("should return index of max value when array length is 6 or more", () => {
    expect(indexOfVol([1, 2, 3, 4, 5, 6])).toBe(5); // 6 is at index 5
    expect(indexOfVol([10, 20, 5, 15, 25, 1])).toBe(4); // 25 is at index 4
  });

  test("should handle arrays with duplicate max values", () => {
    expect(indexOfVol([10, 20, 20, 15, 25, 25])).toBe(4); // First occurrence of 25 is at index 4
  });
});

describe("transferToDateStr function", () => {
  test("should return correct datetime string", () => {
    expect(transferToDateStr("2024/8/13 4:00:00")).toBe("2024-08-13 04:00:00");
  });
});
