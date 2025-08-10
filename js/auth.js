// ✅ Your Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDcJm_YT79SG9untudu3ehuAcjGD9jQEns",
  authDomain: "habits-app-93cb5.firebaseapp.com",
  projectId: "habits-app-93cb5",
  storageBucket: "habits-app-93cb5.firebasestorage.app",
  messagingSenderId: "592186214298",
  appId: "1:592186214298:web:3a04ccec96b035d8c31c23",
  measurementId: "G-J603FGG7YH"
};


// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Toggle between login and register forms
function toggleForm(form) {
  document.getElementById("loginForm").style.display = (form === 'login') ? 'block' : 'none';
  document.getElementById("registerForm").style.display = (form === 'login') ? 'none' : 'block';
}

// ✅ Register user
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var email = document.getElementById("registerEmail").value;
  var password = document.getElementById("registerPassword").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Registration successful!");
      toggleForm('login');
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});

// ✅ Login user
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful!");
      // Optionally redirect to home page
      window.location.href = "home.html";
    })
    .catch((error) => {
      alert("Login Failed: " + error.message);
    });
});