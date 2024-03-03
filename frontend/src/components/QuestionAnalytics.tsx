import "./QuestionAnalytics.css";
import "../pages/AnalyticsPage.css"
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import {  useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

function QuestionAnalytics() {
    const user = useAppSelector(selectUserState);
    const theme = useTheme();

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'courseName', headerName: 'Course Name', width: 160 },
        { field: 'question', headerName: 'Question', width: 178 },
        { field: 'success', headerName: 'Success Rate',  width: 100 },
        { field: 'frequency', headerName: 'Frequency', type: "number",  width: 100 },
        { field: 'likes', headerName: 'Likes', type: "number",  width: 100 },
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
                        sx={{maxWidth: "100%"}}
                    />
                </Box>
                <Box className="info-box">
                    <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center"}}>
                        Coming Soon...
                    </Typography>
                    <BubbleChartIcon fontSize={"large"} sx={{color: theme.palette.text.primary}}/>
                </Box>
            </div>
        </div> 
    );
}

export default QuestionAnalytics;
