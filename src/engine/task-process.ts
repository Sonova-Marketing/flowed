import { GenericValueMap, TaskResolverClass } from '../types';
import { Task } from './task';

export class TaskProcess {
  protected taskResolverConstructor: TaskResolverClass;
  protected context: GenericValueMap;
  protected automapParams: boolean;
  protected automapResults: boolean;
  protected flowId: number;
  protected task: Task;
  constructor(
    taskResolverConstructor: TaskResolverClass,
    context: GenericValueMap,
    automapParams: boolean,
    automapResults: boolean,
    flowId: number,
    task: Task,
  ) {
    this.taskResolverConstructor = taskResolverConstructor;
    this.context = context;
    this.automapParams = automapParams;
    this.automapResults = automapResults;
    this.flowId = flowId;
    this.task = task;
  }

  public run(): Promise<GenericValueMap> {
    const resolver = new this.taskResolverConstructor();

    return new Promise((resolve, reject) => {
      const params = this.task.mapParamsForResolver(this.task.runStatus.solvedReqs.topAll(), this.automapParams, this.flowId);

      const resolverPromise = resolver.exec(params, this.context, this.task);

      if (
        typeof resolverPromise !== 'object' ||
        typeof resolverPromise.constructor === 'undefined' ||
        resolverPromise.constructor.name !== 'Promise'
      ) {
        throw new Error(
          `Expected resolver for task '${this.getCode()}' to return an object or Promise that resolves to object. Returned value is of type '${typeof resolverPromise}'.`,
        );
      }

      resolverPromise.then(
        resolverValue => {
          const results = this.task.mapResultsFromResolver(resolverValue, this.automapResults, this.flowId);
          this.task.runStatus.solvedResults = results;
          resolve(this.task.runStatus.solvedResults);
        },
        (resolverError: Error) => {
          // @todo Check if this is needed even having the .catch
          reject(resolverError);
        },
      ).catch(reject);
    });
  }
}
