import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to TodoApp
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          A simple and effective way to manage your tasks
        </Typography>

        <Paper elevation={3} sx={{ p: 4, my: 4 }}>
          {isAuthenticated ? (
            <>
              <Typography variant="h6" gutterBottom>
                Welcome back, {user?.username}!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/lists"
                size="large"
                sx={{ mt: 2 }}
              >
                Go to My Lists
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                Get started by creating an account or logging in.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/login"
                  size="large"
                  sx={{ mr: 2 }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/register"
                  size="large"
                >
                  Register
                </Button>
              </Box>
            </>
          )}
        </Paper>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Features
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <Paper sx={{ width: { xs: '100%', md: '30%' }, p: 2, mb: 2 }}>
              <Typography variant="h6">Organize Tasks</Typography>
              <Typography variant="body2">
                Create multiple lists to organize your tasks by project, priority, or category.
              </Typography>
            </Paper>
            <Paper sx={{ width: { xs: '100%', md: '30%' }, p: 2, mb: 2 }}>
              <Typography variant="h6">Set Reminders</Typography>
              <Typography variant="body2">
                Never miss a deadline with customizable reminders for your important tasks.
              </Typography>
            </Paper>
            <Paper sx={{ width: { xs: '100%', md: '30%' }, p: 2, mb: 2 }}>
              <Typography variant="h6">Track Progress</Typography>
              <Typography variant="body2">
                Mark tasks as in-progress or completed to keep track of your productivity.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;