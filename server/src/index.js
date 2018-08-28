import 'babel-polyfill';
import { join } from 'path';
import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import stateRouting from './middleware/routing.mw';
import configurePassport from './config/passport';

const CLIENT_PATH = join(__dirname, '../../client');

let app = express();

app.use(morgan('dev'));

// serves files from the client folder (specifically index.html)
app.use(express.static(CLIENT_PATH)); 

// (Post) Requests need to be sent with headers as "Content Type": "application/json"
app.use(express.json());  


// configures Passport from ./config/passport
// this is where the Passport strategy comes from
configurePassport(app);


// routes in the ./routes directory all use /api before any of their url paths
app.use('/api', routes);

// all other routes go to the front end (React) app
app.use(stateRouting);

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
