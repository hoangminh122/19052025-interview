import { isMainThread, parentPort, threadId } from 'worker_threads';

if(!isMainThread) {
  parentPort.on('message', async(msg) => {
    let { id, task, data, attempts, backoff = 1000 } = msg;
    try {
      console.log(`Running task ${id} on thread ${threadId}`);
      parentPort.postMessage({
        id, result: await eval(task)(data), option: { attempts, backoff }
      })
    } catch (e) {
      parentPort.postMessage({
        id, result: false
      })
    }
  });
}
