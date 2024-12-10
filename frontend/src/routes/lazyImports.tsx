import React from 'react';

export const Home = React.lazy(() => import('../pages/Home'));
export const UserProfile = React.lazy(() => import('../pages/users/[id]/profile'));
export const EditProfile = React.lazy(() => import('../pages/users/[id]/editProfile'));
export const Admin = React.lazy(() => import('../pages/admin/Admin'));
export const AdminModify = React.lazy(() => import('../pages/admin/AdminModify'));
export const Posts = React.lazy(() => import('../pages/posts/Posts'));
export const RegisterUser = React.lazy(() => import('../pages/register/RegisterUser'));
