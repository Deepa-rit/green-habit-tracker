import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDcJm_YT79SG9untudu3ehuAcjGD9jQEns",
  authDomain: "habits-app-93cb5.firebaseapp.com",
  databaseURL: "https://habits-app-93cb5-default-rtdb.firebaseio.com",
  projectId: "habits-app-93cb5",
  storageBucket: "habits-app-93cb5.appspot.com",
  messagingSenderId: "592186214298",
  appId: "1:592186214298:web:3a04ccec96b035d8c31c23"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let chartInstance = null;

// ✅ Toggle Button Event
document.getElementById("toggleChartBtn").addEventListener("click", () => {
  const section = document.getElementById("chartSection");
  section.style.display = section.style.display === "none" ? "block" : "none";
  if (section.style.display === "block") {
    loadTodayData();
  }
});

// ✅ Back Button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "home.html";
});

// ✅ Load Today’s Data
function loadTodayData() {
  const user = auth.currentUser;
  if (!user) {
    alert("⚠ You must be logged in.");
    return;
  }

  const uid = user.uid;
  const today = new Date().toISOString().split("T")[0]; // Format: yyyy-mm-dd
  const logsRef = ref(db, "habit-logs/" + uid);

  get(logsRef).then(snapshot => {
    let water = 0, co2 = 0, waste = 0;

    snapshot.forEach(childSnap => {
      const log = childSnap.val();
      if (log.timestamp && log.timestamp.startsWith(today)) {
        water += log.water_saved_litres || 0;
        co2 += log.co2_reduced_kg || 0;
        waste += log.waste_reduced_kg || 0;
      }
    });

    drawChart(water, co2, waste);
  }).catch(error => {
    console.error("Error fetching data:", error);
  });
}

// ✅ Draw Chart
function drawChart(water, co2, waste) {
  const ctx = document.getElementById("myChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Water Saved (L)', 'CO₂ Reduced (kg)', 'Waste Reduced (kg)'],
      datasets: [{
        label: "Today's Impact",
        data: [water, co2, waste],
        backgroundColor: ['#66bb6a', '#42a5f5', '#ffa726'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// ✅ Redirect if not logged in
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  }
});
