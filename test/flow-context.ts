import { expect } from 'chai';
import { FlowManager, ValueMap } from '../src';

describe('context for flows', () => {
  it('are used without error', async () => {
    class SampleWithContext {
      public async exec(params: ValueMap, context: ValueMap): Promise<ValueMap> {
        return { result: context.prefix + params.text + context.suffix };
      }
    }

    const flowSpec = {
      tasks: {
        wrap1: {
          provides: ['out1'],
          resolver: {
            name: 'SampleWithContext',
            params: {
              text: { value: 'this is the first task' },
            },
            results: { result: 'out1' },
          },
        },
        wrap2: {
          provides: ['out2'],
          resolver: {
            name: 'SampleWithContext',
            params: {
              text: { value: 'this is the second task' },
            },
            results: { result: 'out2' },
          },
        },
      },
    };

    let texts;

    texts = await FlowManager.run(flowSpec, {}, ['out1', 'out2'], { SampleWithContext }, { prefix: '<<', suffix: '>>' });
    expect(texts).to.be.eql({
      out1: '<<this is the first task>>',
      out2: '<<this is the second task>>',
    });

    texts = await FlowManager.run(flowSpec, {}, ['out1', 'out2'], { SampleWithContext }, { prefix: '(', suffix: ')', moreStuff: 'ignored value' });
    expect(texts).to.be.eql({
      out1: '(this is the first task)',
      out2: '(this is the second task)',
    });

    texts = await FlowManager.run(
      flowSpec,
      {},
      ['out1', 'out2'],
      { SampleWithContext },
      { prefix: 'AT THE BEGINNING ' /* missing suffix on purpose */ },
    );
    expect(texts).to.be.eql({
      out1: 'AT THE BEGINNING this is the first taskundefined',
      out2: 'AT THE BEGINNING this is the second taskundefined',
    });
  });
});
