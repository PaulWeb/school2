import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import ListItemText from '@mui/material/ListItemText';
import { useState, useMemo, useEffect } from 'react';
import supabase, { supabaseKey, supabaseUrl } from '../supabase'
//import format from 'date-fns/format';
//import { List, ListItem } from '@material-ui/core';
//import styled from 'styled-components';
//import { useCallback } from 'react';
//import { History } from 'history';
//import { useChatsQuery } from '../../graphql/types';
//import { useGetChatPrefetch } from '../ChatRoomScreen';


interface EditClassDialogProps {
    rowData: any; // Adjust the type according to your data structure
    //render: (open: any) => any;
    onSave: () => void;
    onClose: () => void;
}

const EditClassDialog: FC<EditClassDialogProps> = ({ rowData, onSave, onClose }) => {
    // Your modal content and form for editing the row data

    const getClassDataQuery = `
    query GetClass($nid: ID!)  { 
        node (nodeId: $nid)
         { 
              ... on fs_classes 
          { 
            nodeId
            id 
            name 
            description
            active
            category
            eventtype
            notificationmsg
            followupmsg
            signupmsg
            duration
            code
            signcutoff
            cancelcutoff
            wlcutoff
            listorder
          }
        }
      }
  `;

    const [classData, setClassData] = useState<any>({});

/*     useEffect(() => {
//        const {
//            data: { session },
        //} = supabase.auth.getSession()

        const nid = rowData.nodeId;
        fetch(`${supabaseUrl}/graphql/v1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
            },
            
            body: JSON.stringify({ query: getClassDataQuery,  variables : {nid}}),
        })
        .then(response => response.json())
        .then(function(data){
            console.log(data);
            setClassData(data.data.node);
        var a = 0;    
        });

        }, 
        [rowData.code]); */


        useMemo(async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            const nid = rowData.nodeId;
    
            const body = await fetch(`${supabaseUrl}/graphql/v1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: supabaseKey,
                    Authorization: `Bearer ${session?.access_token ?? supabaseKey}`,
                },
                body: JSON.stringify({ query: getClassDataQuery, variables: {nid} }),
            });
    
            const cData = await body.json();
    
  
            setClassData(cData.data.node);
        }, [rowData.nodeId]);


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
            <DialogTitle>Save class data?</DialogTitle>
            <DialogContent dividers>
                {classData?.nodeId ?? ""} <br/>
                {classData?.id ?? ""} <br/>
                {classData?.name ?? ""} <br/>
                {classData?.description ?? ""}<br/>
                {classData?.active ?? ""} <br/>
                {classData?.category ?? ""}<br/>
                {classData?.eventtype ?? ""} <br/>
                {classData?.notificationmsg ?? ""}<br/>
                {classData?.followupmsg ?? ""} <br/>
                {classData?.signupmsg ?? ""}<br/>
                {classData?.duration ?? ""} <br/>
                {classData?.code ?? ""}<br/>
                {classData?.signcutoff ?? ""} <br/>
                {classData?.cancelcutoff ?? ""}<br/>
                {classData?.wlcutoff ?? ""} <br/>
                {classData?.listorder ?? ""}<br/>
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


export default EditClassDialog;