"use strict";

const LogSource = require("../lib/log-source");
const Printer = require("../lib/printer");
const OrderedSourcesAsyncIterator = require("./OrderedSourcesAsyncIterator");
// const MinHeap = require("./MinHeap");

/**
 * Print all entries, across all of the *async* sources, in chronological order.
 * @param {LogSource[]} logSources
 * @param {Printer} printer
 */
module.exports = async (logSources, printer) => {
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

  console.log("Async sort complete.");
};
