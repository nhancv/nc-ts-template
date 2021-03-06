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

import Telegraf from 'telegraf'
import RilModule from "../../../Base/RilModule";
import BotCommand from "./Command/BotCommand";
import BotBase from "./BotBase";
import ChatIdCommand from "./Command/ChatIdCommand";

export default class TemplateBot extends RilModule implements BotBase {

  bot: any;
  botToken: any;
  botAdminId: any;
  botAdminChannelId: any;
  command: any = {};
  commandData: any = {};
  //commands
  chatIdCommand: ChatIdCommand;

  constructor() {
    super();
    this.botToken = process.env.BOT_TOKEN;
    this.botAdminId = process.env.BOT_ADMIN_ID;
    this.botAdminChannelId = process.env.BOT_ADMIN_CHANNEL_ID;
    this.chatIdCommand = new ChatIdCommand('chat_id', 'Get chatId', this);

  }

  async create() {
    this.bot = new Telegraf(this.botToken);
    this.bot.telegram.getMe().then((botInfo) => {
      this.bot.options.username = botInfo.username
    });
    //middleware
    this.bot.use((ctx, next) => {
      if (ctx.updateType == 'callback_query' || ctx.updateType == 'message') {
        return next(ctx);
      }
    });
    this.bot.start((ctx) => ctx.reply(`Xin chào ${ctx.message.from.first_name} ${ctx.message.from.last_name}\n Gõ /help để được hướng dẫn chi tiết nhé.`));
    this.bot.help((ctx) => {
      ctx.reply(
        this.getCommandHelp(this.chatIdCommand) /* TODO: Add command help here */,
        {reply_markup: {remove_keyboard: true}}
      );
      this.resetCommand(String(ctx.message.from.id));
    });

    this.bot.command(this.chatIdCommand.id, this.chatIdCommand.commandCallback);
    /* TODO: Declare command callback */

    // @nhancv 2019-08-31: reset command
    this.bot.on('text', async (ctx) => {
      try {
        let fromId = String(ctx.message.from.id);
        switch (this.command[fromId]) {
          /* TODO: Add command on text */
          default:
            this.resetCommand(fromId);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  async start() {
    if (this.bot) {
      await this.bot.launch();
    }
  }

  async stop() {
    if (this.bot) {
      this.bot.stop();
    }
  }

  async destroy() {
    this.bot = null;
  }

  resetCommand(fromId) {
    this.command[fromId] = null;
    this.commandData[fromId] = null;
  }

  sendMessageToAdmin = (message: string) => {
    this.bot.telegram.sendMessage(this.botAdminChannelId, message).catch(error => {
      console.error(error);
    })
  };

  sendMessage = (message: string, botChannelId: string) => {
    this.bot.telegram.sendMessage(botChannelId, message).catch(error => {
      console.error(error);
    })
  };

  sendDocument = (document: any, botChannelId: string) => {
    this.bot.telegram.sendDocument(botChannelId, document).catch(function (error) {
      console.error(error);
    });
  };

  isAdmin = (id: string): boolean => {
    // @nhancv 9/14/19: Need to parse fromId to String in indexOf case
    return id == this.botAdminId;
  };

  getCommandHelp(command: BotCommand) {
    return `/${command.id} - ${command.text}`;
  }
}
