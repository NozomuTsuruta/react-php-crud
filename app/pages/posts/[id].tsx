import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '../../components/Form';

export type FormData = {
  title: string;
  text: string;
  id: number;
};

export default function Todo({ todo }: { todo: FormData }) {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const { query } = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/update.php', {
        ...data,
        id: query.id,
      });
    } catch {
      alert('通信に失敗しました。');
    }
  };

  const inputList = [
    {
      name: 'title',
      error: errors.title?.message,
      defaultValue: todo.title,
    },
    {
      name: 'text',
      error: errors.text?.message,
      defaultValue: todo.text,
    },
  ];

  return (
    <>
      <Form
        inputList={inputList}
        handleSubmit={handleSubmit(onSubmit)}
        register={register}
        isSubmitting={isSubmitting}
      />
      <Link href="/">戻る</Link>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get('/read_id.php');
  const paths = res.data.map((el: any) => `/posts/${el.id}`);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await axios.get(`/read.php?id=${params?.id}`);

  return { props: { todo: res.data } };
};
