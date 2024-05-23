"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
 let currentLogs = []

  // tracking if all the log sources is drained
  let isAllDrained = false

  // initialize current logs for each source
  for (const source of logSources) {
    currentLogs.push(source.pop())
  }

  while (!isAllDrained) {
    let earliestLogIndex = -1
    let earliestLogDate = Infinity

    // find the earliest log entry among current logs
    for (let i = 0; i < currentLogs.length; i++) {
      if (currentLogs[i] && currentLogs[i].date < earliestLogDate) {
        earliestLogIndex = i
        earliestLogDate = currentLogs[i].date
      }
    }

    // if no log entries left in any source, exit loop
    if (earliestLogIndex === -1) {
      isAllDrained = true
      break
    }

    // print the earliest log entry
    printer.print(currentLogs[earliestLogIndex])

    // pop next log entry from the source and update currentLogs array
    currentLogs[earliestLogIndex] = logSources[earliestLogIndex].pop()

    // check if all log sources are drained
    isAllDrained = currentLogs.every((log) => !log)
  }

  return console.log("Sync sort complete.")
}
