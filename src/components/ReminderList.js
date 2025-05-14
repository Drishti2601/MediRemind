import React from 'react';

function ReminderList({ reminders, markAsTaken, deleteReminder }) {
  // Sort reminders by time
  const sortedReminders = [...reminders].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  
  // Function to format recurring days for display
  const formatRecurringDays = (recurringDays) => {
    if (!recurringDays) return "";
    
    const days = Object.entries(recurringDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day, _]) => day.charAt(0).toUpperCase() + day.slice(1, 3));
    
    return days.join(', ');
  };
  
  return (
    <div className="reminder-list">
      <h2>Your Medication Reminders</h2>
      
      {sortedReminders.length === 0 ? (
        <p>No reminders added yet. Add your first medication reminder above.</p>
      ) : (
        <ul>
          {sortedReminders.map(reminder => (
            <li key={reminder.id} className={`reminder-item ${reminder.taken ? 'taken' : ''}`}>
              <div className="reminder-info">
                <h3>{reminder.medicationName}</h3>
                {reminder.dosage && <p>Dosage: {reminder.dosage}</p>}
                <p>Time: {reminder.time}</p>
                {reminder.isRecurring && (
                  <p className="recurring-note">Repeats: {formatRecurringDays(reminder.recurringDays)}</p>
                )}
                {reminder.notifyCaregiverIfMissed && (
                  <p className="caregiver-note">Will notify: {reminder.caregiverEmail}</p>
                )}
                {reminder.taken && (
                  <p className="taken-note">Taken at: {new Date(reminder.takenAt).toLocaleTimeString()}</p>
                )}
              </div>
              
              <div className="reminder-actions">
                {!reminder.taken && (
                  <button 
                    onClick={() => markAsTaken(reminder.id)}
                    className="btn-taken"
                  >
                    Mark as Taken
                  </button>
                )}
                
                <button 
                  onClick={() => deleteReminder(reminder.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReminderList;