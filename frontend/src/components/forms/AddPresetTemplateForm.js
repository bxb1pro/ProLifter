import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPresetTemplate } from '../../features/presetTemplates/presetTemplateSlice';

const AddPresetTemplateForm = ({ onClose }) => {
  const [presetTemplateName, setPresetTemplateName] = useState('');
  const [presetTemplateDays, setPresetTemplateDays] = useState('');
  const [presetWorkoutDifficulty, setPresetWorkoutDifficulty] = useState('');
  const [presetWorkoutGoal, setPresetWorkoutGoal] = useState('');
  const [presetWorkoutLocation, setPresetWorkoutLocation] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      presetTemplateName &&
      presetTemplateDays &&
      presetWorkoutDifficulty &&
      presetWorkoutGoal &&
      presetWorkoutLocation
    ) {
      dispatch(
        createPresetTemplate({
          presetTemplateName,
          presetTemplateDays,
          presetWorkoutDifficulty,
          presetWorkoutGoal,
          presetWorkoutLocation,
        })
      );
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Template Name:
        <input
          type="text"
          value={presetTemplateName}
          onChange={(e) => setPresetTemplateName(e.target.value)}
          required
        />
      </label>
      <label>
        Number of Days:
        <input
          type="number"
          value={presetTemplateDays}
          onChange={(e) => setPresetTemplateDays(e.target.value)}
          required
        />
      </label>
      <label>
        Difficulty:
        <input
          type="text"
          value={presetWorkoutDifficulty}
          onChange={(e) => setPresetWorkoutDifficulty(e.target.value)}
          required
        />
      </label>
      <label>
        Goal:
        <input
          type="text"
          value={presetWorkoutGoal}
          onChange={(e) => setPresetWorkoutGoal(e.target.value)}
          required
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          value={presetWorkoutLocation}
          onChange={(e) => setPresetWorkoutLocation(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Template</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default AddPresetTemplateForm;