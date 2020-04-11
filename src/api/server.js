import compression from 'compression';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import http from 'http';
import fs from 'fs';
import serveStatic from 'serve-static';
import xml from 'xml-js';
import covid19ImpactEstimator from '../estimator';

const app = express();
app.use(compression());
const server = http.createServer(app);

app.use(bodyParser.json());

const logger = (req, res, next) => {
  const currenTime = new Date();

  res.on('finish', () => {
    const finishTime = new Date();
    const timeDiff = finishTime.getMilliseconds() - currenTime.getMilliseconds();
    const entry = [req.method, req.originalUrl, res.statusCode, `${timeDiff} ms`]
      .join('\t\t');

    fs.appendFile('logs.txt', `\n${entry}`, (err) => {
      if (err) {
        return false;
      }
      return true;
    });
  });

  next();
};
app.use(logger);

const APIController = {
  computeEstimations: (req, res) => {
    let responseType = req.params.type;
    responseType = responseType === 'xml' ? 'xml' : 'json';

    const data = req.body;

    const estimatedDataset = covid19ImpactEstimator(data);

    if (responseType === 'xml') {
      res.type('application/xml');
      const xmlResult = xml.json2xml(estimatedDataset, {
        compact: true,
        ignoreComment: true
      });
      res.send(xmlResult);
      return;
    }

    res.json(estimatedDataset);
  },

  displayLogs: (req, res) => {
    // eslint-disable-next-line consistent-return
    fs.readFile('logs.txt', (err, logEntries) => {
      if (err) {
        return false;
      }

      res.send(logEntries.toString());
    });
  }
};

app.use(serveStatic(path.join(__dirname, '/../../dist')));

const router = express.Router();
app.use(router);

router.route('/logs')
  .get(
    APIController.displayLogs
  );
router.route('/api/v1/on-covid-19')
  .post(
    APIController.computeEstimations
  );

router.route('/api/v1/on-covid-19/:type')
  .post(
    APIController.computeEstimations
  );

router.route('/api/v1/on-covid-19/logs')
  .get(
    APIController.displayLogs
  );

const port = process.env.PORT || 8000;
server.listen(port, () => {
  // console.log('App started on port: ' + port);
});
