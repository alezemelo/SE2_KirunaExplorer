import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Define types for props
interface LoginPageProps {
  login: (credentials: { username: string; password: string }) => void;
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
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
        padding: 3,
      }}
    >
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
        </Grid>

        {props.message && (
        <Grid item>
            <Alert
            severity={props.message.type as 'error' | 'info' | 'success' | 'warning'}  // Type assertion here
            sx={{ width: '100%', mb: 2 }}
            onClose={() => props.setMessage(null)}
            >
            {props.message.msg}
            </Alert>
        </Grid>
        )}

        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email address"
              type="email"
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
              <Button variant="contained" color="secondary" onClick={() => navigate('../')}>
                Back
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Enter
              </Button>
            </Box>
          </form>
        </Grid>

        <Grid item xs={12} mt={3}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => navigate('../register')}
            sx={{ height: 50 }}
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;


