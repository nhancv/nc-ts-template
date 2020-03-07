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

import RilModule from "../Base/RilModule";
import TemplateBot from "./Provider/TelegramBot/TemplateBot";
import {MongoMigrate} from "./Provider/MongoDB/MongoMigrate";
import {MongoProvider} from "./Provider/MongoDB/MongoProvider";
import EmailNotifier from "./Provider/EmailNotifier";
import CronJob from "./Provider/CronJob";
import BullMQJob from "./Provider/BullMQJob";
import GatewayHook from "../Gateway/GatewayHook";

export default class Business extends RilModule implements GatewayHook {
  async start(): Promise<any> {
    // @nhancv 9/16/19: Connect db
    await MongoProvider.instance.connect();
    // @nhancv 9/16/19: Check migrate
    await new MongoMigrate().migrate();
    // @nhancv 11/22/19: Start bot
    const bot = new TemplateBot();
    await bot.create();
    await bot.start();
    // @nhancv 11/23/19: Start email listener
    const emailNotifier = new EmailNotifier();
    emailNotifier.setBot(bot);
    await emailNotifier.start();
    // @nhancv 11/27/19: Run cron job
    // @nhancv 12/20/19: For premium job queue
    await new BullMQJob().execute();
    // @nhancv 12/20/19: For normal cron job
    const cronJob = new CronJob();
    cronJob.setBot(bot);
    await cronJob.execute();

  }

  async gatewayOutput(data: any): Promise<any> {

  }

  async gatewayRequest(requestData: {id: string, data?: any}): Promise<any> {

  }
}
