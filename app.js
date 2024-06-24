// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBq-268EHzHRXyV6lBHWo-Oqaq81tWusIE",
    authDomain: "examenlmsg-14745.firebaseapp.com",
    projectId: "examenlmsg-14745",
    storageBucket: "examenlmsg-14745.appspot.com",
    messagingSenderId: "683794583669",
    appId: "1:683794583669:web:1a79c2bde42aee8b2b283c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Select elements from DOM
const calorieForm = document.getElementById('calorie-form');
const calorieList = document.getElementById('calorie-list');
const deleteAllButton = document.getElementById('delete-all');

// Add entry to Firestore
calorieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const meal = calorieForm.meal.value;
    const calories = calorieForm.calories.value;

    try {
        await addDoc(collection(db, "calories"), {
            meal: meal,
            calories: calories,
            liked: false,
            date: new Date()
        });
        calorieForm.reset();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

// Function to render list
const renderList = (doc) => {
    const li = document.createElement('li');
    li.setAttribute('data-id', doc.id);
    li.innerHTML = `
        <span>${doc.data().meal} ${doc.data().calories} cal</span>
        <span>${new Date(doc.data().date.seconds * 1000).toLocaleDateString()}</span>
        <button class="like">${doc.data().liked ? 'Unlike' : 'Like'}</button>
        <button class="delete">Delete</button>
    `;

    calorieList.appendChild(li);

    // Like button
    li.querySelector('.like').addEventListener('click', async () => {
        const docRef = doc(db, "calories", li.getAttribute('data-id'));
        await updateDoc(docRef, {
            liked: !doc.data().liked
        });
    });

    // Delete button
    li.querySelector('.delete').addEventListener('click', async () => {
        const docRef = doc(db, "calories", li.getAttribute('data-id'));
        try {
            await deleteDoc(docRef);
            li.remove(); // Remove the element from the DOM after deleting from Firestore
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    });
};

// Real-time listener
onSnapshot(collection(db, "calories"), (snapshot) => {
    calorieList.innerHTML = '';
    snapshot.forEach(doc => {
        renderList(doc);
    });
});

// Delete all entries
deleteAllButton.addEventListener('click', async () => {
    const querySnapshot = await getDocs(collection(db, "calories"));
    querySnapshot.forEach(async (document) => {
        try {
            const docRef = doc(db, "calories", document.id);
            await deleteDoc(docRef);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    });
});
