import React, { useState } from 'react';
import './Login.css';
import { Container, TextField, Button, Grid, Typography, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'animate.css';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Anton', 'sans-serif'], // Anton font loaded
  },
});

interface LoginPageProps {
  login: (credentials: { username: string; password: string } ) => void;
  message: { msg: string; type: string } | null;
  setMessage: (message: { msg: string; type: string } | null) => void;
}

const Login: React.FC<LoginPageProps> = (props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credentials = { username, password };
    props.login(credentials);
  };

  const handleUsernameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(ev.target.value);
  };

  const handlePasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(ev.target.value);
  };

  return (
    <Container
      className="login-container"
      component="main"
      maxWidth={false}
    >
      <div className="login-box">
        <Grid container spacing={2} direction="column" alignItems="center">
          <Grid item>
            <div className="animate__animated animate__backInDown">
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontFamily: '"Anton", sans-serif', // Updated to use Anton font
                  fontWeight: 400,
                  fontSize: '3.5rem',
                  lineHeight: 1.2,
                  color: 'white',
                }}
              >
                Kiruna
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            {props.message && props.message.type === 'danger' && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 0,
                    p: 2,
                    backgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red background
                    border: '1px solid rgba(255, 0, 0, 0.4)', // Red border
                    borderRadius: 2,
                    color: 'red',
                    textAlign: 'center',
                  }}
                >
                  {props.message.msg}
                </Box>
              </Grid>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="username"
                type="username"
                value={username}
                onChange={handleUsernameChange}
                required
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                margin="normal"
                variant="outlined"
              />

              <Box mt={2} display="flex" justifyContent="space-between">
                <Button
                  variant="contained" color="error"
                  onClick={() => {
                    props.setMessage(null); // Clear the message
                    navigate('/map'); // Navigate back
                  }}
                >
                  Back
                </Button>
                <Button variant="contained" color="success" type="submit">
                  Enter
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Login;






