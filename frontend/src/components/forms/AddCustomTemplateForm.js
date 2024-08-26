import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCustomTemplate } from '../../features/customTemplates/customTemplateSlice';

const AddCustomTemplateForm = ({ onClose }) => {
  const [customTemplateName, setCustomTemplateName] = useState('');
  const [customTemplateDays, setCustomTemplateDays] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customTemplateName && customTemplateDays) {
      dispatch(
        createCustomTemplate({
          customTemplateName,
          customTemplateDays,
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
          value={customTemplateName}
          onChange={(e) => setCustomTemplateName(e.target.value)}
          required
        />
      </label>
      <label>
        Number of Days:
        <input
          type="number"
          value={customTemplateDays}
          onChange={(e) => setCustomTemplateDays(e.target.value)}
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

export default AddCustomTemplateForm;