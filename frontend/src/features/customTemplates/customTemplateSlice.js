import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to create a new custom template
export const createCustomTemplate = createAsyncThunk(
  'customTemplates/create',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await api.post('/custom-templates', templateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create custom template');
    }
  }
);

// Thunk to edit an existing custom template
export const editCustomTemplate = createAsyncThunk(
  'customTemplates/edit',
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/custom-templates/${id}/edit`, templateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to edit custom template');
    }
  }
);

// Thunk to delete a custom template
export const deleteCustomTemplate = createAsyncThunk(
  'customTemplates/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/custom-templates/${id}/delete`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete custom template');
    }
  }
);

// Thunk to get all custom templates for the current user
export const fetchUserCustomTemplates = createAsyncThunk(
  'customTemplates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/custom-templates');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch custom templates');
    }
  }
);

// Thunk to link a custom workout to a custom template
export const linkCustomWorkoutToTemplate = createAsyncThunk(
  'customTemplates/linkWorkout',
  async ({ id, customWorkoutID }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/custom-template-custom-workouts/${id}/link-workout`, { customWorkoutID });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to link custom workout to template');
    }
  }
);

// Thunk to unlink a custom workout from a custom template
export const unlinkCustomWorkoutFromTemplate = createAsyncThunk(
  'customTemplates/unlinkWorkout',
  async ({ id, customWorkoutID }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/custom-template-custom-workouts/${id}/unlink-workout`, { customWorkoutID });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to unlink custom workout from template');
    }
  }
);

// Thunk to get all custom workouts linked to a custom template
export const fetchCustomWorkoutsForTemplate = createAsyncThunk(
  'customTemplates/fetchCustomWorkouts',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/custom-template-custom-workouts/${id}/custom-workouts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch custom workouts for template');
    }
  }
);

// Thunk to link a preset workout to a custom template
export const linkPresetWorkoutToTemplate = createAsyncThunk(
  'customTemplates/linkPresetWorkout',
  async ({ id, presetWorkoutID }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/custom-template-preset-workouts/${id}/link-preset-workout`, { presetWorkoutID });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to link preset workout to template';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk to unlink a preset workout from a custom template
export const unlinkPresetWorkoutFromTemplate = createAsyncThunk(
  'customTemplates/unlinkPresetWorkout',
  async ({ id, presetWorkoutID }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/custom-template-preset-workouts/${id}/unlink-preset-workout`, { presetWorkoutID });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to unlink preset workout from template');
    }
  }
);

// Thunk to get all preset workouts linked to a custom template
export const fetchPresetWorkoutsForTemplate = createAsyncThunk(
  'customTemplates/fetchPresetWorkouts',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/custom-template-preset-workouts/${id}/preset-workouts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch preset workouts for template');
    }
  }
);

const customTemplateSlice = createSlice({
    name: 'customTemplates',
    initialState: {
      templates: [],
      templateDetails: null,
      customWorkouts: [],
      presetWorkouts: [],
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchUserCustomTemplates.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchUserCustomTemplates.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.templates = action.payload;
        })
        .addCase(fetchUserCustomTemplates.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(createCustomTemplate.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.templates.push(action.payload);
        })
        .addCase(createCustomTemplate.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(editCustomTemplate.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const index = state.templates.findIndex(template => template.customTemplateID === action.payload.customTemplateID);
          if (index !== -1) {
            state.templates[index] = action.payload;
          }
        })
        .addCase(editCustomTemplate.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(deleteCustomTemplate.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.templates = state.templates.filter(template => template.customTemplateID !== action.payload);
        })
        .addCase(deleteCustomTemplate.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(fetchCustomWorkoutsForTemplate.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchCustomWorkoutsForTemplate.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.customWorkouts = action.payload;
        })
        .addCase(fetchCustomWorkoutsForTemplate.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(fetchPresetWorkoutsForTemplate.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchPresetWorkoutsForTemplate.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.presetWorkouts = action.payload;
        })
        .addCase(fetchPresetWorkoutsForTemplate.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(linkCustomWorkoutToTemplate.fulfilled, (state) => {
          state.status = 'succeeded';
        })
        .addCase(linkCustomWorkoutToTemplate.rejected, (state, action) => {
          if (action.payload?.error === 'Custom workout is already linked to this template') {
            state.status = 'succeeded'; // Bug fix to prevent the page from getting stuck in a 'failed' state
            state.error = action.payload?.error;
          } else {
            state.status = 'failed';
            state.error = action.payload;
          }
        })
        .addCase(unlinkCustomWorkoutFromTemplate.fulfilled, (state) => {
          state.status = 'succeeded';
        })
        .addCase(unlinkCustomWorkoutFromTemplate.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(linkPresetWorkoutToTemplate.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(linkPresetWorkoutToTemplate.rejected, (state, action) => {
          if (action.payload === 'Preset workout is already linked to this custom template') {
              state.status = 'succeeded'; // Bug fix to prevent the page from getting stuck in a 'failed' state
          } else {
              state.status = 'failed';
          }
          state.error = action.payload;
        })
        .addCase(unlinkPresetWorkoutFromTemplate.fulfilled, (state) => {
          state.status = 'succeeded';
        })
        .addCase(unlinkPresetWorkoutFromTemplate.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
      },
  });
  
  export default customTemplateSlice.reducer;