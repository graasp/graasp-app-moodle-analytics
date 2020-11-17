import moment from 'moment';
import _ from 'lodash';
import { DATE_FORMAT_SHORT_YEAR } from '../../../../../config/settings';
import getComponentById from '../../../../../reducers/chartDataById';

export const DateOfCreation = (creationData) => {
  const {
    data: { importedData },
  } = creationData;

  const { timecreated } = importedData[0];

  return new Date(timecreated);
};

export const moodleData = (appIR) => {
  const moodle = [];

  appIR.forEach((e) => {
    const { type } = e;

    if (type === 'moodle_data') {
      moodle.push(e);
    }
  });

  return moodle;
};

export const fromDate = (chartDataById, id) => {
  if (chartDataById) {
    const componentByIdElement = getComponentById(chartDataById, id)[id];
    if (componentByIdElement) {
      return componentByIdElement.from;
    }
  }
  return undefined;
};

export const toDate = (chartDataById, id) => {
  if (chartDataById) {
    const componentByIdElement = getComponentById(chartDataById, id)[id];
    if (componentByIdElement) {
      return componentByIdElement.to;
    }
  }
  return undefined;
};

export const buildDateRange = (from, to) => {
  let fromTmp = moment(from);
  const toTmp = moment(to);

  let dates = [];
  while (fromTmp.isSameOrBefore(toTmp)) {
    dates.push(fromTmp);
    fromTmp = moment(fromTmp).add(1, 'd');
  }

  dates = Array.from(dates);
  return dates;
};

export const Occurrence = (actions, property, attributes) => {
  const data = [];
  let condition = [];
  if (attributes) {
    condition = attributes;
  }
  actions.forEach((action) => {
    let entry = action[property];

    if (property === 'createdAt' || property === 'date') {
      entry = entry.slice(0, 10);
    }

    if (entry && !data.includes(entry) && condition.includes(entry)) {
      data.push(entry);
    }
  });

  data.sort();

  return data;
};

export const createDataForBarChart = (key, value, property) => {
  const data = [];
  // create an object where each key is created linked to a property and assigned to it a set of values
  key.forEach((keyEntry) => {
    const Obj = {};
    property.map((prop) => {
      Obj[prop] = keyEntry;
      return Obj;
    });
    // after creating the key, add the values to this key with an initial value 0
    value.forEach((v) => {
      Obj[v] = 0;
    });
    // add the object to the array of data
    data.push(Obj);
  });
  return data;
};

export const changeDateFormat = (date) => {
  return moment(date).format(DATE_FORMAT_SHORT_YEAR);
};

export const changeDateFormatForBarChart = (dataArray) => {
  const updatedDataArray = [...dataArray];
  updatedDataArray.forEach((e) => {
    const { date } = e;
    // for each object in the data array take the date and change its format
    e.date = date.format(DATE_FORMAT_SHORT_YEAR);
  });
  return updatedDataArray;
};

export const changeDateFormatForArray = (arr) => {
  const temp = [];

  arr.forEach((e) => {
    temp.push(changeDateFormat(new Date(e)));
  });
  return temp;
};

export const nbOfTicks = (
  arrayOfTickValues,
  arrayOfBreakpoints,
  windowsSize,
) => {
  let tick = 0;

  for (let i = 0; i < arrayOfBreakpoints.length; i += 1) {
    if (windowsSize >= arrayOfBreakpoints[i]) {
      tick = arrayOfTickValues[i];
    }
  }

  return tick;
};

function isActionInRange(data, timecreated) {
  return data.find((obj) => obj.date.isSame(timecreated, 'day'));
}

export const fillDataForBarChart = (actions, dataFormat) => {
  // take all the actions and the dataFormat, and loop throughout all actions
  actions.forEach((e) => {
    const { timecreated, action } = e;
    const correspondingObject = isActionInRange(dataFormat, timecreated);
    // if this action occurred in this range increment the corresponding value
    if (action && correspondingObject) {
      correspondingObject[action] += 1;
    }
  });
  return dataFormat;
};

function isActionInTarget(dataFormat, target) {
  return dataFormat.find((actionObj) => actionObj.target === target);
}

const isActionInTheRightContext = (
  action,
  dateRange,
  timecreated,
  dataFormat,
  target,
) => {
  // check if the action occurred in the right range
  if (dateRange.includes(new Date(timecreated).toLocaleDateString())) {
    // check if the action was done in the right target
    const actionObject = isActionInTarget(dataFormat, target);
    if (actionObject) {
      actionObject[action] += 1;
    }
  }
};

export const fillDataForBarChartPerTarget = (
  actions,
  dataFormat,
  dateRange,
) => {
  // take all the actions and the dataFormat, and loop throughout all actions
  actions.forEach((e) => {
    const { timecreated, action, target } = e;
    isActionInTheRightContext(
      action,
      dateRange,
      timecreated,
      dataFormat,
      target,
    );
  });
  return dataFormat;
};

export const combineContents = (listOfContent) => {
  const updatedContentList = [];
  listOfContent.map((content) => {
    content.data.importedData.map((action) => updatedContentList.push(action));
    return updatedContentList;
  });
  return updatedContentList;
};

export const formatChunkDate = (group) =>
  group.length > 1 ? `${group[0]} - ${group[group.length - 1]}` : group[0];

// compute ideal nb of chunk from data
export const getChunkNb = (data, maxChartNb) => {
  return data.length > maxChartNb
    ? Math.ceil(data.length / maxChartNb)
    : data.length;
};

export const chunkArray = (data, maxChartNb) => {
  const chunkNb = getChunkNb(data, maxChartNb);
  let chunks = _.chunk(data, chunkNb);
  if (chunks[0]?.length === data.length) {
    chunks = chunks.flat();
  }
  return chunks;
};

// chunk dates to match chunk data
export const formatDates = (dates, maxChartNb) => {
  const newDates = dates.map((date) => date.format(DATE_FORMAT_SHORT_YEAR));
  let tmp = chunkArray(newDates, maxChartNb);
  if (Array.isArray(tmp[0])) {
    tmp = tmp.map(formatChunkDate);
  }
  return tmp;
};

// chunk data in group to display less barcharts
export const chunkData = (defaultValues, data, maxChartNb) => {
  return chunkArray(data, maxChartNb).map((group) => {
    if (Array.isArray(group)) {
      const values = group.reduce((acc, d) => {
        // increment keys for each value
        Object.keys(d).forEach((k) => {
          acc[k] = acc[k] ? acc[k] + d[k] : d[k];
        });
        return acc;
      }, {});
      // format date to from - to format
      const date = formatChunkDate(group.map(({ date: d }) => d));
      return { ...defaultValues, ...values, date };
    }

    return group;
  });
};
