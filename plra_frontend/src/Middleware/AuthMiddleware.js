import Cookies from 'js-cookie';
 
const AuthMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/rejected') && action?.payload?.status === 401) {

    // Clear cookies
    Cookies.remove('authToken');
    Cookies.remove('sessionid');
    Cookies.remove('user_id');

    // Redirect to login screen
    window.location.href = '/#/login';
  }

  return next(action);
};

export default AuthMiddleware;
