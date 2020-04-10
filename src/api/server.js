import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import fs from 'fs';
import xml from 'xml-js';
import covid19ImpactEstimator from '../estimator';

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

const logger = (req, res, next) => {
  const currenTime = new Date();

  res.on('finish', () => {
    const finishTime = new Date();
    const timeDiff = finishTime.getMilliseconds() - currenTime.getMilliseconds();
    const entry = [req.method, req.originalUrl, res.statusCode, `${timeDiff} ms`]
      .join('\t\t');

    fs.open('logs.txt', 'w', (err, fd) => {
      if (err) {
        return false;
      }

      const buffer = Buffer.from(entry);
      fs.write(fd, buffer, 0, buffer.length, null, () => {
        fs.close(fd, () => {});
      });

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
    fs.readFile('logs.txt', (err, logEntries) => {
      if (err) {
        return false;
      }

      return res.send(logEntries);
    });
  }
};

const router = express.Router();
app.use(router);

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
router.route('/logs')
  .get(
    APIController.displayLogs
  );

const port = process.env.PORT || 8000;
server.listen(port, () => {
  // console.log('App started on port: ' + port);
});
