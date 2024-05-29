import React, { useState } from 'react';
import '../Styles.css';
import { Upload, TrashFile } from '../../Assets/Icons/index';
import { Dialog, Box, Typography, DialogContent } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid'
import Btn from '../Common/Btn.jsx'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const FileInput = ({ imageUrl, label, onChange, name, selectedImagePaths, deletehandler, savehandler }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isimageDialogOpen, setIsimageDialogOpen] = useState(false);

  const imageName = typeof imageUrl === 'string' ? imageUrl.split('/').pop() : null;


  const handleInputClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsimageDialogOpen(true);
    console.log(selectedImageIndex);
  };

  return (
    <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p style={{ display: 'inline-block', width: '220px', fontSize: '14px' }}>{label} </p>
      <div className='InputFilee' onClick={handleInputClick}>
        {
          imageName ?

            <p style={{ opacity: 0.5, fontSize: "14px" }}>{imageName}</p> :
            <p style={{ opacity: 0.5, fontSize: "14px" }}>Upload File</p>}
        <div className='uploadBox'><Upload /></div>
      </div>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} aria-labelledby="dialog-title" style={{ padding: "20px" }}>

        <Grid container spacing={4} sx={{ display: 'flex' }}>
          <Grid item xs={4}>
            <DialogTitle id="dialog-title">Upload File</DialogTitle>
          </Grid>
          <Grid item xs={8}>
            <DialogTitle id="dialog-title">Uploaded File's </DialogTitle>
          </Grid>
        </Grid>


        <Box sx={{ width: '800px', px: 3 }}>
          <Grid container spacing={4} sx={{ display: 'flex' }}>
            <Grid item xs={4}>
              <label htmlFor="fileInput" className="InputLable">
                <p style={{ textDecoration: 'underline' }}>Upload File <span style={{ marginLeft: '10px' }}><TrashFile /></span></p>
                <div><p style={{ color: 'green', fontSize: '16px' }}>Max File Size : 100KB</p></div>
              </label>
              <input id="fileInput" name={name} type="file" style={{ display: 'none' }} onChange={onChange} />
            </Grid>
            <Grid item xs={8}>
              <Box>
                <TableContainer component={Paper} sx={{ '& .MuiTableRow-root': { height: '10px' } }}>
                  <Table stickyHeader>


                    <TableBody>
                      {selectedImagePaths ? selectedImagePaths.map((imagePath, index) => (
                        <TableRow key={index} >

                          <TableCell sx={{ maxHeight: "1px", py: 1, px: 1, mb: -1, pb: 0.18 }} > <img src={imagePath.url} alt={`Image ${index}`} style={{ maxWidth: '45px', msxHeight: "10px" }} onClick={() => handleImageClick(index)} /></TableCell>
                          <TableCell sx={{ maxHeight: "9px", py: 0.1, px: 1, mb: -1, pb: 0.18 }} align="left"><Typography variant='body2'>{imagePath.name}</Typography></TableCell>
                          <TableCell sx={{ maxHeight: "9px", py: 0.1, px: 0.1, mb: -1, pb: 0.18 }} align="right"> <Btn type="delete" onClick={() => deletehandler(index)} /></TableCell>
                          <TableCell sx={{ maxHeight: "9px", py: 0.1, px: 0.1, mb: -1, pb: 0.1 }} align="right"><Btn type="download" onClick={() => savehandler(imagePath.url, imagePath.name)} /></TableCell>
                        </TableRow>
                      )) : <Typography sx={{ width: '100%', height: '50vh' }}>No Image Uploaded</Typography>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', p: 2 }}>
          <Btn type="close" onClick={handleCloseDialog} />
        </Box>
      </Dialog>
      <Dialog
        open={isimageDialogOpen}
        onClose={() => setIsimageDialogOpen(false)}
        sx={{ width: '60%', margin: '0 auto', textAlign: 'center' }}
      >
        {selectedImageIndex ? selectedImageIndex > -1 && (
          <DialogContent>
            <img
              src={selectedImagePaths[selectedImageIndex].url}
              alt={`Image ${selectedImageIndex}`}
              style={{ maxWidth: '100%' }}
            />
          </DialogContent>
        ) : <Typography>No Image Selected</Typography>}
      </Dialog>
    </div>
  );
};

export default FileInput;