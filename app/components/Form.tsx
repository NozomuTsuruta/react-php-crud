import { Button, CircularProgress, styled, TextField } from '@material-ui/core';
import React from 'react';

type Props = {
  inputList: {
    name: string;
    error?: string;
    defaultValue?: string;
  }[];
  handleSubmit: any;
  isSubmitting: boolean;
  register: any;
};

export const Form: React.FC<Props> = ({
  handleSubmit,
  inputList,
  register,
  isSubmitting,
}) => {
  return (
    <StyledForm onSubmit={handleSubmit}>
      {inputList.map(({ name, error, defaultValue }) => (
        <TextField
          defaultValue={defaultValue}
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
    </StyledForm>
  );
};

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  margin: '0 auto',
});
