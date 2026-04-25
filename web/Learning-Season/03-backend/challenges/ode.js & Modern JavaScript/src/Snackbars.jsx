import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Snackbars({open,setOpen}) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%',alignItems:'center' }}
        >
          <p className='text-2xl'>تم تحديد موقعك بنجاح</p>   
        </Alert>
      </Snackbar>
    </div>
  );
}
