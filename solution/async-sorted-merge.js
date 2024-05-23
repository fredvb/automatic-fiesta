"use strict";

const { getEarliestLogIndex, isAllDrained } = require('./utils')

// Print all entries, across all of the *async* sources, in chronological order.
module.exports = async (logSources, printer) => {
	let currentLogs = []

	// tracking if all the log sources is drained
	let allDrained = false

	// Initialize current logs for each source
	for (const source of logSources) {
		currentLogs.push(await source.popAsync())
	}

	while (!allDrained) {
		const earliestLogIndex = getEarliestLogIndex(currentLogs)

		// print the earliest log entry
		printer.print(currentLogs[earliestLogIndex])

		// reload next logs
		currentLogs[earliestLogIndex] = await logSources[earliestLogIndex].popAsync()

		// check if all log sources are drained
		allDrained = isAllDrained(logSources)
	}

	return console.log("Async sort complete.")
}
