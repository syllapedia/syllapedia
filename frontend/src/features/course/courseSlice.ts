import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { CourseInfo } from "../../models/courseModels";
import { getUserCourses } from "../../services/httpService";
import { updateCourse } from "../chatbot/chatbotSlice";

export interface CourseState {
  courseList: CourseInfo[];
  status: "idle" | "loading" | "failed";
}

const initialState: CourseState = {
  courseList: [],
  status: "loading",
};

export const courseComparator = (userId: string) => (a: CourseInfo, b: CourseInfo) => {
  if ((a.instructor._id === userId) === (b.instructor._id === userId)) {
    if (a.subject === b.subject) {
      if (a.number === b.number) {
        return a.instructor.name.localeCompare(b.instructor.name);
      }
      return a.number.localeCompare(b.number);
    }
    return a.subject.localeCompare(b.subject);
  }
  return a.instructor._id === userId ? -1 : 1;
}

export const selectUserState = (state: RootState) => state.userState.user?._id;

export const selectCourseState = (state: RootState) => state.courseState;

export const loadCourses = createAsyncThunk(
  "course/loadCourses", 
  async ({ userId, userCredential }: { userId: string, userCredential: string }, { dispatch }) => { 
    return await getUserCourses(userId, userCredential)
      .then((courseList: CourseInfo[]) => {
        const sortedCourseList = courseList.sort(courseComparator(userId))
        dispatch(updateCourse(sortedCourseList[0]));
        return sortedCourseList;
      });
  }
);

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    updateCourseList: (state, action: PayloadAction<{courses: CourseInfo[], userId: string}>) => {
      state.courseList = action.payload.courses.sort(courseComparator(action.payload.userId));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCourses.fulfilled, (state, data) => {
        state.status = "idle";
          state.courseList = data.payload;
      })
      .addCase(loadCourses.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { updateCourseList } = courseSlice.actions;
export default courseSlice.reducer;
