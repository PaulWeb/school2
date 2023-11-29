import React from 'react';
import Box from '@mui/material/Box';
import { BrowserRouter, Route, Routes } from "react-router-dom";


import ClassesList from './components/ClassesList';
import LeftToolbar from './components/LeftToolbar';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
    <LeftToolbar />
    <BrowserRouter>
       <Routes>
          <Route path="/" element={<ClassesList />}>
            <Route path="classes" element={<ClassesList />}/>
            <Route path="packages" element={<ClassesList />}/>
          </Route>
       </Routes>
      </BrowserRouter>
      </Box>

  );
}

export default App;
