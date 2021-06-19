import '@fortawesome/fontawesome-free/css/all.min.css';
import { cty9ExecApi } from 'api/ApiUtils';
import { getMenuByID } from 'api/config';
import 'assets/plugins/nucleo/css/nucleo.css';
import 'assets/scss/argon-dashboard-react.scss';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import PrivateRoute from 'components/PrivateRoute/Index';
import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import { updateMenu } from 'redux/menuSlice';
import { updateAuth, updateUserInfo } from 'redux/userSlice';
// import Login from 'views/Login/Index';
const DashBoard = React.lazy(() => import('layouts/DashBoard'));
const Login = React.lazy(() => import('views/Login/Index'));

function App() {
  const history = useHistory();
  const dispatch = useDispatch();

  //Check is logged in

  useEffect(() => {
    async function getMenu() {
      const token = localStorage.getItem('@token');
      if (token) {
        const [err, resp] = await cty9ExecApi({ url: getMenuByID });
        if (err) {
          dispatch(updateAuth(false));
          dispatch(updateUserInfo(null));
          localStorage.removeItem('@token');
          if (history) {
            history.push('/');
          }
        }
        if (resp) {
          dispatch(updateMenu(resp.data));
        }
      }
    }
    getMenu();
    // eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <PrivateRoute
            path="/dashboard"
            component={(props) => <DashBoard {...props} />}
          />
          <Route path="/login" render={(props) => <Login {...props} />} />
          <Route path="/404" component={NotFound} />
          <Redirect from="/" to="/dashboard/index" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
