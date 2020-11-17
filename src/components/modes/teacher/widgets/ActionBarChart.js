import React from 'react';
import KeyedDatePicker from '../../../common/KeyedDatePicker';
import VerbBarChart from './containers/VerbBarChart';
import { VERB_BAR_CHART_DAY_PICKER_ID_PER_TIME } from './types';

const ActionBarChart = () => {
  return (
    <div>
      <VerbBarChart />
      <KeyedDatePicker id={VERB_BAR_CHART_DAY_PICKER_ID_PER_TIME} />
    </div>
  );
};

export default ActionBarChart;
