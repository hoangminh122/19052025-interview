import { isMainThread, Worker } from 'worker_threads';

interface IOption {
  attempts: number,
  backoff: number
}

interface Task<data, result> {
  runAsync(data: data, option?: IOption): Promise<result>;
  map<result2>(f: (o: result) => result2): Task<data, result2>;
  then<result2>(f: Task<result, result2>): Task<data, result2>;
}

interface IWorkerPool {
  createTask<data, result>(f: (d: data) => result): Task<data, result>;
  terminate(): Promise<void>;
}

interface WorkerPoolOptions {
  workers: number;
}

export class WorkerPool {
  private _workerPoolIns;
  constructor() {
    if (!this._workerPoolIns && isMainThread)
      this._workerPoolIns = this.createWorkerpool({ workers: 3 });
  }

  getWorkerPoolIns(): IWorkerPool {
    return this._workerPoolIns;
  }

  createWorkerpool = (options: WorkerPoolOptions): IWorkerPool => {
    if(isMainThread){
      const workers = new Map(
        Array.from({ length: options.workers }).map<[number, Worker]>(() => {
          const w = new Worker(`${__dirname}/config.worker.js`, {
            execArgv:
              ['-r',
                'ts-node/register',
                '-r',
                'dotenv/config',
                '-r',
                'tsconfig-paths/register']
          });
          return [w.threadId, w];
        })
      );

      const idle = Array.from(workers.keys());
      const resolvers = new Map<number, (data: any) => any>();
      const backlog: { id: number; task: (data: any) => void; data: any }[] = [];
      let taskIdCounter = 0;
      let terminating = false;

      const runNext = (option?: IOption) => {
        if (terminating) return;
        if (backlog.length == 0 || idle.length == 0) return;
        const task = backlog.shift();
        const worker = idle.shift();
        // console.log(`Scheduling ${task.id} on ${worker}`);
        const msg = { ...task, task: task.task.toString(), ...option };
        workers.get(worker).postMessage(msg);
        runNext(option);
      };

      workers.forEach((w, i) => {
        w.on('message', (data) => {
          const { id, result } = data;
          resolvers.get(Number(id))(result);
          resolvers.delete(id);
          idle.push(i);
          runNext(data.option);
        });
      });

      return {
        createTask<data, result extends any>(f): Task<data, result> {
          try {
            const result = {
              runAsync(data: data, option?: IOption): Promise<result> {
                if (terminating)
                  return Promise.reject(new Error('Workerpool is terminating'));
                taskIdCounter += 1;
                backlog.push({ id: taskIdCounter, task: f, data });
                const p = new Promise<result>((resolve) => {
                  return resolvers.set(taskIdCounter, resolve);
                });
                runNext(option);
                return p;
              },
              map<result2>(f: (r: result) => result2): Task<data, result2> {
                return {
                  ...this,
                  runAsync: (d) => this.runAsync(d).then(f),
                } as any;
              },
              then<result2>(t: Task<result, result2>): Task<data, result2> {
                return {
                  ...this,
                  runAsync: (d) => this.runAsync(d).then((a) => t.runAsync(a)),
                } as any;
              },
            };
            return result;
          } catch (e) {
            console.log(e);
          }
        },
        async terminate() {
          terminating = true;
          await new Promise((resolve: any) => {
            setInterval(() => (idle.length == workers.size ? resolve() : null), 10);
          });
          console.log(`All workers empty`);
          await Promise.all(Array.from(workers.values()).map((v) => v.terminate()));
        },
      };
    }
  };
}
