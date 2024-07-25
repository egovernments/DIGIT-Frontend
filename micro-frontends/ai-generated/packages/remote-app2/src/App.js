import React from 'react';
import { useQuery } from 'react-query';
import queryClient from 'shared-query-client';

const fetchData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  return response.json();
};

const SomeComponent = () => {
  const { data, error, isLoading } = useQuery('fetchData', fetchData, { queryClient });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Remote App 2</h2>
      <h3>{data.title}</h3>
      <p>{data.body}</p>
    </div>
  );
};

export default SomeComponent;
