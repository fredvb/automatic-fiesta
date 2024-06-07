"use strict";

const LogSource = require("../lib/log-source");
const Printer = require("../lib/printer");
const OrderedSourcesIterator = require("./OrderedSourcesIterator");

/**
 * Print all entries, across all of the sources, in chronological order.
 * @param {LogSource[]} logSources
 * @param {Printer} printer
 */
module.exports = (logSources, printer) => {
  // create our log sources iterator.
  const entriesIterator = new OrderedSourcesIterator(
    logSources,
    (source) => source.pop(),
    (item) => item.date
  );

  // iterate over all the log entries
  for (const entry of entriesIterator) {
    printer.print(entry);
  }
  printer.done();

  console.log("Sync sort complete.");
};
