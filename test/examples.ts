import { expect } from 'chai';
import { GenericValueMap } from '../src/engine/flow';
import * as Examples from  '../src/examples'
import { ExampleMap } from '../src/examples/types';

describe('Examples', function () {
  this.timeout('3s');

  it('run without errors', () => {
    type MapPromise = Promise<GenericValueMap>;
    const promises: MapPromise[] = [];

    Object.keys(Examples).forEach((exampleName) => {
      const exampleMap: ExampleMap = Examples;
      promises.push(exampleMap[exampleName]());
    });

    return Promise.all(promises);
  });
});
