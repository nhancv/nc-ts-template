/*
 * MIT License
 *
 * Copyright (c) 2019 Nhan Cao
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
 */

import {Request, Response} from 'express'
import IResponse from "./IResponse";
import Util from "../../Base/Util";

export interface IAbout {
  getAbout(req: Request, res: Response): Promise<any>
}

export class About implements IAbout {
  AUTH_TOKEN = process.env.AUTHENTICATION_TOKEN ? process.env.AUTHENTICATION_TOKEN : '';

  getAbout = async (req: Request, res: Response): Promise<any> => {
    const token: string | undefined = req.header('token');
    if (!Util.isEmpty(token) && this.AUTH_TOKEN == token) {
      let response: IResponse = {
        code: 200,
        body: {
          about: 'https://nhancv.github.io'
        }
      };
      return res.status(response.code).json(response);
    }

    let response: IResponse = {
      code: 500,
      body: 'Fuck you.'
    };
    return res.status(response.code).json(response);
  }
}
