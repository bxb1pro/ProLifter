import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCustomTemplate } from '../../features/customTemplates/customTemplateSlice';

const AddCustomTemplateForm = ({ onClose }) => {
  const [customTemplateName, setCustomTemplateName] = useState('');
  const [customTemplateDays, setCustomTemplateDays] = useState('');
  const dispatch = useDispatch();

  // Handle form submission to create new custom template
  const handleSubmit = (e) => {
    e.preventDefault();
    if (customTemplateName && customTemplateDays) {
      dispatch(createCustomTemplate({ customTemplateName, customTemplateDays }));
      onClose();
    }
  };

  return (
    <div className="modal show d-block" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Custom Template</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Input for template name */}
              <div className="mb-3">
                <label htmlFor="customTemplateName" className="form-label">Template Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="customTemplateName"
                  value={customTemplateName}
                  onChange={(e) => setCustomTemplateName(e.target.value)}
                  required
                />
              </div>
              {/* Input for number of days */}
              <div className="mb-3">
                <label htmlFor="customTemplateDays" className="form-label">Number of Days</label>
                <input
                  type="number"
                  className="form-control"
                  id="customTemplateDays"
                  value={customTemplateDays}
                  onChange={(e) => setCustomTemplateDays(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Add Template</button>
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

export default AddCustomTemplateForm;