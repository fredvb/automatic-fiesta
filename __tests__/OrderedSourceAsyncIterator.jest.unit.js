const LogSource = require("../lib/log-source");
const OrderedSourcesAsyncIterator = require("../solution/OrderedSourcesAsyncIterator");

describe("Ordered Log Sources Iterator", () => {
  test("It should return entries in chronological order", async () => {
    const sources = [];
    for (let i = 0; i < 10; i++) {
      sources.push(new LogSource());
    }

    const entriesIterator = new OrderedSourcesAsyncIterator(
      sources,
      async (source) => await source.popAsync(),
      (item) => item.date
    );

    let previousEntry = null;
    for await (const entry of entriesIterator) {
      if (!previousEntry) {
        previousEntry = entry;
        continue;
      }
      expect(entry.date > previousEntry.date).toBeTruthy();
      previousEntry = entry;
    }
  });
});
