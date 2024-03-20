import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footers/Footers'
import Header from './components/Headers/Header'

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout