import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editPresetTemplate } from '../../features/presetTemplates/presetTemplateSlice';

const EditPresetTemplateForm = ({ template, onClose }) => {
  const [presetTemplateName, setPresetTemplateName] = useState(template.presetTemplateName);
  const [presetTemplateDays, setPresetTemplateDays] = useState(template.presetTemplateDays);
  const [presetTemplateDifficulty, setPresetTemplateDifficulty] = useState(template.presetTemplateDifficulty);
  const [presetTemplateGoal, setPresetTemplateGoal] = useState(template.presetTemplateGoal);
  const [presetTemplateLocation, setPresetTemplateLocation] = useState(template.presetTemplateLocation);
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
        editPresetTemplate({
          id: template.presetTemplateID,
          presetTemplateData: {
            presetTemplateName,
            presetTemplateDays,
            presetTemplateDifficulty,
            presetTemplateGoal,
            presetTemplateLocation,
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
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default EditPresetTemplateForm;