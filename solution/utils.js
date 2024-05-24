const getEarliestLogIndex = (logs) => {
	let earliestLogIndex = -1
	let earliestLogDate = Infinity

	// find the earliest log entry among current logs
	for (let i = 0; i < logs.length; i++) {
		if (logs[i] && logs[i].date < earliestLogDate) {
			earliestLogIndex = i
			earliestLogDate = logs[i].date
		}
	}

	return earliestLogIndex
}

const isAllDrained = logSources => {
	return logSources.every((source) => source.drained)
}

module.exports = {
	getEarliestLogIndex,
	isAllDrained
}
