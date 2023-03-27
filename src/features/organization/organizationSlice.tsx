import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

interface OrganizationState {
  value: string
}

const initialState: OrganizationState = { value: '' };

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganization: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    }
  }
});

export const selectOrganization = (state: RootState) => state.organization.value;
export const { setOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;