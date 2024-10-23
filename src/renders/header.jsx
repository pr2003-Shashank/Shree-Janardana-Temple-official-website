import React from "react";
import './header.scss';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

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
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography onClick={handleRefreshToHomePage} component="div" sx={{ flexGrow: 1 }}>
                            Shree Janardana Temple
                        </Typography>
                        <Button 
                        autoCapitalize="none"
                        onClick={(e) => {
                            navigate('/booking')
                        }}
                        >Book a Function</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    )
}

export default Header;


