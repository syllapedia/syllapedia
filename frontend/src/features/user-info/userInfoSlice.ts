import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { JWTUserInfo, UserInfo } from "../../models/userModels"
import { getUser, createUser } from "../../services/httpService"

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
  async ({ info, credential }: { info: JWTUserInfo, credential: string}) => {
    await createUser({ _id: info.sub, name: info.name!, email: info.email!, permission: info.permission! }, credential);

    return await getUser(info.sub, credential);
  }
);

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateInfo: (state, data: PayloadAction<UserInfo>) => {
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
