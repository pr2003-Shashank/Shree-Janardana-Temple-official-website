import React from "react";
import Banner from '../assets/images/Home_banner.png';
import './home.scss';

function Home(){
    return(
        <div className="home_container">
            <div className="banner_conatiner">
                <img className="banner_image" src={Banner} alt="Janardana Temple"/>
            </div>
        </div>
    )
}

export default Home;