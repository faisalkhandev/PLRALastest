// Import necessary dependencies and components
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes } from './Routes/Routes';
import Layout from './Layout/Layout.jsx';
import { Login, RecoverPassword } from './Pages';
import PageNotFound from './Pages/PageNotFound/PageNotFound';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './Utils/Private__Routes.jsx';
import ToastCard from './Components/Common/ToastCard.jsx';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          {/* Layout with private routes */}
          <Route path='/' element={<PrivateRoute />} >
            <Route exact path='' element={<Layout />} >
              {privateRoutes.map((route, idx) => (
                <Route path={route.path} element={<route.component />} key={idx} exact={true} />
              ))}
            </Route>
          </Route>

          {/* Public routes */}
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/forgetpassword' element={<RecoverPassword />} />

          {/* Default route for 404 */}
          <Route exact path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
      <ToastCard />
    </div>
  );
}

export default App;
