import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Rating,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/stores/${id}`
      );
      setStore(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching store details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/ratings/${id}`, {
        rating: newRating,
      });
      await fetchStoreDetails();
      setRatingDialogOpen(false);
      setNewRating(0);
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!store) {
    return <Typography>Store not found</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Store Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {store.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {store.address}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {store.email}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Average Rating:
              </Typography>
              <Rating value={store.averageRating} readOnly precision={0.1} />
              <Typography variant="h6" sx={{ ml: 1 }}>
                ({store.averageRating.toFixed(1)})
              </Typography>
            </Box>
            {store.userRating !== null && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="h6" sx={{ mr: 2 }}>
                  Your Rating:
                </Typography>
                <Rating value={store.userRating} readOnly />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  ({store.userRating})
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => {
                setNewRating(store.userRating || 0);
                setRatingDialogOpen(true);
              }}
            >
              {store.userRating ? "Update Rating" : "Rate Store"}
            </Button>
          </Paper>
        </Grid>

        {/* Ratings List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Customer Ratings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {store.Ratings.map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell>
                        {rating.User.name}
                        <Typography
                          variant="caption"
                          display="block"
                          color="textSecondary"
                        >
                          {rating.User.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Rating value={rating.rating} readOnly />
                          <Typography sx={{ ml: 1 }}>
                            ({rating.rating})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
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

export default StoreDetails;
