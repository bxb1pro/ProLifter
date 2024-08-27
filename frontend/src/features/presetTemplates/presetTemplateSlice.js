import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to fetch all preset templates
export const fetchPresetTemplates = createAsyncThunk(
    'presetTemplates/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/preset-templates');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch preset templates');
        }
    }
);

// Thunk to fetch details of a specific preset template by ID
export const fetchPresetTemplateDetails = createAsyncThunk(
    'presetTemplates/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/preset-templates/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch preset template details');
        }
    }
);

// Thunk to create a new preset template
export const createPresetTemplate = createAsyncThunk(
    'presetTemplates/create',
    async (presetTemplateData, { rejectWithValue }) => {
        try {
            const response = await api.post('/preset-templates', presetTemplateData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create preset template');
        }
    }
);

// Thunk to edit an existing preset template
export const editPresetTemplate = createAsyncThunk(
    'presetTemplates/edit',
    async ({ id, presetTemplateData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/preset-templates/${id}`, presetTemplateData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to edit preset template');
        }
    }
);

// Thunk to delete a preset template
export const deletePresetTemplate = createAsyncThunk(
    'presetTemplates/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/preset-templates/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete preset template');
        }
    }
);

// Thunk to link a preset template to a user
export const linkPresetTemplate = createAsyncThunk(
    'presetTemplates/link',
    async ({ userID, presetTemplateID }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/user-preset-templates/${userID}/link-preset-template`, { presetTemplateID });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to link preset template');
        }
    }
);

// Thunk to unlink a preset template from a user
export const unlinkPresetTemplate = createAsyncThunk(
    'presetTemplates/unlink',
    async ({ userID, presetTemplateID }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/user-preset-templates/${userID}/unlink-preset-template`, { presetTemplateID });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to unlink preset template');
        }
    }
);

// Thunk to fetch preset templates linked to a specific user
export const fetchUserPresetTemplates = createAsyncThunk(
    'presetTemplates/fetchUserTemplates',
    async (userID, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user-preset-templates/${userID}/preset-templates`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user preset templates');
        }
    }
);

// Thunk to link a preset workout to a preset template
export const linkPresetWorkoutToTemplate = createAsyncThunk(
    'presetTemplates/linkPresetWorkout',
    async ({ presetTemplateID, presetWorkoutID }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/preset-template-preset-workouts/${presetTemplateID}/link-preset-workout`, { presetWorkoutID });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to link preset workout to template');
        }
    }
);

// Thunk to unlink a preset workout from a preset template
export const unlinkPresetWorkoutFromTemplate = createAsyncThunk(
    'presetTemplates/unlinkPresetWorkout',
    async ({ presetTemplateID, presetWorkoutID }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/preset-template-preset-workouts/${presetTemplateID}/unlink-preset-workout`, { presetWorkoutID });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to unlink preset workout from template');
        }
    }
);

// Thunk to fetch all preset workouts linked to a preset template
export const fetchPresetWorkoutsForTemplate = createAsyncThunk(
    'presetTemplates/fetchPresetWorkouts',
    async (presetTemplateID, { rejectWithValue }) => {
        try {
            const response = await api.get(`/preset-template-preset-workouts/${presetTemplateID}/preset-workouts`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch preset workouts for template');
        }
    }
);

const presetTemplateSlice = createSlice({
    name: 'presetTemplates',
    initialState: {
        templates: [],
        templateDetails: null,
        presetWorkouts: [],
        status: 'idle', // idle, loading, succeeded, failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPresetTemplates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPresetTemplates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.templates = action.payload;
            })
            .addCase(fetchPresetTemplates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchPresetTemplateDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPresetTemplateDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.templateDetails = action.payload;
            })
            .addCase(fetchPresetTemplateDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createPresetTemplate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.templates.push(action.payload);
            })
            .addCase(createPresetTemplate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(editPresetTemplate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.templates.findIndex(template => template.presetTemplateID === action.payload.presetTemplateID);
                if (index !== -1) {
                    state.templates[index] = action.payload;
                }
            })
            .addCase(editPresetTemplate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deletePresetTemplate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.templates = state.templates.filter(template => template.presetTemplateID !== action.payload);
            })
            .addCase(deletePresetTemplate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(linkPresetTemplate.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(linkPresetTemplate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(unlinkPresetTemplate.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(unlinkPresetTemplate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchUserPresetTemplates.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserPresetTemplates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.templates = action.payload;
            })
            .addCase(fetchUserPresetTemplates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Handle linking preset workout to template
            .addCase(linkPresetWorkoutToTemplate.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(linkPresetWorkoutToTemplate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Handle unlinking preset workout from template
            .addCase(unlinkPresetWorkoutFromTemplate.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(unlinkPresetWorkoutFromTemplate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Handle fetching preset workouts linked to a template
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
            });
    },
});

export default presetTemplateSlice.reducer;