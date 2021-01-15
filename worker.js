const fs = require("fs");
const readline = require("readline");

var arrayOfAllStartDates = [];
var arrayOfAllEndDates = [];

const readInterface = readline.createInterface({
  input: fs.createReadStream("./test.txt"),
  console: false,
});

// Parses local file reading it line by line
// Sorts all start and end dates into two seperate arrays
// On close of file call functions to answer questions

readInterface
  .on("line", function (line) {
    var intervalData = line.split("@")[1];
    var arrayForIndividual = intervalData.substring(1, intervalData.length - 1).split(",");

    var startTimes = [];
    var endTimes = [];
    for (var data of arrayForIndividual) {
      var dataSplit = data.split("/");

      startTimes.push(new Date(new Date(dataSplit[0]).toISOString()));
      endTimes.push(new Date(new Date(dataSplit[1]).toISOString()));
    }

    arrayOfAllStartDates = arrayOfAllStartDates.concat(startTimes);
    arrayOfAllEndDates = arrayOfAllEndDates.concat(endTimes);
  })
  .on("close", function (line) {
    getEarliestFree(arrayOfAllStartDates);
    getLatestFree(arrayOfAllEndDates);
    getTwoOrMoreWorkersFree(arrayOfAllStartDates, arrayOfAllEndDates);
  });

// Simple iterate over array returning smallest value

function getEarliestFree(arrayOfDates) {
  var earliest = arrayOfDates[0];
  for (let date of arrayOfDates) {
    if (date < earliest) {
      earliest = date;
    }
  }
  console.log("(Question 1) Starting date and time (in UTC) of the earliest interval where any of the workers are free: \n\t" + earliest.toISOString() + "\n");
}

// Simple iterate over array returning largest value

function getLatestFree(arrayOfDates) {
  var latest = arrayOfDates[0];
  for (let date of arrayOfDates) {
    if (date > latest) {
      latest = date;
    }
  }
  console.log("(Question 2) Ending date and time (in UTC) of the latest interval where any of the workers are free: \n\t" + latest.toISOString() + "\n");
}

function getTwoOrMoreWorkersFree(arrayOfAllStartDates, arrayOfAllEndDates) {
  var printIntervalStartArray = [];
  var printIntervalEndArray = [];

  for (var currentDateIndex = 0; currentDateIndex < arrayOfAllStartDates.length - 1; currentDateIndex++) {
    var intervalDateStart = arrayOfAllStartDates[currentDateIndex];
    var intervalDateEnd = arrayOfAllEndDates[currentDateIndex];
    var printStartInterval = false;
    var printEndInterval = false;

    for (var otherDateIndex = currentDateIndex + 1; otherDateIndex < arrayOfAllStartDates.length; otherDateIndex++) {
      if (arrayOfAllStartDates[otherDateIndex] >= arrayOfAllStartDates[currentDateIndex] && arrayOfAllStartDates[otherDateIndex] < intervalDateEnd) {
        if (!printStartInterval) {
          intervalDateStart = arrayOfAllStartDates[otherDateIndex];
          printStartInterval = true;
        } else {
          if (arrayOfAllStartDates[otherDateIndex] <= intervalDateStart) {
            intervalDateStart = arrayOfAllStartDates[otherDateIndex];
          }
        }
      }

      if (arrayOfAllEndDates[otherDateIndex] <= arrayOfAllEndDates[currentDateIndex] && arrayOfAllEndDates[otherDateIndex] > intervalDateStart) {
        if (!printEndInterval) {
          intervalDateEnd = arrayOfAllEndDates[otherDateIndex];
          printEndInterval = true;
        } else {
          if (arrayOfAllEndDates[otherDateIndex] >= intervalDateEnd) {
            intervalDateEnd = arrayOfAllEndDates[otherDateIndex];
          }
        }
      }
    }

    if (printStartInterval || printEndInterval) {
      var allow = true;
      for (var index = 0; index < printIntervalStartArray.length; index++) {
        if (printIntervalStartArray[index] < intervalDateStart && printIntervalEndArray[index] > intervalDateStart) {
          allow = false;
        }
        if (printIntervalStartArray[index] < intervalDateEnd && printIntervalEndArray[index] > intervalDateEnd) {
          allow = false;
        }

        if (intervalDateStart.getTime() === printIntervalEndArray[index].getTime()) {
          printIntervalEndArray[index] = intervalDateEnd;
        }

        if (intervalDateEnd.getTime() === printIntervalStartArray[index].getTime()) {
          printIntervalStartArray[index] = intervalDateStart;
        }
      }
      if (allow) {
        printIntervalStartArray.push(intervalDateStart);
        printIntervalEndArray.push(intervalDateEnd);
      }
    }
  }

  console.log("(Question 3) Intervals of date and times (in UTC) where there are at least 2 workers free:");
  for (var indexToPrint = 0; indexToPrint < printIntervalStartArray.length; indexToPrint++) {
    console.log("\t" + printIntervalStartArray[indexToPrint].toISOString() + " / " + printIntervalEndArray[indexToPrint].toISOString());
  }
}
