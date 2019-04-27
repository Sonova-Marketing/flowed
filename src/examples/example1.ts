import {FlowManager} from '../engine/flow-manager';
import {GenericValueMap} from '../engine/flow';
import {Task} from '../engine/task';


class TimerResolver {

    public async exec(params: GenericValueMap, task: Task): Promise<GenericValueMap> {

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({a:1});
            }, 500);
        });
    }
}

class DirectResolver {

    public async exec(params: GenericValueMap, task: Task): Promise<GenericValueMap> {

        return {b:2};
    }
}

export function example1() {

    FlowManager.run({
            tasks: {
                B: {
                    requires: ['param1'],
                    provides: ['b1'],
                    resolver: 'timer',
                },
                C: {
                    requires: ['param2'],
                    provides: ['c1', 'c2'],
                    resolver: 'direct',
                },
                A: {
                    requires: ['b1', 'c1', 'c2'],
                    provides: ['a4', 'a5'],
                    resolver: 'timer',
                },
                D: {
                    requires: ['a4', 'a5'],
                    provides: ['d3'],
                    resolver: 'timer',
                },
                E: {
                    requires: ['a5', 'f1'],
                    provides: ['e3'],
                    resolver: 'timer',
                },
                F: {
                    requires: ['param3'],
                    provides: ['f1'],
                    resolver: 'direct',
                },
                G: {
                    requires: ['d3', 'e3'],
                    provides: ['g1'],
                    resolver: 'timer',
                },
            },
        },
        {
            param1: 'PARAM1',
            param2: 'PARAM2',
            param3: 'PARAM3',
        },
        ['g1', 'g2'],
        {
            timer: TimerResolver,
            direct: DirectResolver
        },
    ).then(result => {
        console.log('FLOW FINISHED:', result);
    });

};
