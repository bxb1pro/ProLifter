import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserCustomTemplates,
  deleteCustomTemplate,
} from '../features/customTemplates/customTemplateSlice';
import AddCustomTemplateForm from './forms/AddCustomTemplateForm';
import EditCustomTemplateForm from './forms/EditCustomTemplateForm';
import { fetchAccountDetails } from '../features/auth/authSlice';

const CustomTemplate = () => {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.customTemplates.templates);
  const status = useSelector((state) => state.customTemplates.status);
  const error = useSelector((state) => state.customTemplates.error);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails()); // Fetch user details if not already available
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserCustomTemplates());
    }
  }, [status, dispatch]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleAddTemplate = () => {
    setShowAddForm(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
  };

  const handleDeleteTemplate = (customTemplateID) => {
    dispatch(deleteCustomTemplate(customTemplateID));
  };

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {templates.map((template) => (
          <li key={template.customTemplateID}>
            <div>
              {template.customTemplateName} - {template.customTemplateDays} days
              <button onClick={() => handleEditTemplate(template)}>Edit</button>
              <button onClick={() => handleDeleteTemplate(template.customTemplateID)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    );
  } else if (status === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>Custom Templates</h2>
      <button onClick={handleAddTemplate}>Add Custom Template</button>
      {content}
      {showAddForm && <AddCustomTemplateForm onClose={() => setShowAddForm(false)} />}
      {editingTemplate && (
        <EditCustomTemplateForm template={editingTemplate} onClose={() => setEditingTemplate(null)} />
      )}
    </section>
  );
};

export default CustomTemplate;