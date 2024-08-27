import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editPresetTemplate } from '../../features/presetTemplates/presetTemplateSlice';

const EditPresetTemplateForm = ({ template, onClose }) => {
  const [presetTemplateName, setPresetTemplateName] = useState(template.presetTemplateName);
  const [presetTemplateDays, setPresetTemplateDays] = useState(template.presetTemplateDays);
  const [presetWorkoutDifficulty, setPresetWorkoutDifficulty] = useState(template.presetWorkoutDifficulty);
  const [presetWorkoutGoal, setPresetWorkoutGoal] = useState(template.presetWorkoutGoal);
  const [presetWorkoutLocation, setPresetWorkoutLocation] = useState(template.presetWorkoutLocation);
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
        editPresetTemplate({
          id: template.presetTemplateID,
          presetTemplateData: {
            presetTemplateName,
            presetTemplateDays,
            presetWorkoutDifficulty,
            presetWorkoutGoal,
            presetWorkoutLocation,
          },
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
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default EditPresetTemplateForm;