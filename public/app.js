// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
// import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyBEGUl4-lH4OQT55NDROlPCkth9_2TIqTQ",
authDomain: "login-demo-31633.firebaseapp.com",
projectId: "login-demo-31633",
storageBucket: "login-demo-31633.firebasestorage.app",
messagingSenderId: "161165318462",
appId: "1:161165318462:web:288e4173f4fb8fa753f46f",
measurementId: "G-LV5S3M1SWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

auth.useDeviceLanguage();

// Check that Firebase is initialized correctly.
// console.log(app);

// Grab HTML Elements
const signInBtnEl = document.querySelector("#signInBtn");
const signOutBtnEl = document.querySelector("#signOutBtn");

const loginButtonEl = document.querySelector("#login-button");
const signupButtonEl = document.querySelector("#signup-button");

// const userDetailsEl = document.querySelector("#userDetails");
const welcomeMessageEl = document.querySelector("#welcome-message");
const emailInfoEl = document.querySelector("#email-info");

// Email and Password Authentication
if (window.location.href.includes('signup.html')) {
    signupButtonEl.onclick = () => {
        const username = document.querySelector("#username").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: email,
                    password: password
                });
            })
            .then(function() {
                document.querySelector("#signup-form").reset();
                window.location.href = "/pages/login-success.html";
            })
            .catch(function(error) {
                console.error(error);
            });
    }
}

if (window.location.href.indexOf('index.html') !== -1 || window.location.href.endsWith("/")) {
    loginButtonEl.onclick = () => {
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user) {
                    window.location.href = "/pages/login-success.html";
                }
            })
            .catch((error) => console.log(error)
        );
    }
}
// Test Comment

// Google Authentication
if (window.location.href.indexOf('index.html') !== -1 || window.location.href.indexOf('signup.html') !== -1) {
    signInBtnEl.onclick = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user
                return setDoc(doc(db, "users", user.uid), {
                    username: user.displayName,
                    email: user.email,
                    password: null
                });
            })
            .then(function() {
                window.location.href = "pages/login-success.html";
            })
            .catch((error) => console.log(error));
    };
}

// signOutBtnEl.onclick = () => auth.signOut();
if (window.location.href.indexOf('login-success.html') !== -1) {
    signOutBtnEl.onclick = () => {
        signOut(auth).then(() => {
            window.location.href = "../index.html";
        }).catch((error) => {
            console.log("Error signing out user.")
        });
    };
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // signed in
        let isEmailVerified;
        if (user.emailVerified === true) {
            isEmailVerified = "was already";
        } else {
            isEmailVerified = "hasn't been";
        }
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef)
            .then((docSnapshot) => {
                const userData = docSnapshot.data();
                const username = userData.username;
                welcomeMessageEl.textContent = `Welcome, ${username}.`;
                emailInfoEl.textContent = `Your email address, ${user.email}, ${isEmailVerified} verified.`
            });
    } else {
        // not signed in
        console.log("User not logged in");
    }
});

//user.displayName = username
//user.email = email
//user.createdAt = time account was created
//user.emailVerified = whether email was verified

//<h1>Welcome ${user.displayName}.</h1>
//<p>Your account was created at ${user.createdAt}.</p>
//<p>Your email address, ${user.email}, was/wasn't verified.</p>

// Firestore

// const db = getFirestore(app);

// const createThingEl = document.querySelector("#createThing");
// const thingsList = document.querySelector("#thingsList");

// let unsubscribe;

// let ret = onAuthStateChanged(auth, async (user) => {
//     if (user) {
//         const docRef = await addDoc(collection(db, "things"), {
//             uid: user.uid,
//             name: faker.commerce.product(),
//             createdAt: serverTimestamp(), 
//         });

//         const q = query(
//             collection(db, "things"),
//             where("uid", "==", user.uid),
//             orderBy("createdAt", "desc")
//         );

//         unsubscribe = onSnapshot(q, (querySnapshot) => {
//             let items = "";
//             querySnapshot.forEach((doc) => {
//                 items += `<li>${doc.data().name}</li>`
//             });
//             thingsList.innerHTML = items;
//         });
//     } else {
//         // unsubscribe when a user signs out
//         unsubscribe && unsubscribe();

//     }
// });
// Tutorial video: https://youtu.be/YPgb7g8is2w?si=nP5qgXStKS8gS3RV