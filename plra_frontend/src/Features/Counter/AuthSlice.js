import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sideMenu: [],
    userPermissions: []
}

export const AuthSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        selectButton: (state, action) => {
            state.selectedButtonId = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    selectButton
} = AuthSlice.actions

export default AuthSlice.reducer