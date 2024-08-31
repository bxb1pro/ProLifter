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
    <div className="modal show d-block" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Preset Template</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
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
              <div className="mb-3">
                <label htmlFor="presetTemplateDays" className="form-label">Number of Days</label>
                <select
                  className="form-control"
                  id="presetTemplateDays"
                  value={presetTemplateDays}
                  onChange={(e) => setPresetTemplateDays(Number(e.target.value))} // Convert string to number
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