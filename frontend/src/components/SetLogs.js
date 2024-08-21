import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSetLogsByExercise } from '../features/setLogs/setLogSlice';
import { useParams } from 'react-router-dom';

const SetLogs = () => {
  const dispatch = useDispatch();
  const { exerciseLogID } = useParams(); // Get exerciseLogID from the URL
  const logs = useSelector((state) => state.setLogs.logs);
  const status = useSelector((state) => state.setLogs.status);
  const error = useSelector((state) => state.setLogs.error);

  useEffect(() => {
    if (status === 'idle' && exerciseLogID) {
      dispatch(fetchSetLogsByExercise(exerciseLogID));
    }
  }, [status, dispatch, exerciseLogID]);

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {logs.map((log) => (
          <li key={log.setLogID}>
            Weight: {log.setLogWeight}kg - Reps: {log.setLogReps} - RPE: {log.setLogRPE} - 1RM: {log.setLog1RM}
          </li>
        ))}
      </ul>
    );
  } else if (status === 'failed') {
    content = <p>{error || 'An error occurred'}</p>;
  }

  return (
    <section>
      <h2>Set Logs</h2>
      {content}
    </section>
  );
};

export default SetLogs;