import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editCustomTemplate } from '../../features/customTemplates/customTemplateSlice';

const EditCustomTemplateForm = ({ template, onClose }) => {
  // Initialise state with current template's data
  const [customTemplateName, setCustomTemplateName] = useState(template.customTemplateName);
  const [customTemplateDays, setCustomTemplateDays] = useState(template.customTemplateDays);
  const dispatch = useDispatch();

  // Handle form submission
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
    <div className="modal show d-block" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Custom Template</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Template Name Input */}
              <div className="mb-3">
                <label htmlFor="customTemplateName" className="form-label">Template Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="customTemplateName"
                  value={customTemplateName}
                  onChange={(e) => setCustomTemplateName(e.target.value)} // Update state with new value
                  required
                />
              </div>
              {/* Number of Days Input */}
              <div className="mb-3">
                <label htmlFor="customTemplateDays" className="form-label">Number of Days</label>
                <input
                  type="number"
                  className="form-control"
                  id="customTemplateDays"
                  value={customTemplateDays}
                  onChange={(e) => setCustomTemplateDays(e.target.value)} // Update state with new value
                  required
                />
              </div>
              {/* Form Buttons */}
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomTemplateForm;