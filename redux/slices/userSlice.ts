import { createSlice } from "@reduxjs/toolkit";
const INITIAL_STATE: any = {
  currentUser: null,
  justRegisteredUser: null,
  folderHierarchy: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.folderHierarchy = [{ name: "root", id: action.payload._id }];
    },
    logout: (state) => {
      state.currentUser = null;
    },
    updateJustRegisteredUser: (state, action) => {
      state.justRegisteredUser = action.payload;
    },
    addFolderInHierarchy: (state, action) => {
      let hierarchy = state.folderHierarchy;
      hierarchy = [...hierarchy, action.payload];
      state.folderHierarchy = hierarchy;
    },
    removeFolderFromHierarchy: (state, action) => {
      let hierarchy = state.folderHierarchy;
      const folderToRemove = action.payload;
      hierarchy = hierarchy.filter(
        (folder: any) => folder.id !== folderToRemove.id
      );
      state.folderHierarchy = hierarchy;
    },
  },
});

export const { loginSuccess, logout, updateJustRegisteredUser } =
  userSlice.actions;

export default userSlice.reducer;
