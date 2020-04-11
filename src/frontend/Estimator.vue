<template>
  <div class="max-w-full px-10 py-6">
    <h1 class="text-center">Covid-19 Estimations Calculator</h1>
    <div class="flex flex-col lg:flex-row lg:justify-between items-start">
      <div class="w-full lg:w-1/2 p-6">
        <div class="flex flex-row justify-between items-center -mx-4">
          <label class="w-1/2 mr-8">
            <span class="block text-sm font-semibold">
              Population
            </span>
            <input type="number" name="population" data-population
              v-model="sourceData.population"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200
              rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          </label>
          <label class="w-1/2">
            <span class="block text-sm font-semibold">
              Reported Cases
            </span>
            <input type="number" name="reportedCases" data-reported-cases
              v-model="sourceData.reportedCases"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200
              rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          </label>
        </div>
        <div class="flex flex-row w-full mt-10 -mx-4">
          <label class="w-1/2 block">
            <span class="block text-sm font-semibold">
              Total Hospital Beds
            </span>
            <input type="number" name="totalHospitalBeds" data-total-hospital-beds
              v-model="sourceData.totalHospitalBeds"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200
              rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          </label>
        </div>
        <div class="flex flex-row justify-between items-center mt-10 -mx-4">
          <label class="w-1/2 mr-8">
            <span class="block text-sm font-semibold">
              Time to Elapse
            </span>
            <input type="number" name="timeToElapse" data-time-to-elapse
              v-model="sourceData.timeToElapse"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200
              rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          </label>
          <label class="w-1/2">
            <span class="block text-sm font-semibold">
              Period Type
            </span>
            <div class="relative">
              <select name="periodType" data-period-type v-model="sourceData.periodType"
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200
                  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </label>
        </div>
        <div class="mt-8 -mx-4 pt-6 border-t border-gray-300">
          <button data-go-estimate @click.prevent="runEstimations"
            class="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded text-center">
            Generate Estimations
          </button>
        </div>
      </div>

      <div class="w-full lg:w-1/2 p-6 mt-10 ld:mt-0">
        <div class="w-full rounded overflow-hidden shadow-lg">
          <div class="px-6 pt-4">
            <h3 class="text-lg text-gray-800 text-center my-20" v-if="! estimations">Results Will Appear Here</h3>
            <div v-if="estimations">
              <div class="text-gray-700 text-base">
                <div>
                  <h4 class="text-sm uppercase border-b border-gray-200 inline-block">Currently Infected</h4>
                  <div>
                    <span class="text-3xl font-semibold">{{ e(estimations.impact.currentlyInfected) }}</span>
                    <span class="flex text-xl -mt-1 block items-center">{{ e(estimations.severeImpact.currentlyInfected) }}
                      <span class="inline-block bg-red-200 rounded-full px-3 py-1 text-xs font-semibold text-red-700 ml-2">
                        likely
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="font-bold uppercase text-3xl mb-6 mt-10 text-center">
                In {{ sourceData.timeToElapse }} {{ sourceData.periodType }}
              </div>
              <div class="text-gray-700 text-base mb-4">
                <div>
                  <div class="flex flex-row justify-between items-center">
                    <div class="w-1/2">
                      <h5 class="text-sm uppercase border-b border-gray-200 inline-block">Infections</h5>
                      <div>
                        <span class="text-3xl font-semibold">{{ e(estimations.impact.infectionsByRequestedTime) }}</span>
                        <span class="flex text-xl -mt-1 block items-center">{{ e(estimations.severeImpact.infectionsByRequestedTime) }}
                          <span class="inline-block bg-red-200 rounded-full px-3 py-1 text-xs font-semibold text-red-700 ml-2">
                            likely
                          </span>
                        </span>
                      </div>
                    </div>
                    <div class="w-1/2">
                      <h5 class="text-sm uppercase border-b border-gray-200 inline-block">Severe Infections</h5>
                      <div>
                        <span class="text-3xl font-semibold">{{ e(estimations.impact.severeCasesByRequestedTime) }}</span>
                        <span class="flex text-xl -mt-2 block items-center">{{ e(estimations.severeImpact.severeCasesByRequestedTime) }}
                          <span class="inline-block bg-red-200 rounded-full px-3 py-1 text-xs font-semibold text-red-700 ml-2">
                            likely
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-row justify-between items-center mt-8">
                    <div class="w-full">
                      <h5 class="text-sm uppercase border-b border-gray-200 inline-block">Available Hospital Beds</h5>
                      <div>
                        <span class="text-3xl font-semibold">{{ e(estimations.impact.hospitalBedsByRequestedTime) }}</span>
                        <span class="flex text-xl -mt-1 block items-center">{{ e(estimations.severeImpact.hospitalBedsByRequestedTime) }}
                          <span class="inline-block bg-red-200 rounded-full px-3 py-1 text-xs font-semibold text-red-700 ml-2">
                            likely
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-row justify-between items-center mt-8">
                    <div class="w-1/2">
                      <h5 class="text-sm uppercase border-b border-gray-200 inline-block">ICU Cases</h5>
                      <div>
                        <span class="text-3xl font-semibold">{{ e(estimations.impact.casesForICUByRequestedTime) }}</span>
                        <span class="flex text-xl -mt-1 block items-center">{{ e(estimations.severeImpact.casesForICUByRequestedTime) }}
                          <span class="inline-block bg-red-200 rounded-full px-3 py-1 text-xs font-semibold text-red-700 ml-2">
                            likely
                          </span>
                        </span>
                      </div>
                    </div>
                    <div class="w-1/2">
                      <h5 class="text-sm uppercase border-b border-gray-200 inline-block">Needed Ventilators</h5>
                      <div>
                        <span class="text-3xl font-semibold">{{ e(estimations.impact.casesForVentilatorsByRequestedTime) }}</span>
                        <span class="flex text-xl -mt-1 block items-center">{{ e(estimations.severeImpact.casesForVentilatorsByRequestedTime) }}
                          <span class="inline-block bg-red-200 rounded-full px-3 py-1 text-xs font-semibold text-red-700 ml-2">
                            likely
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Estimator from './../estimator.js';

  const EstimatorComponent = {
    data() {
      return {
        sourceData: {
          population: 0,
          reportedCases: 0,
          totalHospitalBeds: 0,
          periodType: "days",
          timeToElapse: 0
        },
        estimations: null,
      };
    },

    computed: {
      data () {
        return {
          region: {
            name: 'Africa',
            avgAge: 19.7,
            avgDailyIncomeInUSD: 5,
            avgDailyIncomePopulation: 0.71
          },
          periodType: this.sourceData.periodType,
          timeToElapse: this.sourceData.timeToElapse,
          reportedCases: this.sourceData.reportedCases,
          population: this.sourceData.population,
          totalHospitalBeds: this.sourceData.totalHospitalBeds
        };
      }
    },

    methods: {
      runEstimations () {
        this.estimations = Estimator(this.data);
      },

      e (number) {
        return Number(number).toLocaleString();
      }
    }
  };

  export default EstimatorComponent;
</script>