// Firebase config
const firebaseConfig = {
 apiKey: "AIzaSyDcJm_YT79SG9untudu3ehuAcjGD9jQEns",
  authDomain: "habits-app-93cb5.firebaseapp.com",
  databaseURL: "https://habits-app-93cb5-default-rtdb.firebaseio.com",
  projectId: "habits-app-93cb5",
  storageBucket: "habits-app-93cb5.firebasestorage.app",
  messagingSenderId: "592186214298",
  appId: "1:592186214298:web:3a04ccec96b035d8c31c23",
  measurementId: "G-J603FGG7YH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Utility: Get Monday to Sunday for the current week
function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diffToMonday = (dayOfWeek + 6) % 7; // convert Sunday to 6, Monday to 0, etc.

  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const formatted = date.toISOString().split('T')[0]; // yyyy-mm-dd
    weekDates.push(formatted);
  }
  return weekDates;
}

// Update UI: Display week and diamond glow
function displayWeekData(completedDates) {
  const weekContainer = document.getElementById("weekContainer");
  weekContainer.innerHTML = "";

  const weekDates = getCurrentWeekDates();
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  weekDates.forEach((dateStr, idx) => {
    const dayName = dayNames[idx];
    const isCompleted = completedDates.includes(dateStr);

    const box = document.createElement("div");
    box.className = "day-box";

    const diamond = document.createElement("div");
    diamond.className = "diamond";
    if (isCompleted) {
      diamond.classList.add("completed");
    }

    const label = document.createElement("div");
    label.textContent = dayName;

    box.appendChild(diamond);
    box.appendChild(label);
    weekContainer.appendChild(box);
  });
}

// Streak calculation
function calculateLongestStreak(completedDates) {
  const sorted = completedDates.sort(); // ascending date order
  let longest = 0;
  let current = 0;
  let prevDate = null;

  sorted.forEach(dateStr => {
    const currentDate = new Date(dateStr);
    if (
      prevDate &&
      (currentDate - prevDate === 86400000) // 1 day = 86400000 ms
    ) {
      current += 1;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
    prevDate = currentDate;
  });

  document.getElementById("longestStreak").textContent = `Longest Streak: ${longest} days`;
}

// Load data from Firebase
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;
    const logsRef = database.ref(`habit-logs/${uid}`);

    logsRef.once("value", snapshot => {
      const logs = snapshot.val();
      const completedDates = [];

      if (logs) {
        Object.keys(logs).forEach(timestamp => {
          const date = new Date(parseInt(timestamp));
          const dateStr = date.toISOString().split("T")[0];
          completedDates.push(dateStr);
        });
      }

      displayWeekData(completedDates);
      calculateLongestStreak(completedDates);
    });
  } else {
    alert("User not signed in");
    window.location.href = "login.html";
  }
});

// Back button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "home.html";
});
