/*
 * MIT License
 *
 * Copyright (c) 2018 Nhan Cao
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * For BullMQ
 * Docs: https://docs.bullmq.io
 * Required: Redis installed first
 */

import {Job, Queue, QueueEvents, QueueScheduler, Worker} from 'bullmq'
import Log from "../../Base/Log";

export default class BullMQJob {

  private static _instance;
  public static get instance(): BullMQJob {
    return this._instance || (this._instance = new this());
  }

  private prefixQueueId = 'TSTEMPLATE_ArN3LzCs';

  private repeatQueue?: Queue;
  private normalQueue?: Queue;

  async execute() {
    // Example cron job
    const repeatQueueId = `${this.prefixQueueId}_cronJob`;
    new QueueScheduler(repeatQueueId);
    this.repeatQueue = new Queue(repeatQueueId);
    // Clear all repeat jobs
    await this.repeatQueue.clean(0, 5000, 'active');
    await this.repeatQueue.clean(0, 5000, 'wait');
    await this.repeatQueue.clean(0, 5000, 'paused');
    await this.repeatQueue.clean(0, 5000, 'delayed');
    await this.repeatQueue.clean(0, 5000, 'failed');
    await this.repeatQueue.clean(0, 5000, 'completed');
    new Worker(repeatQueueId, async (job: Job) => {
      Log.info(`CronQueue: ${job.name}: ${JSON.stringify(job.data)}`);
    }).on('completed', (job: Job) => {
      Log.info(`CronQueue job:${job.id} has completed!`);
    });
    // Repeat job every minute.
    await this.repeatQueue.add('every_min', {color: 'yellow'},
      {
        repeat: {
          cron: '* * * * *'
        }
      });


    // Create new queue and push some jobs
    const normalQueueId = `${this.prefixQueueId}_normalQueue`;
    this.normalQueue = new Queue(normalQueueId);

    // Tracking specific queue internally
    const worker = new Worker(normalQueueId, async (job: Job) => {
      // Will print { foo: 'bar'} for the first job
      // and { qux: 'baz' } for the second.
      Log.info(`${job.name}: ${JSON.stringify(job.data)}`);
    });
    worker.on('completed', (job: Job) => {
      Log.info(`Worker job:${job.id} has completed!`);
    });
    worker.on('failed', (job: Job, err) => {
      Log.info(`Worker job:${job.id} has failed with ${err.message}`);
    });

    // Tracking queue events globally
    const queueEvents = new QueueEvents(normalQueueId);
    queueEvents.on('completed', (event) => {
      Log.info(`Event job:${event.jobId} has completed!`);
    });
    queueEvents.on('failed', (event, err) => {
      Log.info(`Event job:${event.jobId} has failed with ${err.message}`);
    });

    // Test
    await this.addJobs();

  }

  addJobs = async () => {
    if(this.normalQueue) {
      const jobOption = {
        attempts: 3,
        backoff: 3,
        timeout: 60000,
        removeOnComplete: true
      };
      await this.normalQueue.add('myJobName1', {foo: 'bar'}, jobOption);
      await this.normalQueue.add('myJobName2', {qux: 'baz'}, jobOption);
    }
  }
}

