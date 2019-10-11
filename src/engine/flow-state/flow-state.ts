import { Flow } from '..';
import { GenericValueMap, TaskResolverMap } from '../../types';
import { FlowRunStatus, FlowStateEnum, FlowTransitionEnum } from '../flow-types';
import { IFlow } from './iflow';

export abstract class FlowState implements IFlow {
  public runStatus: FlowRunStatus;
  protected flow: Flow;

  public constructor(flow: Flow) {
    this.flow = flow;
    this.runStatus = flow.runStatus;
  }

  public start(
    params: GenericValueMap = {},
    expectedResults: string[] = [],
    resolvers: TaskResolverMap = {},
    context: GenericValueMap = {},
  ): Promise<GenericValueMap> {
    throw this.createTransitionError(FlowTransitionEnum.Start);
  }

  public finished(error: Error | boolean = false) {
    throw this.createTransitionError(FlowTransitionEnum.Finished);
  }

  public pause(): Promise<GenericValueMap> {
    throw this.createTransitionError(FlowTransitionEnum.Pause);
  }

  public paused() {
    throw this.createTransitionError(FlowTransitionEnum.Paused);
  }

  public resume() {
    throw this.createTransitionError(FlowTransitionEnum.Resume);
  }

  public stop(): Promise<GenericValueMap> {
    throw this.createTransitionError(FlowTransitionEnum.Stop);
  }

  public stopped() {
    throw this.createTransitionError(FlowTransitionEnum.Stopped);
  }

  public reset() {
    throw this.createTransitionError(FlowTransitionEnum.Reset);
  }

  public abstract getStateCode(): FlowStateEnum;

  public setState(newState: FlowState) {
    this.flow.setState(newState);
  }

  public initRunStatus() {
    this.flow.initRunStatus();
  }

  public execFinishResolve() {
    this.flow.execFinishResolve();
  }

  public execFinishReject(error: Error) {
    this.flow.execFinishReject(error);
  }

  public execPauseResolve() {
    this.flow.execPauseResolve();
  }

  public execPauseReject(error: Error) {
    this.flow.execPauseReject(error);
  }

  public execStopResolve() {
    this.flow.execStopResolve();
  }

  public execStopReject(error: Error) {
    this.flow.execStopReject(error);
  }

  public isRunning() {
    return this.flow.isRunning();
  }

  protected createTransitionError(transition: string) {
    return new Error(`Cannot execute transition ${transition} in current state ${this.getStateCode()}.`);
  }
}
