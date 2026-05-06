// 1. Chỉ sử dụng Import từ CDN để chạy trực tiếp trên trình duyệt
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCabC9lG_9S-CWkisnnYpu2kQ7HVwplkVc",
  authDomain: "apisocial-e649a.firebaseapp.com",
  projectId: "apisocial-e649a",
  storageBucket: "apisocial-e649a.firebasestorage.app",
  messagingSenderId: "175811732703",
  appId: "1:175811732703:web:692ff955777c2b871eb56a"
};

// Khởi tạo Firebase (Chỉ gọi một lần duy nhất)
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// URL MockAPI - Hãy kiểm tra lại "SanPham" có đúng chữ hoa/thường trong MockAPI của bạn không
const MOCK_API_URL = "https://69f85a8edd0c226688ee78cd.mockapi.io/SanPham";

// 2. Hàm hiển thị sản phẩm
async function fetchProducts(isLoggedIn) {
    try {
        const res = await fetch(MOCK_API_URL);
        if (!res.ok) throw new Error("Không thể kết nối MockAPI");
        const products = await res.json();
        const container = document.getElementById('product-list');
        
        container.innerHTML = products.map(p => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${p.image}" class="card-img-top" alt="${p.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="card-text text-danger fw-bold">${Number(p.price).toLocaleString('vi-VN')}.000đ</p>
                        ${isLoggedIn ? `<button class="btn btn-success w-100">Thêm vào giỏ hàng</button>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Lỗi fetch sản phẩm:", error);
        document.getElementById('product-list').innerHTML = `<p class="text-center w-100">Lỗi tải danh sách sản phẩm.</p>`;
    }
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

// 4. Các hàm Login/Logout (Gắn vào window để gọi được từ HTML onclick)
window.login = (providerName) => {
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    signInWithPopup(auth, provider)
        .then(() => console.log("Đăng nhập thành công"))
        .catch(error => {
            console.error("Lỗi đăng nhập:", error);
            alert("Lỗi: " + error.message);
        });
};

window.logout = () => {
    signOut(auth).then(() => {
        // Có thể reload trang để reset trạng thái
        window.location.reload();
    });
};