import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  Employee: [],
  InquiryReason: "",
  ProbOfficer: [],
  InquiryOfficer: [],
}

export const disciplaryProceedingSlice = createSlice({
  name: 'disciplaryProceeding',
  initialState,
  reducers: {
    selectButton: (state, action) => {
    },

  },
})

// Action creators are generated for each case reducer function
export const { selectButton } = disciplaryProceedingSlice.actions

export default disciplaryProceedingSlice.reducer