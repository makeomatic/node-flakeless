const { assert } = require('chai');
const Flakeless = require('..');

describe('Flakeless base64 output', () => {
  it('is an object', () => {
    const flakeless = new Flakeless({
      outputType: 'base64',
    });

    assert.equal(typeof flakeless, 'object');
    assert.instanceOf(flakeless, Flakeless);
  });

  it('returns a string', () => {
    const flakeless = new Flakeless({
      outputType: 'base64',
    });

    const id = flakeless.next();

    assert.typeOf(id, 'string');
  });

  it('is 11 characters long', () => {
    const flakeless = new Flakeless({
      outputType: 'base64',
    });

    const id = flakeless.next();

    assert.lengthOf(id, 11);
  });

  it('increases', () => {
    // Define a Flakeless counter that outputs in base10.
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base64',
    });

    // Generate a bunch of IDs.
    const ids = [];
    for (let i = 0; i < 1000; i += 1) {
      ids.push(flakeless.next());
    }

    // Sort the IDs.  If the output of next is increasing, this should be exact
    //   same as the not-yet-sorted array.
    const sortedIds = ids.sort();
    assert.deepEqual(ids, sortedIds);
  });

  it('is monotonic', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base64',
    });

    // Generate a bunch of IDs.
    const ids = [];
    for (let i = 0; i < 1000; i += 1) {
      ids.push(flakeless.next());
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
      epochStart: Date.now() - 1000,
      outputType: 'base64',
      workerID: 0x3ff,
    });

    const id = flakeless.next();
    const timePart = id[4] + id[5];

    assert.notEqual(timePart, '--');
  });

  it('has an encoded worker ID', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base64',
      workerID: 34,
    });

    const id = flakeless.next();
    const workerID = id[7] + id[8];

    assert.oneOf(workerID, ['-X', 'FX', 'VX', 'kX']);
  });

  it('has a properly sized workerID', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base64',
      workerID: 0xffffffff,
    });

    const id = flakeless.next();
    const workerID = id[7] + id[8];

    assert.oneOf(workerID, ['Ez', 'Uz', 'jz', 'zz']);
  });

  it('has an encoded counter', () => {
    const flakeless = new Flakeless({
      epochStart: Date.now(),
      outputType: 'base64',
      workerID: 0x3ff,
    });

    const id = flakeless.next();
    const counter = id[9] + id[10];

    assert.oneOf(counter, ['--', '-0']);
  });
});
