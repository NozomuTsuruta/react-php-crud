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
          InputLabelProps={{
            shrink: true,
          }}
        />
      ))}
      <StyledButton
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : '登録'}
      </StyledButton>
    </StyledForm>
  );
};

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: 280,
  margin: '0 auto',
});

const StyledButton = styled(Button)({
  marginTop: 10,
});
