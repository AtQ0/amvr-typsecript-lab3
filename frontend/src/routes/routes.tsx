import { RouteObject } from 'react-router-dom';
import Admin from '../pages/admin/Admin';
import AdminModify from '../pages/admin/AdminModify';
import Home from '../pages/Home';
import Posts from '../pages/posts/Posts';
import UserProfile from '../pages/users/[id]/profile';
import EditProfile from '../pages/users/[id]/editProfile';
import RegisterUser from '../pages/register/RegisterUser';

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
//
