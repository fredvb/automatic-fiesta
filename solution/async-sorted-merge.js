'use strict';

const LogSource = require('../lib/log-source');
const Printer = require('../lib/printer');
const LogSourcePrefetchBuffer = require('./LogSourcePrefetchBuffer');
const OrderedSourcesAsyncIterator = require('./OrderedSourcesAsyncIterator');

/**
 * Print all entries, across all of the *async* sources, in chronological order.
 * @param {LogSource[]} logSources
 * @param {Printer} printer
 */
module.exports = async (logSources, printer) => {
  // Wrap all logSources in a LogSourcePrefetchBuffer
  logSources = logSources.map((source) => {
    return new LogSourcePrefetchBuffer(source, 10, 10, 30);
  });

  // create our log sources iterator.
  const entriesIterator = new OrderedSourcesAsyncIterator(
    logSources,
    async (source) => await source.popAsync(),
    (item) => item.date
  );

  // iterate over all the log entries
  for await (const entry of entriesIterator) {
    printer.print(entry);
  }
  printer.done();

  console.log('Async sort complete.');
};
