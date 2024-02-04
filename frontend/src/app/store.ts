import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import userInfoReducer from "../features/user-info/userInfoSlice"
import chatbotReducer from "../features/chatbot/chatbotSlice"
import courseReducer from "../features/course/courseSlice"

export const store = configureStore({
  reducer: {
    userState: userInfoReducer,
    chatbotState: chatbotReducer,
    courseState: courseReducer
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
