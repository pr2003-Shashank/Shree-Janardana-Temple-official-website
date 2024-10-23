import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../renders/footer.jsx';
import Header from '../renders/header.jsx';
import './Main.scss';

const Main = (props) => (
    <div className="main_container" id="wrapper">
        <Header/>
        <Outlet />
        <Footer/>
    </div>
);

export default Main;