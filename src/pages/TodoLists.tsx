import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import * as todoListService from '../services/todoListService';
import { TodoList } from '../models/TodoList';

const TodoLists: React.FC = () => {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentList, setCurrentList] = useState<TodoList | null>(null);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoListService.getLists();
      setLists(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load todo lists');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (list?: TodoList) => {
    if (list) {
      setCurrentList(list);
      setTitle(list.title);
      setEditMode(true);
    } else {
      setCurrentList(null);
      setTitle('');
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      if (editMode && currentList) {
        const updatedList = await todoListService.updateList(currentList._id, title);
        setLists(lists.map((list) => (list._id === updatedList._id ? updatedList : list)));
      } else {
        const newList = await todoListService.createList(title);
        setLists([...lists, newList]);
      }
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save todo list');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await todoListService.deleteList(id);
      setLists(lists.filter((list) => list._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete todo list');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Todo Lists
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3}>
          <List>
            {lists.length === 0 ? (
              <ListItem>
                <ListItemText primary="No todo lists found. Create your first list!" />
              </ListItem>
            ) : (
              lists.map((list, index) => (
                <React.Fragment key={list._id}>
                  <ListItem
                    component={RouterLink}
                    to={`/lists/${list._id}`}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItemText
                      primary={list.title}
                      secondary={`Created: ${new Date(list.createdAt).toLocaleDateString()}`}
                    />
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpen(list);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(list._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                  {index < lists.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpen()}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Todo List' : 'Create New Todo List'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="List Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={title.trim() === ''}
            helperText={title.trim() === '' ? 'Title is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={title.trim() === ''}>
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TodoLists;