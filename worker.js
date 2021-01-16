const fs = require("fs");
const readline = require("readline");
const moment = require("moment");

var allData = [];
var dateMap = {};

module.exports = function readFileLineByLine(filePath = "./test.txt") {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(filePath),
    console: false,
  });

  readInterface
    .on("line", function (line) {
      var id = line.split("@")[0];
      var intervalData = line.split("@")[1];
      var arrayForIndividual = intervalData.substring(1, intervalData.length - 1).split(",");

      for (var data of arrayForIndividual) {
        var dataSplit = data.split("/");
        allData.push({ id: Number(id), startDate: new Date(new Date(dataSplit[0]).toISOString()), endDate: new Date(new Date(dataSplit[1]).toISOString()) });
      }
    })
    .on("close", function (line) {
      const sortedByStartDate = allData
        .slice()
        .sort((a, b) => b.startDate - a.startDate)
        .reverse();
      getEarliestFree(sortedByStartDate);

      const sortedByeEndDate = allData.slice().sort((a, b) => b.endDate - a.endDate);
      getLatestFree(sortedByeEndDate);

      getTwoOrMoreWorkersFree(sortedByStartDate);
    });
};

function getEarliestFree(arrayOfDates) {
  console.log("(Question 1) Starting date and time (in UTC) of the earliest interval where any of the workers are free: \n\t" + arrayOfDates[0].startDate.toISOString() + "\n");
}

function getLatestFree(arrayOfDates) {
  console.log("(Question 2) Ending date and time (in UTC) of the latest interval where any of the workers are free: \n\t" + arrayOfDates[0].endDate.toISOString() + "\n");
}

function getTwoOrMoreWorkersFree(arrayOfSortedDates) {
  for (var currentDateIndex = 0; currentDateIndex < arrayOfSortedDates.length; currentDateIndex++) {
    var currentStartDate = arrayOfSortedDates[currentDateIndex].startDate;
    var currentEndDate = arrayOfSortedDates[currentDateIndex].endDate;
    twoDatesMapped(currentStartDate, currentEndDate);
  }
  printIntervals();
}

function twoDatesMapped(currentStartDate, currentEndDate) {
  for (var currentIndex = currentStartDate; currentIndex < moment(currentEndDate).add(15, "m").toDate(); currentIndex = moment(currentIndex).add(15, "m").toDate()) {
    if (currentIndex in dateMap) {
      dateMap[currentIndex] = dateMap[currentIndex] + 1;
    } else {
      dateMap[currentIndex] = 1;
    }
  }
}

function printIntervals() {
  console.log("(Question 3) Intervals of date and times (in UTC) where there are at least 2 workers free:");

  var startInterval = undefined;
  var endInterval = undefined;
  for (const [key, value] of Object.entries(dateMap)) {
    if (value > 1 && startInterval == undefined) {
      startInterval = key;
    }
    if (value < 2 && startInterval != undefined) {
      console.log("\t" + startInterval + " / " + endInterval);
      startInterval = undefined;
    }
    endInterval = key;
  }
  if (startInterval != undefined) {
    console.log("\t" + startInterval + " / " + endInterval);
  }
}
