import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPresetTemplate } from '../../features/presetTemplates/presetTemplateSlice';

const AddPresetTemplateForm = ({ onClose }) => {
  const [presetTemplateName, setPresetTemplateName] = useState('');
  const [presetTemplateDays, setPresetTemplateDays] = useState('');
  const [presetTemplateDifficulty, setPresetTemplateDifficulty] = useState('');
  const [presetTemplateGoal, setPresetTemplateGoal] = useState('');
  const [presetTemplateLocation, setPresetTemplateLocation] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      presetTemplateName &&
      presetTemplateDays &&
      presetTemplateDifficulty &&
      presetTemplateGoal &&
      presetTemplateLocation
    ) {
      dispatch(
        createPresetTemplate({
          presetTemplateName,
          presetTemplateDays,
          presetTemplateDifficulty,
          presetTemplateGoal,
          presetTemplateLocation,
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
          value={presetTemplateDifficulty}
          onChange={(e) => setPresetTemplateDifficulty(e.target.value)}
          required
        />
      </label>
      <label>
        Goal:
        <input
          type="text"
          value={presetTemplateGoal}
          onChange={(e) => setPresetTemplateGoal(e.target.value)}
          required
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          value={presetTemplateLocation}
          onChange={(e) => setPresetTemplateLocation(e.target.value)}
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