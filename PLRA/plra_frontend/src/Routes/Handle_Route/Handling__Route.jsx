import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { publicRoutes, privateRoutes } from '../../Routes/Routes.js'
import Private__Routes from '../../Utils/Private__Routes.jsx'
import Layout from '../../Pages/Setups/Layout.jsx'
import { Login } from '../../Pages/index.js'


const Handling__Route = () => {
    return (
        <div>
            <Routes>
                {/* private route */}
                <Route path='/' element={<Private__Routes />} >
                    {privateRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={<route.component />}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
                <Route path='*' element={<Login />} />
                <Route path="/employee/setup/*" element={<Layout />} />
                <Route path="/leave/*" element={<Layout />} />
            </Routes>
        </div >
    )
}

export default Handling__Route