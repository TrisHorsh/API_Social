import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCabC9lG_9S-CWkisnnYpu2kQ7HVwplkVc",
  authDomain: "apisocial-e649a.firebaseapp.com",
  projectId: "apisocial-e649a",
  storageBucket: "apisocial-e649a.firebasestorage.app",
  messagingSenderId: "175811732703",
  appId: "1:175811732703:web:692ff955777c2b871eb56a",
  measurementId: "G-W6RDPHTCYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const MOCK_API_URL = "https://69f85a8edd0c226688ee78cd.mockapi.io/SanPham";

// 2. Hàm hiển thị sản phẩm
async function fetchProducts(isLoggedIn) {
    const res = await fetch(MOCK_API_URL);
    const products = await res.json();
    const container = document.getElementById('product-list');
    
    container.innerHTML = products.map(p => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${p.image}" class="card-img-top" alt="${p.name}">
                <div class="card-body text-center">
                    <h5 class="card-title">${p.name}</h5>
                    <p class="card-text text-danger fw-bold">${p.price.toLocaleString('vi-VN')}.000đ</p>
                    ${isLoggedIn ? `<button class="btn btn-success w-100">Thêm vào giỏ hàng</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Quản lý trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    const btnGoogle = document.getElementById('btnLoginGoogle');
    const btnGithub = document.getElementById('btnLoginGithub');
    const btnLogout = document.getElementById('btnLogout');

    if (user) {
        btnGoogle.style.display = 'none';
        btnGithub.style.display = 'none';
        btnLogout.style.display = 'block';
        fetchProducts(true);
    } else {
        btnGoogle.style.display = 'block';
        btnGithub.style.display = 'block';
        btnLogout.style.display = 'none';
        fetchProducts(false);
    }
});

// 4. Các hàm Login/Logout
window.login = (providerName) => {
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    signInWithPopup(auth, provider).catch(error => alert(error.message));
};

window.logout = () => {
    signOut(auth);
};