import { GenericValueMap } from '../../src';
import { FlowManager } from '../../src/engine';
import { Task } from '../../src/engine';
import { ExampleFunction } from './types';

namespace MathFn {
  export class Sqr {
    public async exec(params: GenericValueMap): Promise<GenericValueMap> {
      return {
        result: params.x * params.x,
      };
    }
  }

  export class Sqrt {
    public async exec(params: GenericValueMap): Promise<GenericValueMap> {
      return {
        result: Math.sqrt(params.x),
      };
    }
  }

  export class Sum {
    public async exec(params: GenericValueMap): Promise<GenericValueMap> {
      return {
        result: params.x + params.y,
      };
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export const example3: ExampleFunction = () => {
  return FlowManager.run(
    {
      tasks: {
        sqr1: {
          requires: ['c1'],
          provides: ['c1^2'],
          resolver: {
            name: 'sqr',
            params: { x: 'c1' },
            results: { result: 'c1^2' },
          },
        },
        sqr2: {
          requires: ['c2'],
          provides: ['c2^2'],
          resolver: {
            name: 'sqr',
            params: { x: 'c2' },
            results: { result: 'c2^2' },
          },
        },
        sum: {
          requires: ['c1^2', 'c2^2'],
          provides: ['sum'],
          resolver: {
            name: 'sum',
            params: { x: 'c1^2', y: 'c2^2' },
            results: { result: 'sum' },
          },
        },
        sqrt: {
          requires: ['sum'],
          provides: ['result'],
          resolver: {
            name: 'sqrt',
            params: { x: 'sum' },
            results: { result: 'result' },
          },
        },
      },
    },
    {
      c1: 3,
      c2: 4,
    },
    ['result'],
    {
      sqr: MathFn.Sqr,
      sqrt: MathFn.Sqrt,
      sum: MathFn.Sum,
    },
  );
};
