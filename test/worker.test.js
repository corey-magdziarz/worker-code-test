const assert = require("assert");
const { getEarliestFree, getLatestFree } = require("../worker");

const testData = [
  { id: "0", startDate: new Date("2020-01-01T00:15:00.000Z"), endDate: new Date("2020-01-01T08:15:00.000Z") },
  { id: "1", startDate: new Date("2020-01-01T00:35:00.000Z"), endDate: new Date("2020-01-01T09:15:00.000Z") },
];

describe("Earliest Start Test", () => {
  it("Should return earliest start time", () => {
    assert.strictEqual(getEarliestFree(testData), "2020-01-01T00:15:00.000Z");
  });
});

describe("Latest End Test", () => {
  it("Should return latest end time", () => {
    assert.strictEqual(getLatestFree(testData.slice().sort((a, b) => b.endDate - a.endDate)), "2020-01-01T09:15:00.000Z");
  });
});
