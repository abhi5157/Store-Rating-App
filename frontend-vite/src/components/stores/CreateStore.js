import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(5, "Name should be at least 5 characters")
    .max(60, "Name should not exceed 60 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  address: yup
    .string()
    .max(400, "Address should not exceed 400 characters")
    .required("Address is required"),
  ownerId: yup.string().required("Store owner is required"),
});

const CreateStore = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      address: "",
      ownerId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError("");
        await axios.post("http://localhost:5000/api/stores", values);
        navigate("/admin/dashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Error creating store");
      }
    },
  });

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Create New Store
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="name"
              name="name"
              label="Store Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Store Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              id="address"
              name="address"
              label="Store Address"
              multiline
              rows={3}
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="owner-label">Store Owner</InputLabel>
              <Select
                labelId="owner-label"
                id="ownerId"
                name="ownerId"
                value={formik.values.ownerId}
                onChange={formik.handleChange}
                error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
                label="Store Owner"
              >
                {users
                  .filter((user) => user.role !== "admin")
                  .map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                      {user.role === "store_owner" ? " - Store Owner" : ""}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.ownerId && formik.errors.ownerId && (
                <Typography color="error" variant="caption">
                  {formik.errors.ownerId}
                </Typography>
              )}
            </FormControl>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ mt: 1, display: "block" }}
            ></Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              submit
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateStore;
