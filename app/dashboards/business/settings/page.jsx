"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Switch,
  Button,
  FormControlLabel,
  Divider,
  Avatar,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
// import { Palette } from 'lucide-react';
import { Eye, Save, EyeOff, Palette } from "lucide-react";
const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "",
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: true,
    theme: "light",
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value !== undefined ? value : checked,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSave = () => {
    // console.log('Settings saved:', settings);
    // Here you would typically send the settings to your backend
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Profile
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                sx={{ width: 80, height: 80, mr: 2 }}
                src="/path-to-profile-image.jpg"
                alt="Profile"
              />
              <Button variant="outlined" component="label">
                Upload New Image
                <input type="file" hidden />
              </Button>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={settings.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={settings.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Security Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={settings.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={handleChange}
                      name="twoFactorAuth"
                      color="primary"
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Notification Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleChange}
                      name="emailNotifications"
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={handleChange}
                      name="pushNotifications"
                      color="primary"
                    />
                  }
                  label="Push Notifications"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Appearance Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="theme-select-label">Theme</InputLabel>
              <Select
                labelId="theme-select-label"
                id="theme-select"
                value={settings.theme}
                label="Theme"
                name="theme"
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Palette />
                  </InputAdornment>
                }
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
