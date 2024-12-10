import { RouteObject } from 'react-router-dom';
import {
  Home,
  UserProfile,
  EditProfile,
  Admin,
  AdminModify,
  Posts,
  RegisterUser,
} from './lazyImports';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/users/:id/profile',
    element: <UserProfile />,
  },
  {
    path: '/users/:id/editProfile',
    element: <EditProfile />,
  },
  {
    path: '/auth/admin',
    element: <Admin />,
  },
  {
    path: '/auth/admin/modify-user/:userId',
    element: <AdminModify />,
  },
  {
    path: '/posts',
    element: <Posts />,
  },
  {
    path: '/register',
    element: <RegisterUser />,
  },
];
