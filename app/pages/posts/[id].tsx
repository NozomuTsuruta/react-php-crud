import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FormData } from '..';
import React from 'react';

export default function Todo({ todo }: { todo: FormData }) {
  return <div>{todo.title}</div>;
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
