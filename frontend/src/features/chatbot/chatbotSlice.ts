import { createAsyncThunk, createSlice, PayloadAction, } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { CourseInfo, Highlight } from "../../models/courseModels"
import { askQuestion } from "../../services/httpService"

export interface ChatbotState {
  course: CourseInfo | null,
  question: string,
  answer: string,
  highlight: Highlight | null,
  status: "idle" | "loading" | "failed"
}

const initialState: ChatbotState = {
  course: null,
  question: "",
  answer: "",
  highlight: null,
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
    .then(response => response.status ? response : Promise.reject())
    .catch(error => error.name === "AbortError" ? { answer: "Response Terminated.", highlight: "" } : Promise.reject());
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
        state.status = data.payload.highlight ? "idle" : "failed";
        state.answer = data.payload.status === 200
          ? data.payload.answer 
          : data.payload.status === 404 
            ? "I'm sorry, I could not find an answer to that question. Try rewording or asking your professor directly."
            : "I'm sorry, I can not complete this request. Try rewording.";
        state.highlight = data.payload.highlight;
      })
      .addCase(processQuestion.rejected, (state) => {
        state.status = "failed";
        state.answer = "I'm sorry, your request was unable to be completed. Try checking your internet connection.";
      })
  },
});

export const { resetChatbot, updateCourse, updateQuestion } = chatbotSlice.actions;
export default chatbotSlice.reducer;