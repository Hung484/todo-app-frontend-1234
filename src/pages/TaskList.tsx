import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  Fab,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import * as todoListService from '../services/todoListService';
import * as taskService from '../services/taskService';
import { TodoList } from '../models/TodoList';
import { Task, TaskStatus, TaskPriority, ReminderType } from '../models/Task';
import { format, isBefore } from 'date-fns';

const TaskList: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [todoList, setTodoList] = useState<TodoList | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [addReminder, setAddReminder] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [reminderType, setReminderType] = useState<ReminderType>(ReminderType.PUSH);

  useEffect(() => {
    if (listId) {
      fetchData();
    }
  }, [listId]);

  const fetchData = async () => {
    if (!listId) return;
    
    setLoading(true);
    setError(null);
    try {
      const [listData, tasksData] = await Promise.all([
        todoListService.getListById(listId),
        taskService.getTasks(listId),
      ]);
      setTodoList(listData);
      setTasks(tasksData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      const updatedTask = await taskService.updateTask(task._id, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleOpen = (task?: Task) => {
    if (task) {
      setCurrentTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setPriority(task.priority);
      setAddReminder(!!task.reminder);
      setReminderTime(task.reminder ? new Date(task.reminder.reminderTime) : null);
      setReminderType(task.reminder?.type || ReminderType.PUSH);
      setEditMode(true);
    } else {
      setCurrentTask(null);
      setTitle('');
      setDescription('');
      setDueDate(null);
      setPriority(TaskPriority.MEDIUM);
      setAddReminder(false);
      setReminderTime(null);
      setReminderType(ReminderType.PUSH);
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !listId) {
      return;
    }

    // Validate reminder time is before due date
    if (addReminder && reminderTime && dueDate && isBefore(dueDate, reminderTime)) {
      setError('Reminder time must be before the due date');
      return;
    }

    try {
      if (editMode && currentTask) {
        const updatedTask = await taskService.updateTask(currentTask._id, {
          title,
          description: description || undefined,
          dueDate: dueDate ? dueDate.toISOString() : null,
          priority,
          reminderTime: addReminder && reminderTime ? reminderTime.toISOString() : null,
          reminderType: addReminder ? reminderType : undefined,
        });
        setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      } else {
        const newTask = await taskService.createTask({
          listId,
          title,
          description: description || undefined,
          dueDate: dueDate ? dueDate.toISOString() : undefined,
          priority,
          reminderTime: addReminder && reminderTime ? reminderTime.toISOString() : undefined,
          reminderType: addReminder ? reminderType : undefined,
        });
        setTasks([...tasks, newTask]);
      }
      handleClose();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'error';
      case TaskPriority.MEDIUM:
        return 'warning';
      case TaskPriority.LOW:
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'success';
      case TaskStatus.IN_PROGRESS:
        return 'info';
      case TaskStatus.CANCELLED:
        return 'error';
      case TaskStatus.PENDING:
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!todoList) {
    return (
      <Container maxWidth="md">
        <Box my={4}>
          <Alert severity="error">Todo list not found</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/lists')}
            sx={{ mt: 2 }}
          >
            Back to Lists
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/lists')}
            aria-label="back"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {todoList.title}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value={TaskStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
              <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
              <MenuItem value={TaskStatus.CANCELLED}>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Paper elevation={3}>
          <List>
            {filteredTasks.length === 0 ? (
              <ListItem>
                <ListItemText primary="No tasks found. Create your first task!" />
              </ListItem>
            ) : (
              filteredTasks.map((task, index) => (
                <React.Fragment key={task._id}>
                  <ListItem
                    sx={{
                      textDecoration:
                        task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED
                          ? 'line-through'
                          : 'none',
                      opacity:
                        task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED
                          ? 0.7
                          : 1,
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={task.status === TaskStatus.COMPLETED}
                        onChange={(e) =>
                          handleStatusChange(
                            task,
                            e.target.checked ? TaskStatus.COMPLETED : TaskStatus.PENDING
                          )
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <React.Fragment>
                          {task.description && <span>{task.description}<br /></span>}
                          {task.dueDate && (
                            <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}<br /></span>
                          )}
                          {task.reminder && (
                            <span>
                              Reminder: {format(new Date(task.reminder.reminderTime), 'MMM d, yyyy h:mm a')} ({task.reminder.type})
                              <br />
                            </span>
                          )}
                        </React.Fragment>
                      }
                    />
                    <Stack direction="row" spacing={1} sx={{ mx: 1 }}>
                      <Chip
                        label={TaskPriority[task.priority]}
                        size="small"
                        color={getPriorityColor(task.priority)}
                      />
                      <Chip
                        label={task.status.replace('_', ' ')}
                        size="small"
                        color={getStatusColor(task.status)}
                      />
                    </Stack>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpen(task)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(task._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                  {index < filteredTasks.length - 1 && <Divider />}
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Task Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={title.trim() === ''}
            helperText={title.trim() === '' ? 'Title is required' : ''}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              sx={{ width: '100%', mb: 2 }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'dense',
                },
              }}
            />
          </LocalizationProvider>

          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
              <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <FormControl component="fieldset">
              <Button
                variant={addReminder ? 'contained' : 'outlined'}
                onClick={() => setAddReminder(!addReminder)}
                sx={{ mb: 1 }}
              >
                {addReminder ? 'Remove Reminder' : 'Add Reminder'}
              </Button>
            </FormControl>
          </Box>

          {addReminder && (
            <>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Reminder Time"
                  value={reminderTime}
                  onChange={setReminderTime}
                  sx={{ width: '100%', mb: 2 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'dense',
                      error: reminderTime === null,
                      helperText: reminderTime === null ? 'Reminder time is required' : '',
                    },
                  }}
                />
              </LocalizationProvider>

              <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                <InputLabel id="reminder-type-label">Reminder Type</InputLabel>
                <Select
                  labelId="reminder-type-label"
                  id="reminder-type"
                  value={reminderType}
                  label="Reminder Type"
                  onChange={(e) => setReminderType(e.target.value as ReminderType)}
                >
                  <MenuItem value={ReminderType.PUSH}>Push Notification</MenuItem>
                  <MenuItem value={ReminderType.EMAIL}>Email</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={
              title.trim() === '' || 
              (addReminder && reminderTime === null) ||
              (addReminder && reminderTime && dueDate && isBefore(dueDate, reminderTime))
            }
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskList;