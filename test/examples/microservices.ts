import { GenericValueMap } from '../../src';
import { FlowManager } from '../../src/engine';
import { ExampleFunction } from './types';

class CallMicroservice {
  public async exec(params: GenericValueMap): Promise<GenericValueMap> {
    let response;
    if (params.url === 'http://product') {
      response = {
        sku: params.sku,
        name: 'Pencil',
        description: 'A little pencil for the school.',
      };
    } else {
      response = {
        currency: 'BRL',
        value: 3.99,
      };
    }

    return {
      response,
    };
  }
}

class SimpleMerge {
  public async exec(params: GenericValueMap): Promise<GenericValueMap> {
    return {
      result: Object.assign({}, params.obj1, params.obj2),
    };
  }
}

// noinspection JSUnusedGlobalSymbols
export const microservices: ExampleFunction = () => {
  return FlowManager.run(
    {
      tasks: {
        getProdInfo: {
          requires: ['urlProdInfo', 'sku'],
          provides: ['prod-info'],
          resolver: {
            name: 'callMicroservice',
            params: { url: 'urlProdInfo', sku: 'sku' },
            results: { response: 'prod-info' },
          },
        },
        getPriceInfo: {
          requires: ['urlPriceInfo', 'sku'],
          provides: ['price-info'],
          resolver: {
            name: 'callMicroservice',
            params: { url: 'urlPriceInfo', sku: 'sku' },
            results: { response: 'price-info' },
          },
        },
        merge: {
          requires: ['prod-info', 'price-info'],
          provides: ['product'],
          resolver: {
            name: 'simpleMerge',
            params: { obj1: 'prod-info', obj2: 'price-info' },
            results: { result: 'product' },
          },
        },
      },
    },
    {
      sku: 'abc123',
      urlProdInfo: 'http://product',
      urlPriceInfo: 'http://price',
    },
    ['product'],
    {
      callMicroservice: CallMicroservice,
      simpleMerge: SimpleMerge,
    },
  );
};
