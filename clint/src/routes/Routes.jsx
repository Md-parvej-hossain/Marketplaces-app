import { createBrowserRouter } from 'react-router';
import Main from '../layouts/Main';
import Home from '../pages/Home';
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import JobDetale from '../pages/JobDetale';
import AddJob from '../pages/AddJob';
import Error from '../components/shared/Error';
import MyPostadeJobs from '../pages/MyPostadeJobs';
import UpdateJobs from '../pages/UpdateJobs';
import PrivateRoutes from './PrivateRoutes';
import MyBids from '../pages/MyBids';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <Error />,
    children: [
      {
        index: true,

        element: <Home />,
      },
      {
        path: '/jobDetals/:id',
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/jobs/${params.id}`),
        element: (
          <PrivateRoutes>
            <JobDetale />
          </PrivateRoutes>
        ),
      },
      {
        path: '/my-posted-jobs',
        element: (
          <PrivateRoutes>
            <MyPostadeJobs />
          </PrivateRoutes>
        ),
      },
      {
        path: '/update-job/:id',
        element: (
          <PrivateRoutes>
            <UpdateJobs />
          </PrivateRoutes>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/jobs/${params.id}`),
      },
      {
        path: '/add-jobs',
        element: (
          <PrivateRoutes>
            <AddJob />
          </PrivateRoutes>
        ),
      },
      {
        path: '/my-bids',
        element: (
          <PrivateRoutes>
            <MyBids />
          </PrivateRoutes>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/registration',
        element: <Register />,
      },
    ],
  },
]);
