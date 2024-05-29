import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
 
const PrivateRoutes = () => {
    const verifyUser = () => {
        const token = Cookies.get('authToken');
        return !!token;
    };
 
    return verifyUser() ? <Outlet /> : <Navigate to="/login" />;
};
 
export default PrivateRoutes;