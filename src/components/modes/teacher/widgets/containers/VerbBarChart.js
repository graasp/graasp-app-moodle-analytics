import { connect } from 'react-redux';
import BarChart from '../components/BarChart';
import {
  buildDateRange,
  combineContents,
  fromDate,
  toDate,
  createDataForBarChart,
  fillDataForBarChart,
  formatDates,
  nbOfTicks,
  changeDateFormatForBarChart,
  chunkData,
  getUniqueVerbs,
} from '../util';
import { DATE, VERB_BAR_CHART_DAY_PICKER_ID_PER_TIME } from '../types';
import {
  SCREEN_SIZE_RANGE,
  TICK_NUMBER_FOR_TIME_PERIOD,
  VERB_BAR_CHART_MAX_CHART_NUMBER,
} from '../../../../../config/settings';

const xAxis = DATE;
const yAxis = 'Occurrence';

const VerbBarChart = (content, from, to) => {
  const dateRange = buildDateRange(from, to);
  let data = combineContents(content);
  const allowedVerbs = getUniqueVerbs(data);
  const formattedData = createDataForBarChart(dateRange, allowedVerbs, [DATE]);
  data = fillDataForBarChart(data, formattedData);
  data = changeDateFormatForBarChart(data);
  data = chunkData({}, data, VERB_BAR_CHART_MAX_CHART_NUMBER);
  return data;
};

const mapStateToProps = ({
  appInstanceResources: { content },
  chartDataById,
  windowSize: { windowSize },
}) => {
  return {
    data: VerbBarChart(
      content,
      fromDate(chartDataById, VERB_BAR_CHART_DAY_PICKER_ID_PER_TIME),
      toDate(chartDataById, VERB_BAR_CHART_DAY_PICKER_ID_PER_TIME),
    ),
    keys: getUniqueVerbs(combineContents(content)),
    indexBy: DATE,
    xAxis,
    yAxis,
    values: formatDates(
      buildDateRange(
        fromDate(chartDataById, VERB_BAR_CHART_DAY_PICKER_ID_PER_TIME),
        toDate(chartDataById, VERB_BAR_CHART_DAY_PICKER_ID_PER_TIME),
      ),
      VERB_BAR_CHART_MAX_CHART_NUMBER,
    ),
    maxTicks: nbOfTicks(
      TICK_NUMBER_FOR_TIME_PERIOD.FULLSCREEN,
      SCREEN_SIZE_RANGE,
      windowSize,
    ),
  };
};

export default connect(mapStateToProps)(BarChart);
