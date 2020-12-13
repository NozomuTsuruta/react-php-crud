import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

export default function Todo() {
  return <div></div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const count = await axios.get('/count');
  const paths = new Array(count).map((_, i) => ({
    params: { id: '/' + i },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const todo = await axios.get(`/read?index=${params}`);

  return { props: { todo } };
};
