import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPresetTemplate } from '../../features/presetTemplates/presetTemplateSlice';

const AddPresetTemplateForm = ({ onClose }) => {
  // State variables for form inputs
  const [presetTemplateName, setPresetTemplateName] = useState('');
  const [presetTemplateDays, setPresetTemplateDays] = useState('');
  const [presetTemplateDifficulty, setPresetTemplateDifficulty] = useState('');
  const [presetTemplateGoal, setPresetTemplateGoal] = useState('');
  const [presetTemplateLocation, setPresetTemplateLocation] = useState('');
  
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
      // Dispatch action to create new preset template
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
    <div className="modal show d-block" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Preset Template</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Template Name Input */}
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
              
              {/* Number of Days Select - Restricted Input*/}
              <div className="mb-3">
                <label htmlFor="presetTemplateDays" className="form-label">Number of Days</label>
                <select
                  className="form-control"
                  id="presetTemplateDays"
                  value={presetTemplateDays}
                  onChange={(e) => setPresetTemplateDays(Number(e.target.value))}
                  required
                >
                  <option value="">Select Days</option>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              {/* Difficulty Select - Restricted Input */}
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

              {/* Goal Select - Restricted Input */}
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
              
              {/* Location Select - Restricted Input*/}
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

              {/* Form Buttons */}
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

export default AddPresetTemplateForm;