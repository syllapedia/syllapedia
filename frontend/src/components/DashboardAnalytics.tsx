import "./DashboardAnalytics.css";
import "../pages/AnalyticsPage.css"
import {  useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { DataGrid } from '@mui/x-data-grid';


function DashboardAnalytics() {
    const user = useAppSelector(selectUserState);
    const theme = useTheme();

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'courseName', headerName: 'Course Name', width: 140 },
        { field: 'question', headerName: 'Question', width: 181 },
        { field: 'frequency', headerName: 'Frequency', type: "number",  width: 100 },
    ];

    const rows = [
        { id: 1, courseName: 'COMPSCI 220', question: "What are the course topics?", frequency: 43},
        { id: 2, courseName: 'COMPSCI 311', question: "What are the grade thresholds?", frequency: 22},
        { id: 3, courseName: 'CICS 305', question: "Is attendance mandatory?", frequency: 22},
    ];

    const columns2 = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'courseName', headerName: 'Course Name', width: 220 },
        { field: 'questions', headerName: 'Total Questions', type: "number",  width: 201 },
    ];

    const rows2 = [
        { id: 1, courseName: 'COMPSCI 220', questions: 425},
        { id: 2, courseName: 'COMPSCI 311', questions: 89},
        { id: 3, courseName: 'CICS 305', questions: 32},
    ];

    return (
        <div className="analytics-info">
            <div className="dashboard-grid-info">
                <Box className="info-box">
                    <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center", marginTop: "20px" }}>
                        Most Popular Course
                    </Typography>
                    <BarChart
                        series={[
                            { data: [35, 44, 24, 34] },
                            { data: [51, 6, 49, 30] },
                            { data: [15, 25, 30, 50] },
                            { data: [60, 50, 15, 25] },
                        ]}
                        height={300}
                        xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                        margin={{ top: 40, bottom: 40, left: 60, right: 60 }}
                    />
                </Box>
                <Box className="info-box">
                    <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center", margin: "20px 0px 10px 0px" }}>
                        Course Popularity
                    </Typography>
                    <DataGrid
                        rows={rows2}
                        columns={columns2}
                        rowSelection={false}
                        autoPageSize
                        columnHeaderHeight={40}
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
                    <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center", margin: "20px 0px 10px 0px" }}>
                        Most Popular Questions
                    </Typography>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowSelection={false}
                        autoPageSize
                        columnHeaderHeight={40}
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
                    <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center", marginTop: "20px" }}>
                        Total Questions Asked
                    </Typography>
                    <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[
                            {
                            data: [2, 4, 8, 16, 32, 64],
                            area: true,
                            },
                        ]}
                        margin={{ top: 40, bottom: 40, left: 60, right: 60 }}
                        
                    />
                </Box>
                <Box className="info-box">
                    <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center", marginTop: "20px" }}>
                        Course Subjects
                    </Typography>
                    <PieChart
                        series={[
                            {
                            data: [
                                { id: 0, value: 1, label: 'CICS' },
                                { id: 1, value: 2, label: 'COMPSCI' },
                            ],
                            },
                        ]}
                        margin={{ top: 40, bottom: 40, left: 20, right: 140 }}
                    />
                </Box>
                <div style={{display: "grid", width: "100%", gap: "10px"}}>
                    <Box className="info-box" sx={{flexDirection: "row"}}>
                        <Typography variant="h3" color={theme.palette.text.primary} sx={{ textAlign: "center", paddingRight: "15px"}}>
                            {"3"}
                        </Typography>
                        <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center"}}>
                            Course/s
                        </Typography>
                    </Box>
                    <Box className="info-box" sx={{flexDirection: "row"}}>
                    <Typography variant="h3" color={theme.palette.text.primary} sx={{ textAlign: "center", paddingRight: "15px"}}>
                            {"549"}
                        </Typography>
                        <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center"}}>
                            Student/s Helped
                        </Typography>
                    </Box>
                </div>
            </div>
        </div> 
    );
}

export default DashboardAnalytics;
