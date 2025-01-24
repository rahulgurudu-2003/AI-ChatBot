import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";

function App() {
  const [query, setQuery] = useState(""); // State for user input
  const [responses, setResponses] = useState([]); // State for chatbot responses
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages

  // Function to handle user query submission
  const handleQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a query.");
      return;
    }

    setLoading(true); // Show loading spinner
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post("http://localhost:8000/chatbot", {
        query: query,
      });

      // Add the new query and response to the list
      setResponses([...responses, { query, response: response.data.response }]);
      setQuery(""); // Clear the input field
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching the response. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        AI-Powered Chatbot
      </Typography>

      {/* Input field for user query */}
      <TextField
        fullWidth
        label="Enter your query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleQuery(); // Allow pressing Enter to submit
        }}
        disabled={loading} // Disable input while loading
        sx={{ mb: 2 }}
      />

      {/* Submit button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleQuery}
        disabled={loading || !query.trim()} // Disable if input is empty or loading
        fullWidth
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Submit"}
      </Button>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Display chatbot responses */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chat History
        </Typography>
        <List>
          {responses.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
              No queries yet. Start by asking a question!
            </Typography>
          ) : (
            responses.map((item, index) => (
              <ListItem key={index} sx={{ mb: 1 }}>
                <ListItemText
                  primary={`You: ${item.query}`}
                  secondary={`Bot: ${item.response}`}
                  primaryTypographyProps={{ fontWeight: "bold" }}
                  secondaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default App;
