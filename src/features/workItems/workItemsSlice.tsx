import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { MachineUseExcerptData } from '../../routes/WorkItems';
import { getMachineUses } from '../../api/ApiManager';

interface WorkItemsState {
    data: MachineUseExcerptData[] | null;
    loading: 'idle' | 'pending' | 'loaded' | 'failed';
    error: SerializedError | null;
}

const initialState: WorkItemsState = { data: null, loading: 'idle', error: null };

const workItemsSlice = createSlice({
    name: 'workItems',
    initialState,
    reducers: {
        setWorkItems: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkItems.pending, (state, action) => {
                state.loading = 'pending';
            })
            .addCase(fetchWorkItems.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = 'loaded';
            })
            .addCase(fetchWorkItems.rejected, (state, action) => {
                state.error = action.error;
                state.loading = 'failed';
            })
    }
});

export const fetchWorkItems = createAsyncThunk(
    'workItems/fetchWorkItems',
    async (thunkAPI) => {
        const response = await getMachineUses();
        return response.response?.data;
    }
);

export const selectWorkItems = (state: RootState) => state.workItems;
export const { setWorkItems } = workItemsSlice.actions;
export default workItemsSlice.reducer;
