import { debug as rawDebug } from 'debug';
import { FlowState } from '.';
import { TaskResolverMap, ValueMap } from '../../types';
import { FlowStateEnum } from '../../types';
const debug = rawDebug('flowed:flow');

export class FlowReady extends FlowState {
  public getStateCode(): FlowStateEnum {
    return FlowStateEnum.Ready;
  }

  public start(params: ValueMap, expectedResults: string[], resolvers: TaskResolverMap, context: ValueMap): Promise<ValueMap> {
    debug(`[${this.runStatus.id}] ▶ Flow started with params:`, params);

    this.setState(FlowStateEnum.Running);

    this.setExpectedResults([...expectedResults]);
    this.setResolvers(resolvers);
    this.setContext(context);
    this.supplyParameters(params);

    this.createFinishPromise();

    // Run tasks
    this.startReadyTasks();

    // Notify flow finished when flow has no tasks
    if (Object.keys(this.getSpec().tasks || {}).length === 0) {
      this.runStatus.state.finished();
    }

    return this.runStatus.finishPromise;
  }

  public getSerializableState() {
    return this.runStatus.toSerializable();
  }
}
