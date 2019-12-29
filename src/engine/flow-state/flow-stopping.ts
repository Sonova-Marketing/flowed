import { debug as rawDebug } from 'debug';
import { FlowState } from '.';
import { FlowStateEnum } from '../../types';
const debug = rawDebug('flowed:flow');

export class FlowStopping extends FlowState {
  public getStateCode(): FlowStateEnum {
    return FlowStateEnum.Stopping;
  }

  public stopped(error: Error | boolean = false) {
    this.setState(FlowStateEnum.Stopped);

    if (error) {
      debug(`[${this.runStatus.id}] ◼ Flow stopped with error.`);
      this.execFinishReject(error as Error);
    } else {
      debug(`[${this.runStatus.id}] ◼ Flow stopped.`);
      this.execFinishResolve();
    }
  }

  protected postProcessFinished(error: Error | boolean, stopFlowExecutionOnError: boolean) {
    this.runStatus.state.stopped(error);
  }
}
