// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import supabase from '../../supabaseclient';
import './Home.css';
import { Link } from 'react-router-dom';
import ImageHome from './image.png';

function Home() {

    return (
        <div className="home-container">

            <div className="esq">
        <h1>O MELHOR DESENHO!</h1>
        <h2>VOCÊ QUE ESCOLHE!</h2>
        <br />
        <br />
        <br />
     
        </div>

        <br />

        <div className="dir">
        <img src={ImageHome} alt="" srcset="" />
        <Link to='/login'>
            <button  id='desktop'>CLIQUE AQUI</button>
        </Link>
        <br />
        <br />
        <Link to='/login'>
            <button id='mobile'>CLIQUE AQUI</button>
        </Link>
        </div>

        </div>
    );
}

export default Home;
