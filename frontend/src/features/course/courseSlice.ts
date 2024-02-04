import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { CourseInfo } from "../../models/courseModels"
import { getUserCourses } from "../../services/httpService"
import { updateCourse } from "../chatbot/chatbotSlice"

export interface CourseState {
  courseList: CourseInfo[]
  status: "idle" | "loading" | "failed"
}

const initialState: CourseState = {
  courseList: [],
  status: "loading",
}

export const selectCourseState = (state: RootState) => state.courseState;
export const loadCourses = createAsyncThunk(
  "course/loadCourses", 
  async ({ userId, userCredential }: { userId: string, userCredential: string }, { dispatch }) => { 
    return await getUserCourses(userId, userCredential)
        .then(courseList => {
            if (courseList.length)
                dispatch(updateCourse(courseList[0]));

            return courseList
        });
  }
);

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    updateCourseList: (state, data: PayloadAction<CourseInfo[]>) => {
        state.courseList = data.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCourses.fulfilled, (state, data) => {
        state.status = "idle";
        state.courseList = data.payload
      })
      .addCase(loadCourses.rejected, (state) => {
        state.status = "failed";
      })
  },
});

export const { updateCourseList } = courseSlice.actions;
export default courseSlice.reducer;
