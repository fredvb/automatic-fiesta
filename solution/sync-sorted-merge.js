"use strict";

const { getEarliestLogIndex, isAllDrained } = require('./utils')

// Print all entries, across all of the sources, in chronological order.
module.exports = (logSources, printer) => {
	let currentLogs = []

	// tracking if all the log sources is drained
	let allDrained = false

	// initialize current logs for each source
	for (const source of logSources) {
		currentLogs.push(source.pop())
	}

	while (!allDrained) {
		const earliestLogIndex = getEarliestLogIndex(currentLogs)

		// print the earliest log entry
		printer.print(currentLogs[earliestLogIndex])

		// pop next log entry from the source and update currentLogs array
		currentLogs[earliestLogIndex] = logSources[earliestLogIndex].pop()

		// check if all log sources are drained
		allDrained = isAllDrained(logSources)
	}

	return console.log("Sync sort complete.")
}
