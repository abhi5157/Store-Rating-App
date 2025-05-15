import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Rating,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/stores", {
        params: {
          name: searchName,
          address: searchAddress,
        },
      });
      setStores(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching stores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/ratings/${selectedStore.id}`,
        {
          rating: newRating,
        }
      );
      await fetchStores();
      setRatingDialogOpen(false);
      setSelectedStore(null);
      setNewRating(0);
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const handleSearch = () => {
    fetchStores();
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchName.toLowerCase()) &&
      store.address.toLowerCase().includes(searchAddress.toLowerCase())
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Search Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Search by Store Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Search by Address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{ height: "56px" }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Store List */}
      <Grid container spacing={3}>
        {filteredStores.map((store) => (
          <Grid item xs={12} sm={6} md={4} key={store.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {store.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {store.address}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography component="legend">Average Rating</Typography>
                  <Rating
                    value={store.averageRating}
                    readOnly
                    precision={0.1}
                  />
                  <Typography variant="body2">
                    ({store.averageRating?.toFixed(1) || "No ratings"})
                  </Typography>
                </Box>
                {store.userRating !== null && (
                  <Box sx={{ mt: 1 }}>
                    <Typography component="legend">Your Rating</Typography>
                    <Rating value={store.userRating} readOnly />
                  </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSelectedStore(store);
                      setNewRating(store.userRating || 0);
                      setRatingDialogOpen(true);
                    }}
                  >
                    {store.userRating ? "Update Rating" : "Rate Store"}
                  </Button>
                  <Button
                    component={Link}
                    to={`/stores/${store.id}`}
                    sx={{ ml: 1 }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
      >
        <DialogTitle>Rate Store</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 2,
            }}
          >
            <Typography component="legend">Select Rating</Typography>
            <Rating
              value={newRating}
              onChange={(event, newValue) => {
                setNewRating(newValue);
              }}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRatingSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StoreList;
