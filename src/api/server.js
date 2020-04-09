import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import covid19ImpactEstimator from '../estimator';

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

const APIController = {
  computeEstimations: (req, res) => {
    let responseType = req.params.type;
    responseType = responseType === 'xml' ? 'xml' : 'json';

    // Validate Request Data
    // ...
    // ...

    // Fetch data from request
    const data = {
      region: req.body.region,
      periodType: req.body.periodType,
      timeToElapse: req.body.timeToElapse,
      reportedCases: req.body.reportedCases,
      population: req.body.population,
      totalHospitalBeds: req.body.totalHospitalBeds
    };

    const estimatedDataset = covid19ImpactEstimator(data);

    res.json(estimatedDataset);
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



const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log('App started on port: ' + port);
});
