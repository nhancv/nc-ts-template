/*
 * Developed by Nhan Cao on 11/22/19, 2:46 PM.
 * Last modified 11/22/19, 2:45 PM.
 * Copyright (c) 2019 Rilthot. All rights reserved.
 */
import moment from "moment";
import express, {Request, Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import IResponse from "./Controller/IResponse";
import RilModule from "../Base/RilModule";
import Util from "../Base/Util";
import Log from "../Base/Log";
import GatewayHook from "./GatewayHook";
import {AboutController, IAboutController} from "./Controller/AboutController";

export default class Gateway extends RilModule {

  gatewayHook: GatewayHook;

  constructor(gatewayHook: GatewayHook) {
    super();
    this.gatewayHook = gatewayHook;
  }

  async start(): Promise<any> {
    const app = express();
    const port = parseInt(process.env.PORT || '7777');

    //////////////////////////////////////////////////////////////////
    /**
     * Config app
     */
    // Body parser: https://github.com/expressjs/body-parser
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    // CORS on ExpressJS: https://github.com/expressjs/cors
    app.use(cors());
    // Cookie parser: https://github.com/expressjs/cookie-parser
    app.use(cookieParser());
    // Use gzip compression
    app.use(compression());
    // Config http logging with morgan
    morgan.token('date', (req, res, tz) => moment().utc().utcOffset("+0700").format());
    // Morgan format: combined | tiny | custom
    const morganFormat = '[:date] :method :url :status - :response-time ms :user-agent';
    app.use(morgan(morganFormat, {stream: Log['morgan']}));
    //////////////////////////////////////////////////////////////////
    /**
     * Auth middleware
     */
    app.use((req, res, next) => {
      const AUTH_TOKEN = process.env.GATEWAY_AUTHENTICATION_TOKEN_IN ? process.env.GATEWAY_AUTHENTICATION_TOKEN_IN : '';
      const token: string | undefined = req.header('token');
      if (!Util.isEmpty(token) && AUTH_TOKEN == token) {
        next();
      } else {
        let response: IResponse = {
          code: 500,
          body: 'Fuck you.'
        };
        return res.status(response.code).json(response);
      }
    });
    //////////////////////////////////////////////////////////////////
    /**
     * Declare controller
     */
    const aboutController: IAboutController = new AboutController();

    /**
     * API calls, use Postman for testing
     * This block should declare before default route
     */
    app.get('/api/about', aboutController.getAbout);

    //////////////////////////////////////////////////////////////////
    /**
     * Default routing
     */
    app.get('*', (req: Request, res: Response) => {
      const goodResponse: IResponse = {
        code: 200,
        body: 'Good.'
      };
      return res.status(goodResponse.code).json(goodResponse);
    });

    /**
     * Setup socket.io
     */
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);
    io.on('connection', (socket) => {
      console.log('A user connected');
      socket.on('message', (data: any) => {
        console.log('Server received:', data);
      });
    });

    /**
     * Test socket client
     */
    const socketClient = require('socket.io-client')(`http://localhost:${port}`);
    socketClient.on('connect', () => {
      console.log('Client connected');
      socketClient.emit('message', 'Hello from client');
    });
    socketClient.on('event', (data) => {
      console.log('Event', data);
    });
    socketClient.on('disconnect', () => {
      console.log('Client disconnect');
    });

    /**
     * Start listen only on localhost domain
     */
    const hostname = process.env.NODE_ENV == 'dev' ? 'localhost' : '0.0.0.0';
    try {
      http.listen(port, hostname, () => {
        Log.info(`Server ${process.env.NODE_ENV} listening at port ${port}`);
      });
    } catch (e) {
      console.error(e);
    }
  }
}
