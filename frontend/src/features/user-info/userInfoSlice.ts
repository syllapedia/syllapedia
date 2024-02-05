import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { JWTUserInfo, UserInfo } from "../../models/userModels"
import { getUser, createUser } from "../../services/httpService"
import { loadCourses } from "../course/courseSlice"

export interface UserState {
  user: UserInfo | null,
  userCredential: string,
  status: "idle" | "loading" | "failed"
}

const initialState: UserState = {
  user: null,
  userCredential: "",
  status: "loading",
}

export const selectUserState = (state: RootState) => state.userState;
export const loadUser = createAsyncThunk(
  "userInfo/loadUser", 
  async ({ info, credential }: { info: JWTUserInfo, credential: string}, { dispatch }) => {
    return await getUser(info.sub, credential)
      .catch(() => createUser({ _id: info.sub, name: info.name!, email: info.email!, permission: info.permission! }, credential))
      .then(user => {
        dispatch(loadCourses({ userId: user._id, userCredential: credential }));
        return user;
      });
  }
);

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateInfo: (state, data: PayloadAction<UserInfo | null>) => {
      state.user = data.payload;
    },
    updateCredential: (state, data: PayloadAction<string>) => {
      state.userCredential = data.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUser.fulfilled, (state, data) => {
        state.status = "idle";
        state.user = data.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.status = "failed";
      })
  },
});

export const { updateInfo, updateCredential } = userInfoSlice.actions;
export default userInfoSlice.reducer;
