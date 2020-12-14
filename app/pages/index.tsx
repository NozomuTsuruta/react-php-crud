import React, { useState } from 'react';
import axios from 'axios';
import {
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
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/insert.php', data);
      setTodos(res.data);
    } catch {
      alert('通信に失敗しました。');
    }
  };

  const deleteTodo = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const res = await axios.post('/delete.php', id);
      console.log(res.data)
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
    <>
      <Typography align="center">TODO APP</Typography>
      <Form
        inputList={inputList}
        handleSubmit={handleSubmit(onSubmit)}
        register={register}
        isSubmitting={isSubmitting}
      />
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
    </>
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
