import { takeLatest } from 'redux-saga/effects';

const {
  FETCH_SCHEDULES,
  FETCH_PROVINCES,
  FETCH_CITIES,
  UPLOAD_REQUIREMENT
} = require('../reducers/application/types').default;


import {
  handle_uploadRequirement,
  handle_fetchSchedules,
  handle_fetchProvinces,
  handle_fetchCities,
} from './handlers/application';


export function* watcherSaga() {

  yield takeLatest(FETCH_SCHEDULES, handle_fetchSchedules);
  yield takeLatest(FETCH_PROVINCES, handle_fetchProvinces);
  yield takeLatest(FETCH_CITIES, handle_fetchCities);
  yield takeLatest(UPLOAD_REQUIREMENT, handle_uploadRequirement);
}
