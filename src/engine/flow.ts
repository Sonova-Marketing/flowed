import { AnyValue, FlowStateEnum, TaskResolverMap, ValueMap } from '../types';
import { FlowRunStatus, SerializedFlowRunStatus } from './flow-run-status';
import { IFlow } from './flow-state/iflow';
import { FlowSpec } from './specs';
import rawDebug from '../debug';
import { FlowManager } from './flow-manager';
import { FlowState } from './flow-state';

export class Flow implements IFlow {
  protected runStatus!: FlowRunStatus;

  public constructor(spec?: FlowSpec, runState?: SerializedFlowRunStatus, resolvers?: TaskResolverMap, context?: ValueMap) {
    this.runStatus = new FlowRunStatus(this, spec ?? {}, runState);
    if (resolvers) {
      this.runStatus.state.setResolvers(resolvers);
    }
    if (context || runState) {
      this.runStatus.state.setContext(context || {});
    }
  }

  public getStateCode(): FlowStateEnum {
    return this.runStatus.state.getStateCode();
  }

  public start(
    params: ValueMap = {},
    expectedResults: string[] = [],
    resolvers: TaskResolverMap = {},
    context: ValueMap = {},
    options: ValueMap = {},
  ): Promise<ValueMap> {
    return this.runStatus.state.start(params, expectedResults, resolvers, context, options);
  }

  public pause(): Promise<ValueMap> {
    return this.runStatus.state.pause();
  }

  public resume(): Promise<ValueMap> {
    return this.runStatus.state.resume();
  }

  public supplyResult(resultName: string, result: AnyValue): void {
    this.runStatus.state.supplyResult(resultName, result);
  }

  public stop(): Promise<ValueMap> {
    return this.runStatus.state.stop();
  }

  public reset(): void {
    this.runStatus.state.reset();
  }

  public getSerializableState(): SerializedFlowRunStatus {
    return this.runStatus.state.getSerializableState();
  }

  public debug(formatter: string, ...args: AnyValue[]): void {
    this && this.runStatus ? this.runStatus.state.debug(formatter, ...args) : rawDebug('init')(formatter, ...args);
  }

  public log({ n, m, mp, l, e }: { n?: number; m: string; mp?: object; l?: string; e?: string }): void {
    this.debug(FlowState.formatDebugMessage({ n, m, mp, l, e }), [mp]);
    FlowManager.log(FlowState.createLogEntry({ n, m, mp, l, e }, this.runStatus));
  }
}
