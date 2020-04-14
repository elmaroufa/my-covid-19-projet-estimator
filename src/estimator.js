// function return timeToElapse in the days format 
const convertTimeToElaoseToDay = (periodType, timeToElapse) => {
    
    if(periodType === 'weeks')
   {
       return timeToElapse*7
   }
   else if (periodType === 'months')
    {
        return timeToElapse * 30;
    }
    else {
        return timeToElapse;
    }
}

// function calcul power to day using estimate currentlyInfected
const powerToDays = (days) => {
   return Math.trunc(days / 3);
}

// function calcul currentlyInfected
const calculCurrentlyInfected = (reportedCases, multiple) => {
   return reportedCases * multiple;
}

/* function calcul infection by requested 
@param currentlyInfected
@param mypowerToDays
*/
const calculInfectionByRequestedTime = (currentlyInfected, mypowerToDays) => {
   return currentlyInfected * Math.pow(2, mypowerToDays);
}

// function calcul severe CaseBy requested Time
const calculSevereCaseByrequestedTime = (infectionByRequestedTime) => {
   return Math.trunc(infectionByRequestedTime * 0.15);
}

// function calcul value hospital beds by requested time
const caclulHospitalBedsByRequestedTime = (hospitalBeds, severeCasesByRequestedTime) => {
   let value = 0.35 * hospitalBeds;
   return Math.trunc(value - severeCasesByRequestedTime);
}

// function calcul casesForICUByRequestedTime
const calculcasesForICUByRequestedTime = (infectionsByRequestedTime) => {
   return Math.trunc( 0.05 * infectionsByRequestedTime);
}

// function calcul casesForVentilatorsByRequestedTime
const calculcasesForVentilatorsByRequestedTime = (infectionsByRequestedTime) => {
   return Math.trunc(0.02 * infectionsByRequestedTime);
}

/* function to calcul dollarsInFlight
* @param infectionsByRequestedTime
* @param periodeDay
* @param avgDailyIncomeInUSD
* @param avgDailyIncomePopulation
*/
const calculDollarsInFlight = (infectionByRequestedTime, periodeDay, avgDailyIncomeInUSD, avgDailyIncomePopulation) => {
   return Math.trunc(infectionByRequestedTime * periodeDay * avgDailyIncomePopulation * avgDailyIncomeInUSD);
}

const covid19ImpactEstimator = (data) => {
    const input = data;
    let daysCacul = convertTimeToElaoseToDay(data.periodType, data.timeToElapse);
    let mypowerToDays = powerToDays(daysCacul);

    /**
     * variable end Ip = impact  and variable end Si = SevereImpact
     * declaration des variables et calcul des attributs de impact et severeimpact
     */
    let valCurrentlyInfectedIp = calculCurrentlyInfected(data.reportedCases, 10);
    let valCurrentlyInfectedSi = calculCurrentlyInfected(data.reportedCases, 50);
    let valInfectionByRequestedTimeIp = calculInfectionByRequestedTime(valCurrentlyInfectedIp, mypowerToDays);
    let valInfectionByRequestedTimeSi = calculInfectionByRequestedTime(valCurrentlyInfectedSi, mypowerToDays);
    let valSevereCaseByrequestedTimeIp = calculSevereCaseByrequestedTime(valInfectionByRequestedTimeIp);
    let valSevereCaseByrequestedTimeSi = calculSevereCaseByrequestedTime(valInfectionByRequestedTimeSi);
    let valHospitalBedsByRequestedTimeIp = caclulHospitalBedsByRequestedTime(data.totalHospitalBeds, valSevereCaseByrequestedTimeIp);
    let valHospitalBedsByRequestedTimeSi = caclulHospitalBedsByRequestedTime(data.totalHospitalBeds, valSevereCaseByrequestedTimeSi);
    let valCasesForICUByRequestedTimeIp = calculcasesForICUByRequestedTime(valInfectionByRequestedTimeIp);
    let valCasesForICUByRequestedTimeSi = calculcasesForICUByRequestedTime(valInfectionByRequestedTimeSi);
    let valcasesForVentilatorsByRequestedTimeIp = calculcasesForVentilatorsByRequestedTime(valInfectionByRequestedTimeIp);
    let valcasesForVentilatorsByRequestedTimeSi = calculcasesForVentilatorsByRequestedTime(valInfectionByRequestedTimeSi);
    let valdollarsInFlightIp = calculDollarsInFlight(valInfectionByRequestedTimeIp, daysCacul, data.region.avgDailyIncomeInUSD, data.region.avgDailyIncomePopulation);
    let valdollarsInFlightSi = calculDollarsInFlight(valInfectionByRequestedTimeSi, daysCacul, data.region.avgDailyIncomeInUSD, data.region.avgDailyIncomePopulation)
    return {
        data: data,
        estimate: {
        impact: {
            currentlyInfected: valCurrentlyInfectedIp,
            infectionByRequestedTime: valInfectionByRequestedTimeIp,
            severeCasesByRequestedTime: valSevereCaseByrequestedTimeIp,
            hospitalBedsByRequestedTime: valHospitalBedsByRequestedTimeIp,
            casesForICUByRequestedTime: valCasesForICUByRequestedTimeIp,
            casesForVentilatorsByRequestedTime: valcasesForVentilatorsByRequestedTimeIp,
            dollarsInFlight: valdollarsInFlightIp
        },
        severeImpact: {
            currentlyInfected: valCurrentlyInfectedSi,
            infectionByRequestedTime: valInfectionByRequestedTimeSi,
            severeCasesByRequestedTime: valSevereCaseByrequestedTimeSi,
            hospitalBedsByRequestedTime: valHospitalBedsByRequestedTimeSi,
            casesForICUByRequestedTime: valCasesForICUByRequestedTimeSi,
            casesForVentilatorsByRequestedTime: valcasesForVentilatorsByRequestedTimeSi,
            dollarsInFlight: valdollarsInFlightSi
        }
     }
    }
};

export default covid19ImpactEstimator;
