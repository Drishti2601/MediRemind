import React, { useState } from 'react';

function AddReminderForm({ addReminder }) {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [caregiverEmail, setCaregiverEmail] = useState('');
  const [notifyCaregiverIfMissed, setNotifyCaregiverIfMissed] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!medicationName || !time) return;
    
    addReminder({
      medicationName,
      dosage,
      time,
      taken: false,
      createdAt: new Date().toISOString(),
      caregiverEmail: notifyCaregiverIfMissed ? caregiverEmail : '',
      notifyCaregiverIfMissed,
      isRecurring,
      recurringDays: isRecurring ? recurringDays : null,
      nextDueDate: new Date().toISOString()
    });
    
    // Reset form
    setMedicationName('');
    setDosage('');
    setTime('');
    setCaregiverEmail('');
    setNotifyCaregiverIfMissed(false);
    setIsRecurring(false);
    setRecurringDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    });
  };
  
  return (
    <div className="add-reminder-form">
      <h2>Add Medication Reminder</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medication Name</label>
          <input 
            type="text" 
            value={medicationName} 
            onChange={(e) => setMedicationName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Dosage (optional)</label>
          <input 
            type="text" 
            value={dosage} 
            onChange={(e) => setDosage(e.target.value)} 
          />
        </div>
        
        <div className="form-group">
          <label>Reminder Time</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="notifyCaregiverCheckbox"
            checked={notifyCaregiverIfMissed}
            onChange={(e) => setNotifyCaregiverIfMissed(e.target.checked)} 
          />
          <label htmlFor="notifyCaregiverCheckbox">
            Notify caregiver if missed
          </label>
        </div>

        {notifyCaregiverIfMissed && (
          <div className="form-group">
            <label>Caregiver Email</label>
            <input 
              type="email" 
              value={caregiverEmail} 
              onChange={(e) => setCaregiverEmail(e.target.value)} 
              required={notifyCaregiverIfMissed}
              placeholder="Enter caregiver's email"
            />
          </div>
        )}

        <div className="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="isRecurringCheckbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)} 
          />
          <label htmlFor="isRecurringCheckbox">
            Recurring medication
          </label>
        </div>

        {isRecurring && (
          <div className="form-group">
            <label>Repeat on days:</label>
            <div className="days-selector">
              {Object.keys(recurringDays).map(day => (
                <div key={day} className="day-checkbox">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    checked={recurringDays[day]}
                    onChange={() => {
                      setRecurringDays({
                        ...recurringDays,
                        [day]: !recurringDays[day]
                      });
                    }}
                  />
                  <label htmlFor={`day-${day}`}>{day.charAt(0).toUpperCase() + day.slice(1).substring(0, 2)}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button type="submit" className="btn-primary">
          Add Reminder
        </button>
      </form>
    </div>
  );
}

export default AddReminderForm;