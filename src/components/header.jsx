import React from "react";
import './header.scss';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../assets/images/Janardana.jpeg';

function Header() {
    const handleRefreshToHomePage = () => {
        window.location.href = '/';
    }
    const navigate = useNavigate();
    return (
        <div className="header_container">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <div className="header_logo">
                          <img src={Logo} alt="logo"></img>
                        </div>
                        <Typography onClick={handleRefreshToHomePage} component="div" sx={{ flexGrow: 1 }}>
                            Shree Janardana Temple
                        </Typography>
                        <Button 
                        autoCapitalize="none"
                        onClick={(e) => {
                            navigate('/booking')
                        }}
                        >Book a Function
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    )
}

export default Header;


