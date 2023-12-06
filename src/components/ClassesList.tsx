import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { classes } from '../db';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import ListItemText from '@mui/material/ListItemText';
import { useState, useMemo } from 'react';
import supabase, { supabaseKey, supabaseUrl } from '../supabase'
//import format from 'date-fns/format';
//import { List, ListItem } from '@material-ui/core';
//import styled from 'styled-components';
//import { useCallback } from 'react';
//import { History } from 'history';
//import { useChatsQuery } from '../../graphql/types';
//import { useGetChatPrefetch } from '../ChatRoomScreen';


interface EditRowModalProps {
    rowData: any; // Adjust the type according to your data structure
    onSave: () => void;
    onClose: () => void;
  }

  const EditRowModal: FC<EditRowModalProps> = ({ rowData, onSave, onClose }) => {
    // Your modal content and form for editing the row data
  
    const handleEntered = () => {
        // The `autoFocus` is not used because, if used, the same Enter that saves
        // the cell triggers "No". Instead, we manually focus the "No" button once
        // the dialog is fully open.
        // noButtonRef.current?.focus();
      };
      const noButtonRef = React.useRef<HTMLButtonElement>(null);      

    return (


            <Dialog
              maxWidth="xs"
              TransitionProps={{ onEntered: handleEntered }}
              open={true}
            >
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogContent dividers>
                {`Pressing 'Yes' will change $ {mutation}.`}
              </DialogContent>
              <DialogActions>
                <Button ref={noButtonRef} onClick={onClose}>
                  Close
                </Button>
                <Button onClick={onSave}>Save</Button>
              </DialogActions>
            </Dialog>
    );
  };

const getClassesQuery = `
  query GetClasses {
    fs_classesCollection {
        edges {
          node {
            id
            name
            duration
            code
            fs_prodcategory { id catname }
            fs_eventtype { id typename }
          }
        }
      }
  }
`;


 
const ClassesList: React.FC = () => {

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Class Name', width: 230 },
        { field: 'duration', headerName: 'Duration', type: 'number',  width: 90 },
        { field: 'code', headerName: 'Code', width: 100 },
        { field: 'eventType', headerName: 'Event Type', width: 120 },
        {
            field: 'edit',
            headerName: 'Edit',
            sortable: false,
            width: 100,
            //disableClickEventBubbling: true, -> <DataGrid onCellClick={(event)=> event.stopPropagation}/>
            renderCell: (params) => {
                return (
                    <button
                        onClick={(event) => { event.stopPropagation(); handleEditClick(params.row); }}
                        style={{ cursor: 'pointer' }}
                    >
                        Edit
                    </button>
                );
            },
        },
      ];

    const [classes, setClasses] = useState<any[]>([]);
    const [editedRow, setEditedRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = (row: any) => {
        setEditedRow(row);
        setIsModalOpen(true);
      };

      const handleSave = () => {
        // Handle saving the edited row data
        setIsModalOpen(false);
      };
    
      const handleClose = () => {
        setIsModalOpen(false);
      };      

  
    useMemo(async () => {
         const {
            data: { session },
          } = await supabase.auth.getSession() 
    
      const body = await fetch(`${supabaseUrl}/graphql/v1`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${session?.access_token ?? supabaseKey}`,
        },
        body: JSON.stringify({ query: getClassesQuery }),
      });

      const { data: { fs_classesCollection: { edges }, }, } = await body.json();


      setClasses(edges.map((item: any) => {
        const subsetItem = { 
            id: item.node.id, 
            name: item.node.name, 
            duration: item.node.duration, 
            code: item.node.code, 
            eventType: item.node.fs_eventtype.typename, 
            productCategory: item.node.fs_prodcategory.catname, 
        };
        return subsetItem;
      })
);


    }, []);

    return (
    <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
    <Toolbar />

    <div style={{ height: 900, width: '100%' }}>
      <DataGrid
        rows={classes}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 15 },
          },
        }}
        pageSizeOptions={[5, 10]}
        //checkboxSelection
      />
      {isModalOpen && (
        <EditRowModal rowData={editedRow} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
      )}


    </div>
    </Box>
    );
}

export default ClassesList;