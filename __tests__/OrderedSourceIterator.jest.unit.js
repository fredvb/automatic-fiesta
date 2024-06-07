const LogSource = require("../lib/log-source");
const OrderedSourcesIterator = require("../solution/OrderedSourcesIterator");

describe("Ordered Log Sources Iterator", () => {
  test("It should return entries in chronological order", () => {
    const sources = [];
    for (let i = 0; i < 10; i++) {
      sources.push(new LogSource());
    }

    const entriesIterator = new OrderedSourcesIterator(
      sources,
      (source) => source.pop(),
      (item) => item.date
    );

    let previousEntry = null;
    for (const entry of entriesIterator) {
      if (!previousEntry) {
        previousEntry = entry;
        continue;
      }
      expect(entry.date > previousEntry.date).toBeTruthy();
      previousEntry = entry;
    }
  });
});
