import { combineReducers } from "redux";
import auth from "./auth";
import location from './location';
import equipment from './equipment';
import people from './people';
import dashboard from './dashboard'
import report from "./report";
import credential from './credentials'
import course from "./course";

export default combineReducers({
  auth,
  location,
  equipment,
  people,
  dashboard,
  report,
  credential,
  course
});
