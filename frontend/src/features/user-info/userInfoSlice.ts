import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { JWTUserInfo, UserInfo } from "../../models/userModels"
import { getUser, createUser } from "../../services/httpService"

export interface UserState {
  user: UserInfo | null
  status: "idle" | "loading" | "failed"
}

const initialState: UserState = {
  user: null,
  status: "loading",
}

export const selectUserState = (state: RootState) => state.userState;
export const loadUser = createAsyncThunk(
  "userInfo/loadUser", 
  async (info: JWTUserInfo) => {
    await createUser({ _id: info.sub, name: info.name!, email: info.email! });

    return await getUser(info.sub);
  }
);

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateInfo: (state, data: PayloadAction<UserInfo>) => {
      state.user = data.payload;
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

export const { updateInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
