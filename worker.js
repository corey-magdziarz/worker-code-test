const fs = require("fs");
const readline = require("readline");
const moment = require("moment");

var allData = [];
var dateMap = {};

// Function that reads a file line by line and splits the lines into easy to use data
// Puts all the data into and in the form of id, start date, end date
// On end of file calls three main function that are responsible for the following:
//      Outputting the earliest start time
//      Outputting the latest end time
//      Outputting all time intervals where 2 or more workers are free

function readFileLineByLine(filePath = "./test.txt") {
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
      var earliestFree = getEarliestFree(sortedByStartDate);

      console.log("(Question 1) Starting date and time (in UTC) of the earliest interval where any of the workers are free: \n\t" + earliestFree + "\n");

      const sortedByeEndDate = allData.slice().sort((a, b) => b.endDate - a.endDate);
      var latestFree = getLatestFree(sortedByeEndDate);

      console.log("(Question 2) Ending date and time (in UTC) of the latest interval where any of the workers are free: \n\t" + latestFree + "\n");

      getTwoOrMoreWorkersFree(sortedByStartDate);
    });
}

function getEarliestFree(arrayOfDates) {
  return arrayOfDates[0].startDate.toISOString();
}

function getLatestFree(arrayOfDates) {
  return arrayOfDates[0].endDate.toISOString();
}

function getTwoOrMoreWorkersFree(arrayOfSortedDates) {
  for (var currentDateIndex = 0; currentDateIndex < arrayOfSortedDates.length; currentDateIndex++) {
    var currentStartDate = arrayOfSortedDates[currentDateIndex].startDate;
    var currentEndDate = arrayOfSortedDates[currentDateIndex].endDate;
    twoDatesMapped(currentStartDate, currentEndDate);
  }
  printIntervals();
}

// Function takes in the time period that a worker its quarter hour intervals to the object dateMap

function twoDatesMapped(currentStartDate, currentEndDate) {
  for (var currentIndex = currentStartDate; currentIndex < moment(currentEndDate).add(15, "m").toDate(); currentIndex = moment(currentIndex).add(15, "m").toDate()) {
    if (currentIndex in dateMap) {
      dateMap[currentIndex] = dateMap[currentIndex] + 1;
    } else {
      dateMap[currentIndex] = 1;
    }
  }
}

// Function that deals with output for question 3
// Iterates over map first date and time where the value is greater then 1, date and time is start interval
// Then locates the second date and time where the value is 1, end interval is date and time of the key before this one

function printIntervals() {
  console.log("(Question 3) Intervals of date and times (in UTC) where there are at least 2 workers free:");

  var startInterval = undefined;
  var endInterval = undefined;
  for (const [key, value] of Object.entries(dateMap)) {
    if (value > 1 && startInterval == undefined) {
      startInterval = key;
    }
    if (value < 2 && startInterval != undefined) {
      console.log("\t" + new Date(startInterval).toISOString() + " / " + new Date(endInterval).toISOString());
      startInterval = undefined;
    }
    endInterval = key;
  }

  // Final if statement to handle end of object

  if (startInterval != undefined) {
    console.log("\t" + new Date(startInterval).toISOString() + " / " + new Date(endInterval).toISOString());
  }
}

exports.readFileLineByLine = readFileLineByLine;
exports.getEarliestFree = getEarliestFree;
exports.getLatestFree = getLatestFree;
