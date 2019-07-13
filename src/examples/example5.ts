import { FlowManager } from '../engine/flow-manager';
import { Task } from '../engine/task';
import { GenericValueMap } from '../engine/flow';
import { ExampleFunction } from './types';

class DummyResolver {
  public async exec(params: GenericValueMap, task: Task): Promise<GenericValueMap> {
    return {};
  }
}

export const example5: ExampleFunction = () => {
  return FlowManager.run(
    {
      tasks: {
        A: {
          requires: ['b'],
          provides: ['a'],
          resolver: { name: 'r', params: {}, results: {} },
        },
        B: {
          requires: ['a'],
          provides: ['b'],
          resolver: { name: 'r', params: {}, results: {} },
        },
      },
    },
    {
      b: 1,
    },
    [],
    {
      r: DummyResolver,
    },
  );
};
