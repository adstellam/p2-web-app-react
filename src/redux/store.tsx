import { configureStore, combineReducers } from '@reduxjs/toolkit';
import organizationReducer from '../features/organization/organizationSlice';
import workItemsReducer from '../features/workItems/workItemsSlice';
import workItemDetailsReducer from '../features/workItemDetails/workItemDetailsSlice';

const rootReducer = combineReducers({
  organization: organizationReducer,
  workItems: workItemsReducer,
  workItemDetails: workItemDetailsReducer
});

export const store = configureStore({
  reducer: rootReducer
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;