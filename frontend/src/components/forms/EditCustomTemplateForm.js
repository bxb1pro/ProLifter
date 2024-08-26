import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editCustomTemplate } from '../../features/customTemplates/customTemplateSlice';

const EditCustomTemplateForm = ({ template, onClose }) => {
  const [customTemplateName, setCustomTemplateName] = useState(template.customTemplateName);
  const [customTemplateDays, setCustomTemplateDays] = useState(template.customTemplateDays);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customTemplateName && customTemplateDays) {
      dispatch(
        editCustomTemplate({
          id: template.customTemplateID,
          templateData: {
            customTemplateName,
            customTemplateDays,
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
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default EditCustomTemplateForm;