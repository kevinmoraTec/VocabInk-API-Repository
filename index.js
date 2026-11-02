import express from 'express'
import routes from './src/routes/index.js'
import {logError,clientErrorHandler} from './src/middlewares/error.handler.js'
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
const app = express()

import passport from 'passport';

const port = process.env.PORT || 3000


app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

const whitelist = ['http://localhost:3000', 'http://example2.com', 'http://localhost:8080', 'https://lingoloop.dev','https://app.lingoloop.dev'] 
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(passport.initialize());


app.use(cors(corsOptions));
routes(app);

app.use(logError);
app.use(clientErrorHandler);

app.listen(port,() =>{
    console.log('Server is running on port: http://localhost:'+port);
    
})


