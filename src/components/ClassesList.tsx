import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { classes } from '../db';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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

const getClassesQuery = `
  query GetClasses {
    fs_classesCollection {
        edges {
          node {
            id
            name
            duration
            code
          }
        }
      }
  }
`;

const ClassesList: React.FC = () => {
    const [classes, setClasses] = useState<any[]>([]);
  
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
      const resp = await body.json();
      setClasses(resp.data.fs_classesCollection.edges);
    }, []);

    return (
    <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
    <Toolbar />
        <div>
            <List>
                {classes.map((cl) => (
                    <ListItem key={cl.node.id}>
                        {cl.node.name} {cl.node.duration} {cl.node.code}
                    </ListItem>
                ))}
            </List>
        </div>   
    </Box>
    );
}

export default ClassesList;