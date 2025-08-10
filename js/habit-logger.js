// ✅ Firebase config - matches your project
const firebaseConfig = {
  apiKey: "AIzaSyDcJm_YT79SG9untudu3ehuAcjGD9jQEns",
  authDomain: "habits-app-93cb5.firebaseapp.com",
  databaseURL: "https://habits-app-93cb5-default-rtdb.firebaseio.com",
  projectId: "habits-app-93cb5",
  storageBucket: "habits-app-93cb5.appspot.com",
  messagingSenderId: "592186214298",
  appId: "1:592186214298:web:3a04ccec96b035d8c31c23"
};

// ✅ Initialize Firebase (compat SDK)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// ✅ Define habit metrics
const habitMetrics = {
  tap: { water: 12, co2: 0, waste: 0 },
  shower: { water: 38, co2: 0.1, waste: 0 },
  bottle: { water: 0, co2: 0.082, waste: 0.02 },
  bag: { water: 0, co2: 0.15, waste: 0.03 },
  vegmeal: { water: 1500, co2: 2.5, waste: 0 },
  transport: { water: 0, co2: 2.5, waste: 0 },
  recycle: { water: 0, co2: 0.9, waste: 0.1 },
  tiffin: { water: 0, co2: 0.2, waste: 0.05 },
  localveg: { water: 0, co2: 0.75, waste: 0 },
  clothes: { water: 0, co2: 3, waste: 0.5 },
  bothsides: { water: 0, co2: 0.05, waste: 0.005 },
  reusecontainer: { water: 0, co2: 0.1, waste: 0.1 },
  nostraw: { water: 0, co2: 0.05, waste: 0.002 },
  upcycle: { water: 0, co2: 0.2, waste: 0.15 },
  books: { water: 0, co2: 3, waste: 0 },
  walk: { water: 0, co2: 1.75, waste: 0 }
};

// ✅ Save selected habits (updated with timestamp key for streak tracking)
function saveHabits() {
  const user = auth.currentUser;
  if (!user) {
    alert("⚠ You must be logged in.");
    return;
  }

  let total = { water: 0, co2: 0, waste: 0 };
  const selectedHabits = [];

  for (const key in habitMetrics) {
    const checkbox = document.getElementById(key);
    if (checkbox && checkbox.checked) {
      const metric = habitMetrics[key];
      total.water += metric.water;
      total.co2 += metric.co2;
      total.waste += metric.waste;
      selectedHabits.push(key);
    }
  }

  if (selectedHabits.length === 0) {
    alert("⚠ Please select at least one habit.");
    return;
  }

  const now = new Date();
  const timestamp = now.toISOString();
  const msKey = now.getTime(); // 🔑 Store log with timestamp as key

  const logData = {
    timestamp: timestamp,
    habits: selectedHabits,
    water_saved_litres: total.water,
    co2_reduced_kg: parseFloat(total.co2.toFixed(3)),
    waste_reduced_kg: parseFloat(total.waste.toFixed(3))
  };

  const ref = database.ref("habit-logs/" + user.uid + "/" + msKey);
  ref.set(logData)
    .then(() => {
      alert("✅ Habits saved successfully!");
      document.getElementById("habitForm").reset();
    })
    .catch((error) => {
      console.error("❌ Failed to save habits:", error);
      alert("❌ Could not save. Check console.");
    });
}


// ✅ Handle auth redirect
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// 🔓 Expose function globally so HTML onclick works
window.saveHabits = saveHabits;