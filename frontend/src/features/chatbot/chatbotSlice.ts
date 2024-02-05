import { createAsyncThunk, createSlice, PayloadAction, } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { CourseInfo } from "../../models/courseModels"
import { askQuestion } from "../../services/httpService"

export interface ChatbotState {
  course: CourseInfo | null,
  question: string,
  answer: string,
  highlight: string,
  status: "idle" | "loading" | "failed"
}

const initialState: ChatbotState = {
  course: null,
  question: "",
  answer: "",
  highlight: "",
  status: "idle"
}

export const selectChatbotState = (state: RootState) => state.chatbotState;
export const processQuestion = createAsyncThunk(
  "chatbot/processQuestion", 
  async (args, { getState }) => {
    const state: any = getState();

    if (state.chatbotState.question === "") {
      return Promise.reject();
    }

    return await askQuestion({
      courseId: state.chatbotState.course._id,
      question: state.chatbotState.question
    }, state.userState.userCredential)
    .then(response => response.valid ? response : Promise.reject());
  }
);

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    resetChatbot: (state) => {
      state.question = "";
      state.answer = "";
      state.status = "idle";
    },
    updateCourse: (state, data: PayloadAction<CourseInfo | null>) => {
      state.course = data.payload;
    },
    updateQuestion: (state, data: PayloadAction<string>) => {
      state.question = data.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processQuestion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(processQuestion.fulfilled, (state, data) => {
        state.status = "idle";
        state.answer = data.payload.answer;
        state.highlight = data.payload.highlight;
      })
      .addCase(processQuestion.rejected, (state) => {
        state.status = "failed";
        state.answer = "I'm sorry, I'm unable to answer your request. Try re-wording it or checking your internet connection.";
      })
  },
});

export const { resetChatbot, updateCourse, updateQuestion } = chatbotSlice.actions;
export default chatbotSlice.reducer;