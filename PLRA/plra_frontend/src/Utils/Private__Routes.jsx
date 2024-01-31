import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoutes = () => {
    const varify_user = () => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            return true
        }
        return false
    }
    return (
        varify_user() ?
            <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateRoutes;



