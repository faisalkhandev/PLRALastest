import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedButtonId: 1,
  ElevationEmp: [],
  ProgressionEmp: [],
  sideMenu: {},
  userPermissions: [],
  viewPermissions: { setups: {}, processes: {} }
}

// Helper function to filter models based on the presence of "view" permission in base_permissions
function filterModelsWithViewPermission(data) {
  const result = {
    setups: [],
    processes: []
  };

  // Helper function to check if any model has a view permission
  const processCategory = (categoryData) => {
    const categoryNames = [];
    Object.entries(categoryData).forEach(([key, models]) => {
      const hasViewPermission = models.some(model => 
        model.base_permissions.some(perm => perm.Permission === "view")
      );
      if (hasViewPermission) {
        categoryNames.push(key);
      }
    });
    return categoryNames;
  };

  // Process both setups and processes
  if (data.setups) {
    result.setups = processCategory(data.setups);
  }
  if (data.processes) {
    result.processes = processCategory(data.processes);
  }

  return result;
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    selectButton: (state, action) => {
      state.selectedButtonId = action.payload;
    },
    updateRoutes: (state, action) => {
      const viewPermissions = filterModelsWithViewPermission(action.payload);
      // If setups has any record, add 'setUp' to viewPermissions.setups
      if (action.payload.setups && Object.keys(action.payload.setups).length > 0) {
        viewPermissions.processes.push('Setups');
        console.log("setups has records");
      }
      state.viewPermissions = viewPermissions;
    },
    saveData: (state, action) => {
      state.ElevationEmp.push(action.payload);
    },
    removeData: (state, action) => {
      state.ElevationEmp = state.ElevationEmp.filter(item => item !== action.payload);
    },
    emptyArray: (state, action) => {
      state.ElevationEmp = [];
    },
    selectProgressionButton: (state, action) => {
      state.selectedButtonId = action.payload;
    },
    saveProgressionIdData: (state, action) => {
      state.ProgressionEmp.push(action.payload);
    },
    removeProgressionIdData: (state, action) => {
      state.ProgressionEmp = state.ProgressionEmp.filter(item => item !== action.payload);
    },
  },
});

export const {
  selectButton, saveData, removeData, emptyArray,
  selectProgressionButton, saveProgressionIdData,
  removeProgressionIdData, updateRoutes
} = counterSlice.actions;

export default counterSlice.reducer;
