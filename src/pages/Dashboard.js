import React, { useState, useEffect } from 'react';
import { auth, database } from '../services/firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import AddReminderForm from '../components/AddReminderForm';
import ReminderList from '../components/ReminderList';

function Dashboard({ setIsAuthenticated }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Fetch reminders from Firebase
  useEffect(() => {
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    const remindersRef = ref(database, `users/${userId}/reminders`);
    
    const unsubscribe = onValue(remindersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reminderList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }));
        setReminders(reminderList);
      } else {
        setReminders([]);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Load emergency contact on component mount
  useEffect(() => {
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    const userRef = ref(database, `users/${userId}`);
    
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.emergencyContact) {
        setEmergencyContact(userData.emergencyContact);
      }
    });
  }, []);

  // Check for reminders that need notifications
  useEffect(() => {
    if (reminders.length === 0) return;
    
    const notificationInterval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      reminders.forEach(reminder => {
        if (reminder.taken) return;
        
        const [reminderHour, reminderMinute] = reminder.time.split(':').map(Number);
        
        if (currentHour === reminderHour && currentMinute === reminderMinute) {
          // Show browser notification
          if (Notification.permission === "granted") {
            new Notification(`Time to take ${reminder.medicationName}`, {
              body: reminder.dosage ? `Dosage: ${reminder.dosage}` : 'Click to mark as taken',
              icon: '/logo.png'
            });
          }
          
          // Check if it's been 30 minutes past the reminder time and not taken
          const thirtyMinutesAgo = new Date();
          thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
          
          const reminderTime = new Date();
          reminderTime.setHours(reminderHour, reminderMinute, 0, 0);
          
          if (!reminder.taken && reminderTime < thirtyMinutesAgo && reminder.notifyCaregiverIfMissed) {
            // In a real app, this would send an email to the caregiver
            console.log(`Sending email notification to caregiver ${reminder.caregiverEmail}`);
            
            // For the hackathon, we'll simulate this with an alert
            alert(`CAREGIVER ALERT: ${auth.currentUser.email} missed their ${reminder.medicationName} dose at ${reminder.time}`);
          }
        }
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(notificationInterval);
  }, [reminders]);

  // Add new reminder
  const addReminder = (reminder) => {
    const userId = auth.currentUser.uid;
    push(ref(database, `users/${userId}/reminders`), reminder);
  };

  // Mark reminder as taken
  const markAsTaken = (id) => {
    const userId = auth.currentUser.uid;
    const reminder = reminders.find(rem => rem.id === id);
    
    // Mark current reminder as taken
    update(ref(database, `users/${userId}/reminders/${id}`), {
      taken: true,
      takenAt: new Date().toISOString()
    });
    
    // If it's a recurring medication, create the next occurrence
    if (reminder.isRecurring) {
      const today = new Date();
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayName = daysOfWeek[today.getDay()];
      
      // Find the next due date
      let nextDueDate = null;
      let daysToAdd = 1;
      
      while (!nextDueDate && daysToAdd < 8) {
        const checkDate = new Date();
        checkDate.setDate(today.getDate() + daysToAdd);
        const checkDayName = daysOfWeek[checkDate.getDay()];
        
        if (reminder.recurringDays[checkDayName]) {
          nextDueDate = checkDate;
        }
        daysToAdd++;
      }
      
      if (nextDueDate) {
        // Create a new reminder for the next due date
        const [hours, minutes] = reminder.time.split(':');
        nextDueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const newReminder = {
          medicationName: reminder.medicationName,
          dosage: reminder.dosage,
          time: reminder.time,
          taken: false,
          createdAt: new Date().toISOString(),
          caregiverEmail: reminder.caregiverEmail,
          notifyCaregiverIfMissed: reminder.notifyCaregiverIfMissed,
          isRecurring: reminder.isRecurring,
          recurringDays: reminder.recurringDays,
          nextDueDate: nextDueDate.toISOString(),
          recurringParentId: id
        };
        
        push(ref(database, `users/${userId}/reminders`), newReminder);
      }
    }
  };

  // Delete reminder
  const deleteReminder = (id) => {
    const userId = auth.currentUser.uid;
    remove(ref(database, `users/${userId}/reminders/${id}`));
  };

  // Save emergency contact
  const saveEmergencyContact = (e) => {
    e.preventDefault();
    if (!emergencyContact) return;
    
    const userId = auth.currentUser.uid;
    update(ref(database, `users/${userId}`), {
      emergencyContact
    });
    
    setShowEmergencyForm(false);
  };

  // Logout
  const handleLogout = () => {
    auth.signOut()
      .then(() => setIsAuthenticated(false))
      .catch(error => console.error(error));
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>MediRemind</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>
      
      <main>
        <AddReminderForm addReminder={addReminder} />
        
        {loading ? (
          <p>Loading your reminders...</p>
        ) : (
          <ReminderList 
            reminders={reminders} 
            markAsTaken={markAsTaken}
            deleteReminder={deleteReminder}
          />
        )}
      </main>
      
      <div className="emergency-button-container">
        {!showEmergencyForm ? (
          <>
            <button className="emergency-button" onClick={() => setShowEmergencyForm(true)}>
              {emergencyContact ? 'Update Emergency Contact' : 'Add Emergency Contact'}
            </button>
            
            {emergencyContact && (
              <div className="emergency-contact-info">
                <p>Emergency Contact: {emergencyContact}</p>
                <button className="btn-primary" onClick={() => alert(`Emergency alert sent to ${emergencyContact}`)}>
                  Send Emergency Alert
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="emergency-form">
            <h3>Emergency Contact</h3>
            <form onSubmit={saveEmergencyContact}>
              <div className="form-group">
                <label>Email or Phone</label>
                <input 
                  type="text" 
                  value={emergencyContact} 
                  onChange={(e) => setEmergencyContact(e.target.value)} 
                  placeholder="Enter email or phone number"
                  required 
                />
              </div>
              <div className="button-group">
                <button type="submit" className="btn-primary">Save Contact</button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowEmergencyForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;