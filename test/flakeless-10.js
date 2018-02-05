const { assert } = require('chai');
const Flakeless = require('..');

describe('Flakeless base10 output', () => {
  it('is an object', () => {
    const flakeless = new Flakeless({
      outputType: 'base10',
    });

    assert.equal(typeof flakeless, 'object');
    assert.instanceOf(flakeless, Flakeless);
  });

  it('returns a string', () => {
    const flakeless = new Flakeless({
      outputType: 'base10',
    });

    const id = flakeless.next();

    assert.typeOf(id, 'string');
  });

  it('increases', () => {
    // Define a Flakeless counter that outputs in base10.
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base10',
    });

    // Generate a bunch of IDs.
    const ids = [];
    for (let i = 0; i < 1000; i += 1) {
      ids.push(parseInt(flakeless.next(), 10));
    }

    // Sort the IDs.  If the output of next is increasing, this should be exact
    //   same as the not-yet-sorted array.
    const sortedIds = ids.sort();
    assert.deepEqual(ids, sortedIds);
  });

  it('is monotonic', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base10',
    });

    // Generate a bunch of IDs.
    const ids = [];
    for (let i = 0; i < 1000; i += 1) {
      ids.push(parseInt(flakeless.next(), 10));
    }

    // Sort the IDs and remove duplicates.  If the output is monotonic, the
    //   length of the two array should be the same.
    const sortedIds = ids.sort().reduce((prev, curr) => {
      return (curr === prev[0]) ? prev : [curr].concat(prev);
    }, []);
    assert.lengthOf(sortedIds, 1000);
  });

  it('has an encoded timestamp', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now() - 100,
      outputType: 'base10',
      workerID: 0x3ff,
    });

    const id = flakeless.next();

    assert.isAtLeast(id >> 22, 100);
  });

  it('has an encoded worker ID', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base10',
      workerID: 34,
    });

    const id = flakeless.next();

    assert.equal((id & 0x3ff000) >> 12, 34);
  });

  it('has a properly sized workerID', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base10',
      workerID: 0xffffffff,
    });

    const id = flakeless.next() >> 12;

    assert.equal(id & 0x3ff, 0x3ff);
  });

  it('has an encoded counter', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base10',
      workerID: 0x3ff,
    });

    const id = flakeless.next();

    assert.oneOf(id & 0xfff, [0, 1]);
  });
});
