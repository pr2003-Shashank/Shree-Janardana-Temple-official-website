import React, { useState } from "react";
import './login.scss';
import Logo from '../assets/images/Janardana.jpeg';
import { Link, TextField, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Button, Stack } from "@mui/material";
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

function Login() {

	const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    const handleLoginAccess = (e) => {
        e.preventDefault(); // Prevent form submission
        if (loginData.username === "admin" && loginData.password === "admin") {
            sessionStorage.setItem("isAuthenticated", "true"); // Store auth state
            navigate('/admin'); // Navigate to admin page
        } else {
            alert("Invalid username or password");
        }
    };

    return (
        <div className="login_container">
            <form onSubmit={handleLoginAccess}>
                <Stack
                    spacing={3}
                    direction='column'
                    justifyContent="center"
                    alignItems="center"
                >
                    <img
                        className='logo'
                        src={Logo}
                        alt="janardana"
                    />
                    <Typography>Login</Typography>

                    <TextField
                        id="username"
                        label="Username"
                        type="text"
                        value={loginData.username}
                        onChange={(e) => {
                            setLoginData({ ...loginData, username: e.target.value });
                        }
                        }
                    />
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            value={loginData.password}
                            onChange={(e)=>{
                                setLoginData({...loginData,password: e.target.value});
                            }}
                        />
                        <div className="forgot_pass">
                            <Link href='#'>Forgot Password?</Link>
                        </div>
                    </FormControl>
                    <Button
                        variant='contained'
                        type="submit"
                    >
                        Login
                    </Button>
                </Stack>
            </form>
        </div>
    )
}

export default Login;