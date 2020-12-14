import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useForm } from 'react-hook-form';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Form } from '../components/Form';
import { styled } from '@material-ui/styles';

export type FormData = {
  title: string;
  text: string;
  id: number;
};

export default function Home({ init }: { init: FormData[] }) {
  const [todos, setTodos] = useState<FormData[]>(init);

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/insert.php', data);
      setTodos(res.data);
      reset();
    } catch {
      alert('通信に失敗しました。');
    }
  };

  const deleteTodo = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const res = await axios.post('/delete.php', id);
      console.log(res.data);
      setTodos(res.data);
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

  return (
    <StyledGrid container justify="center" spacing={2}>
      <Typography component="h1" variant="h3" align="center">
        TODO
      </Typography>
      <Grid item sm={6} xs={10}>
        <Form
          inputList={inputList}
          handleSubmit={handleSubmit(onSubmit)}
          register={register}
          isSubmitting={isSubmitting}
        />
      </Grid>
      <Grid item sm={4} xs={10}>
        <List>
          {todos?.map(({ title, text, id }) => (
            <ListItem key={id}>
              <ListItemText primary={title} secondary={text} />
              <Link href={`/posts/${id}`}>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Link>
              <IconButton onClick={() => deleteTodo(id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Grid>
    </StyledGrid>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/read_all.php');

  return {
    props: {
      init: res.data,
    },
  };
};

const StyledGrid = styled(Grid)({
  marginTop: 10,
})