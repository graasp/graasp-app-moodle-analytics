import { LOCAL_API_HOST } from './api';

export const DEFAULT_LANG = 'en';
export const DEFAULT_MODE = 'student';

// avoid breaking the app in production when embedded in different contexts
let defaultApiHost;
try {
  defaultApiHost =
    window.parent.location.hostname === 'localhost' ? LOCAL_API_HOST : null;
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
  defaultApiHost = null;
}

export const DEFAULT_API_HOST = defaultApiHost;

// we haven't decided what to call the teacher mode
export const TEACHER_MODES = ['teacher', 'producer', 'educator', 'admin'];
export const STUDENT_MODES = ['student', 'consumer', 'learner'];

export const DEFAULT_VISIBILITY = 'private';
export const PUBLIC_VISIBILITY = 'public';

export const DATE_FORMAT_SHORT_YEAR = 'DD/MM/YY';
export const DATE_FORMAT_FULL_YEAR = 'DD/MM/YYYY';

export const TICK_NUMBER_FOR_TIME_PERIOD = {
  FULLSCREEN: [4, 7, 10],
  HALFSCREEN: [2, 3, 4],
};

export const TICK_NUMBER_FOR_DATE_FULL_YEAR = [2, 4, 8];

export const SCREEN_SIZE_RANGE = [750, 1200, 1920];

export const VERB_BAR_CHART_MAX_CHART_NUMBER = 16;
