import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  styled,
  TextField,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useForm } from 'react-hook-form';

type FormData = {
  title: string;
  text: string;
  id: number;
};

export default function Home() {
  const [todos, setTodos] = useState<FormData[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<FormData>();

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    (async () => {
      const res = await axios.get('http://localhost/read.php');
      setTodos(res.data.todos);
    })();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('http://localhost/insert.php', data);
      setTodos((todos) => [...todos, data]);
    } catch {
      alert('通信に失敗しました。');
    }
  };

  const inputList = [
    {
      name: 'title',
      error: errors.title?.message,
    },
    {
      name: 'text',
      error: errors.text?.message,
    },
  ];

  const deleteTodo = async (id: number) => {
    if (confirm('本当に削除しますか？')) {
      try {
        await axios.post('http://localhost/delete.php', id);
        setTodos((todos) => todos.filter((todo) => todo.id !== id));
      } catch {
        alert('通信に失敗しました。');
      }
    }
  };

  const onEdit = async (data: FormData) => {
    try {
      await axios.post('http://localhost/update.php', {
        ...data,
        id: edit?.id,
      });
      setTodos((todos) =>
        todos.map((todo) => (todo.id === edit?.id ? data : todo))
      );
    } catch {
      alert('通信に失敗しました。');
    }
  };

  return (
    <>
      <Typography align="center">TODO APP</Typography>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {inputList.map(({ name, error }) => (
          <TextField
            defaultValue=""
            margin="normal"
            variant="outlined"
            name={name}
            error={!!error}
            label={name}
            inputRef={register({ required: '入力してください。' })}
            helperText={error}
            key={name}
          />
        ))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : '送信'}
        </Button>
      </Form>
      <List>
        {todos?.map(({ title, text, id }) => (
          <ListItem key={id}>
            <ListItemText primary={title} secondary={text} />
            <IconButton
              onClick={() => {
                setEdit({ id, title, text });
                setOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => deleteTodo(id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <Form onSubmit={handleSubmit(onEdit)}>
          <DialogContent>
            {inputList.map(({ name, error }) => (
              <TextField
                defaultValue={name === 'title' ? edit?.title : edit?.text}
                margin="normal"
                variant="outlined"
                name={name}
                error={!!error}
                inputRef={register({ required: '入力してください。' })}
                helperText={error}
                key={name}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => setOpen(false)}
              color="primary"
            >
              Subscribe
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  margin: '0 auto',
});
