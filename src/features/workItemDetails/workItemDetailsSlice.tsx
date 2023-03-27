import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { MachineUseData } from '../../routes/WorkItemDetails';
import { getMachineUseById } from '../../api/ApiManager';

interface WorkItemDetailsState {
    data: MachineUseData | null;
    loading: 'idle' | 'pending' | 'loaded' | 'failed';
    error: SerializedError | null;
}

const initialState: WorkItemDetailsState = { data: null, loading: 'idle', error: null };

const workItemDetailsSlice = createSlice({
    name: 'workItemDetails',
    initialState,
    reducers: {
        setWorkItemDetails: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkItemDetails.pending, (state, action) => {
                state.loading = 'pending';
            })
            .addCase(fetchWorkItemDetails.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = 'loaded';
            })
            .addCase(fetchWorkItemDetails.rejected, (state, action) => {
                state.error = action.error;
                state.loading = 'failed';
            })
    }
});

export const fetchWorkItemDetails = createAsyncThunk(
    'workItemDetails/fetchWorkItemDetails',
    async (workItemId: string | undefined, thunkApi) => {
        if (workItemId) {
            const response = await getMachineUseById(workItemId);
            return response.response?.data;
        } else {
            return { response: null, error: { message: "Bad Request: machine use id not provided or invalid"} };
        }
    }
);

export const selectWorkItemDetails = (state: RootState) => state.workItemDetails;
export const { setWorkItemDetails } = workItemDetailsSlice.actions;
export default workItemDetailsSlice.reducer;
