import { createSlice } from "@reduxjs/toolkit";
import { createComment, getComments } from "../actions/commentAction";

const initialState = {
  comments: [],
  isLoading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addNewComment: (state, action) => {
      state.comments.unshift(action.payload);
    },
    resetComments: (state) => {
      state.comments = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addNewComment, resetComments } = commentSlice.actions;
export default commentSlice.reducer;