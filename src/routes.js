import { ForgotPassword, Login, ResetPassword, VerifyEmail } from './pages/auth';
import { SocialCallback, NotFound, Pages } from './components';
import { isUserAuthenticated } from './helpers';
// import CourseDetail from './pages/Courses/courseDetail';
import GlobalSearch from './pages/globalSearch';
import React, { lazy } from 'react';
const Dashboard = lazy(() => import('./pages/dashboard'))
const Locations = lazy(() => import('./pages/locations'))
const People = lazy(() => import('./pages/people'))
const Equipment = lazy(() => import('./pages/equipment'))
const Training = lazy(() => import('./pages/training'))
const Reports = lazy(() => import('./pages/reports'))
const LocationDetail = lazy(() => import('./pages/locations/locationDetails'))
const EquipmentDetail = lazy(() => import('./pages/equipment/equipmentDetail'))
const PeopleDetail = lazy(() => import('./pages/people/peopleDetails'))
const ReportDetail = lazy(() => import('./pages/reports/reportDetail'))
const EquipmentRegistration = lazy(() => import('./pages/EquipmentRegistration'))
const EditProfile = lazy(() => import('./pages/profile/EditProfile'))
const ChangePassword = lazy(() => import('./pages/profile/ChangePassword'))
const LicenseInfo = lazy(() => import('./pages/profile/LicenseInfo'))
const LicenseHistory = lazy(() => import('./pages/profile/LicenseHistory'))
// const GlobalSearch = lazy(() => import('./pages/globalSearch/index'))
const PrintReport = lazy(() => import('./pages/reports/reportDetail/PrintReport'))
const LawCenter = lazy(() => import('./pages/lawCenter'))
const Medications = lazy(() => import('./pages/Medications'))
const MedicationDetail = lazy(() => import('./pages/Medications/medicationDetail'))
const ProfileInfo = lazy(() => import('./pages/profile/ProfileInfo'))
const Preference = lazy(() => import('./pages/profile/Preference'))
const Credential = lazy(() => import('./pages/Credential'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages//Courses/courseDetail'))

let routes = [
  // public Routes
  { path: '/', component: Login, ispublic: true },
  // { path: '/signup', component: SignUp, ispublic: true },
  { path: '/forgot-password', component: ForgotPassword, ispublic: true },
  { path: '/reset-password', component: ResetPassword, ispublic: true },
  { path: '/verify-email', component: VerifyEmail, ispublic: true },
  { path: '/social/callback', component: SocialCallback, ispublic: true },

  { path: '/profile', component: ProfileInfo },
  { path: '/profile/edit', component: EditProfile },
  { path: '/profile/change-password', component: ChangePassword },
  { path: '/profile/setting', component: Preference },

  { path: '/dashboard/license-info', component: LicenseInfo },
  { path: '/dashboard/license-history', component: LicenseHistory },

  //Equipment
  { path: '/equipment/registration', component: EquipmentRegistration },
  { path: '/equipment/:equipmentId', component: EquipmentDetail },

  //Location
  { path: '/locations/:locationId', component: LocationDetail },

  //People
  { path: '/people/:peopleId', component: PeopleDetail, user: 'user' },
  { path: '/search', component: GlobalSearch, isSearch: true },

  //Medications
  { path: '/medication', component: Medications },
  { path: '/medication/:medicationId', component: MedicationDetail },
  { path: '/medication/registration', component: EquipmentRegistration },

  { path: '/reports/:reportId', component: ReportDetail, isSearch: true, user: 'user' },
  { path: '/report-print', component: PrintReport, isPrint: true },

  //courses
  { path: '/courses/:courseId', component: CourseDetail },


  { path: '/pages/:slug', component: Pages, ispublic: !isUserAuthenticated() },
  // Pages
  { path: '/dashboard', component: Dashboard },
  { path: '/locations', component: Locations },
  { path: '/people', component: People, user: 'user' },
  { path: '/equipment', component: Equipment },
  { path: '/credentials', component: Credential },
  { path: '/courses', component: Courses},
  { path: '/training', component: Training },
  { path: '/reports', component: Reports },
  { path: '/law-center', component: LawCenter },
  { path: '*', component: NotFound, ispublic: true },
];

export default routes;