import "./CourseAnalytics.css";
import "../pages/AnalyticsPage.css"
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import {  useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { BarChart, LineChart } from "@mui/x-charts";

function CourseAnalytics() {
    const user = useAppSelector(selectUserState);
    const theme = useTheme();
    const [courses, setCourses] = useState(["COMPSCI 220", "COMPSCI 311", "CICS 305"]);
    const [chartTypes, setChartTypes] = useState(courses.reduce((acc, course) => ({...acc, [course]: 'bar'}), {}));
    
    const setChartType = (course: string, type: string) => {
        setChartTypes(prev => ({
            ...prev,
            [course]: type
        }));
    };

    return (
        <div className="analytics-info">
            <div className="courses-grid-info">
                {courses.map(x => 
                    <Box className="info-box">
                        <Typography variant="h6" color={theme.palette.text.primary} sx={{ textAlign: "center", marginTop: "20px" }}>
                            {x}
                        </Typography>
                        {chartTypes[x as keyof typeof chartTypes] === 'bar' ?
                            <BarChart
                                series={[
                                    { data: [35, 44, 24, 34] },
                                    { data: [51, 6, 49, 30] },
                                    { data: [15, 25, 30, 50] },
                                    { data: [60, 50, 15, 25] },
                                ]}
                                xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                                margin={{ top: 30, bottom: 30, left: 50, right: 50 }}
                            />
                            :
                            <LineChart
                                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                                series={[
                                    {
                                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                                    },
                                ]}
                                margin={{ top: 30, bottom: 30, left: 50, right: 50 }}
                                sx={{ backgroundColor: theme.palette.background.paper, borderRadius: "10px", width: "100%" }} 
                            />
                        }
                        <div style={{ display: "flex", marginBottom: "10px" }}>
                            <IconButton onClick={() => setChartType(x, "bar")}>
                                <BarChartIcon color={chartTypes[x as keyof typeof chartTypes] === 'bar' ? "secondary" : "inherit"} />
                            </IconButton>
                            <IconButton onClick={() => setChartType(x, "line")}>
                                <TimelineIcon color={chartTypes[x as keyof typeof chartTypes] === 'line' ? "secondary" : "inherit"} />
                            </IconButton>
                        </div>
                    </Box>
                )}
            </div>
        </div> 
    );
}

export default CourseAnalytics;
