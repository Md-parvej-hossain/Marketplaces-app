import { createBrowserRouter } from 'react-router';
import Main from '../layouts/Main';
import Home from '../pages/Home';
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <p>Error...</p>,
    children: [
      {
        index: true,

        element: <Home />,
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
