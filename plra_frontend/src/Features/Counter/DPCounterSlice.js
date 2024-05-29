// disciplinaryProceedingSlice.js
import { createSlice } from '@reduxjs/toolkit';


const disciplinaryProceedingSlice = createSlice({
  name: 'disciplinaryProceeding',
  initialState: {
  EmployeeData:[

  ],
  },
  reducers: {
    setEmployeeData: (state, action) => {
      state.EmployeeData.push(action.payload);
    },
   
  },
});


export const {setEmployeeData} = disciplinaryProceedingSlice.actions;
export default disciplinaryProceedingSlice.reducer;