const assert = require("assert");
const { getEarliestFree, getLatestFree, twoDatesMapped } = require("../worker");

const testData1 = [
  { id: "0", startDate: new Date("2020-01-01T00:15:00.000Z"), endDate: new Date("2020-01-01T08:15:00.000Z") },
  { id: "1", startDate: new Date("2020-01-01T00:30:00.000Z"), endDate: new Date("2020-01-01T09:15:00.000Z") },
  { id: "2", startDate: new Date("2020-01-01T01:30:00.000Z"), endDate: new Date("2020-01-01T02:15:00.000Z") },
];

const testData2 = [{ id: "0", startDate: new Date("2020-01-01T02:30:00.000Z"), endDate: new Date("2020-01-01T03:15:00.000Z") }];

const testData3 = [];

const correctMap = {
  "Wed Jan 01 2020 01:30:00 GMT+0000 (Greenwich Mean Time)": 1,
  "Wed Jan 01 2020 01:45:00 GMT+0000 (Greenwich Mean Time)": 1,
  "Wed Jan 01 2020 02:00:00 GMT+0000 (Greenwich Mean Time)": 1,
  "Wed Jan 01 2020 02:15:00 GMT+0000 (Greenwich Mean Time)": 1,
};

describe("Earliest Start Test", () => {
  it("Should return earliest start time, data set contains many", () => {
    var testData = testData1
      .slice()
      .sort((a, b) => b.startDate - a.startDate)
      .reverse();
    assert.strictEqual(getEarliestFree(testData), "2020-01-01T00:15:00.000Z");
  });

  it("Should return earliest start time, data set contains one", () => {
    var testData = testData2
      .slice()
      .sort((a, b) => b.startDate - a.startDate)
      .reverse();
    assert.strictEqual(getEarliestFree(testData), "2020-01-01T02:30:00.000Z");
  });

  it("Should return earliest start time, data set contains none", () => {
    var testData = testData3
      .slice()
      .sort((a, b) => b.startDate - a.startDate)
      .reverse();
    assert.strictEqual(getEarliestFree(testData), "None");
  });
});

describe("Latest End Test", () => {
  it("Should return latest end time, data set contains many", () => {
    var testData = testData1.slice().sort((a, b) => b.endDate - a.endDate);
    assert.strictEqual(getLatestFree(testData), "2020-01-01T09:15:00.000Z");
  });

  it("Should return latest end time, data set contains one", () => {
    var testData = testData2.slice().sort((a, b) => b.endDate - a.endDate);
    assert.strictEqual(getLatestFree(testData), "2020-01-01T03:15:00.000Z");
  });

  it("Should return latest end time, data set contains none", () => {
    var testData = testData3.slice().sort((a, b) => b.endDate - a.endDate);
    assert.strictEqual(getLatestFree(testData), "None");
  });
});

describe("Give start and end date and return the intervals inbetween as a map test", () => {
  it("Should return object mapped correctly", () => {
    assert.deepStrictEqual(twoDatesMapped(testData1[2].startDate, testData1[2].endDate), correctMap);
  });
});
