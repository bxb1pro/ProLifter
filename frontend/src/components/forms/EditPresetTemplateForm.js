import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editPresetTemplate } from '../../features/presetTemplates/presetTemplateSlice';

const EditPresetTemplateForm = ({ template, onClose }) => {
  // Initialise state with existing template data
  const [presetTemplateName, setPresetTemplateName] = useState(template.presetTemplateName);
  const [presetTemplateDays, setPresetTemplateDays] = useState(template.presetTemplateDays);
  const [presetTemplateDifficulty, setPresetTemplateDifficulty] = useState(template.presetTemplateDifficulty);
  const [presetTemplateGoal, setPresetTemplateGoal] = useState(template.presetTemplateGoal);
  const [presetTemplateLocation, setPresetTemplateLocation] = useState(template.presetTemplateLocation);
  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      presetTemplateName &&
      presetTemplateDays &&
      presetTemplateDifficulty &&
      presetTemplateGoal &&
      presetTemplateLocation
    ) {
      // Dispatch action to edit preset template with updated data
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
    <div className="modal show d-block" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Preset Template</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Input for template name */}
              <div className="mb-3">
                <label htmlFor="presetTemplateName" className="form-label">Template Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="presetTemplateName"
                  value={presetTemplateName}
                  onChange={(e) => setPresetTemplateName(e.target.value)}
                  required
                />
              </div>
              {/* Dropdown for number of days - Restricted Input */}
              <div className="mb-3">
                <label htmlFor="presetTemplateDays" className="form-label">Number of Days</label>
                <select
                  className="form-select"
                  id="presetTemplateDays"
                  value={presetTemplateDays}
                  onChange={(e) => setPresetTemplateDays(Number(e.target.value))}
                  required
                >
                  <option value="">Select Days</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>   
                  <option value={5}>5</option>   
                  <option value={6}>6</option>   
                  <option value={7}>7</option>      
                </select>
              </div>
              {/* Dropdown for difficulty level - Restricted Input */}
              <div className="mb-3">
                <label htmlFor="presetTemplateDifficulty" className="form-label">Difficulty</label>
                <select
                  className="form-select"
                  id="presetTemplateDifficulty"
                  value={presetTemplateDifficulty}
                  onChange={(e) => setPresetTemplateDifficulty(e.target.value)}
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              {/* Dropdown for goal - Restricted Input*/}
              <div className="mb-3">
                <label htmlFor="presetTemplateGoal" className="form-label">Goal</label>
                <select
                  className="form-select"
                  id="presetTemplateGoal"
                  value={presetTemplateGoal}
                  onChange={(e) => setPresetTemplateGoal(e.target.value)}
                  required
                >
                  <option value="">Select Goal</option>
                  <option value="Size">Size</option>
                  <option value="Strength">Strength</option>
                  <option value="Overall">Overall</option>
                </select>
              </div>
              {/* Dropdown for location - Restricted Input */}
              <div className="mb-3">
                <label htmlFor="presetTemplateLocation" className="form-label">Location</label>
                <select
                  className="form-select"
                  id="presetTemplateLocation"
                  value={presetTemplateLocation}
                  onChange={(e) => setPresetTemplateLocation(e.target.value)}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="Gym">Gym</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              {/* Form buttons */}
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

export default EditPresetTemplateForm;