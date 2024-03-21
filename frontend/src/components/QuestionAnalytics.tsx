import "./QuestionAnalytics.css";
import "../pages/AnalyticsPage.css"
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import {  useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import QuestionCluster from "./QuestionCluster";
import { useEffect, useState } from "react";
import { getGraphDB } from "../services/httpService";

function QuestionAnalytics() {
    const user = useAppSelector(selectUserState);
    const theme = useTheme();
    const [graph_db, setGraph_db] = useState(null);

    useEffect(() => {
        const fetchGraphDB = async () => {
          if (user.user) {
            setGraph_db(await getGraphDB(user.user._id, user.userCredential));
          }
        };
        fetchGraphDB();
      }, [user.user]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'courseName', headerName: 'Course Name', width: 200 },
        { field: 'question', headerName: 'Question', width: 300 },
        { field: 'success', headerName: 'Success Rate',  width: 200 },
        { field: 'frequency', headerName: 'Frequency', type: "number",  width: 150 },
        { field: 'likes', headerName: 'Likes', type: "number",  width: 150 },
    ];

    const rows = [
        { id: 1, courseName: 'COMPSCI 220', question: "What are the course topics?", frequency: 43, likes: 3, success: "95%"},
        { id: 2, courseName: 'COMPSCI 311', question: "What are the grade thresholds?", frequency: 22, likes: 5, success: "98%"},
        { id: 3, courseName: 'CICS 305', question: "Is attendance mandatory?", frequency: 22, likes: 2, success: "92%"},
    ];

    return (
        <div className="analytics-info" style={{flexDirection: "row"}}>
            <div className="questions-grid-info">
                <Box className="info-box">
                    <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center", margin: "20px 0px 20px 0px" }}>
                        Question Analytics
                    </Typography>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowSelection={false}
                        columnHeaderHeight={40}
                        autoPageSize
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                id: false,
                                },
                            },
                        }}
                        className="data-grid"
                    />
                </Box>
                <Box className="info-box">
                    {graph_db 
                        ? <QuestionCluster data={graph_db}/>
                        : <CircularProgress color="primary"/>
                    }
                </Box>
            </div>
        </div> 
    );
}

export default QuestionAnalytics;
