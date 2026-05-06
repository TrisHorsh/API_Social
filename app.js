import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Cấu hình Firebase (Lấy từ Firebase Console của bạn)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "DH52201647.firebaseapp.com",
    projectId: "DH52201647",
    storageBucket: "DH52201647.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

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