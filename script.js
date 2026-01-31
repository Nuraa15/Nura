// --- DATA BASE (UPDATE: Tambah Data Baru) ---
const detailsDatabase = {
    'proj-1': {
        title: 'Personal Website',
        desc: 'Website portofolio interaktif dengan efek 3D parallax dan mode gelap, dibuat menggunakan HTML, CSS, dan JS murni.',
        link: 'https://nuraa15.github.io/Nura/#', img: 'image/project1.png'
    },
    'proj-2': {
        title: '',
        desc: '',
        link: '#', img: '-'
    },
    'cert-1': {
        title: 'Dibimbing.id - Network Engineer',
        desc: 'Pelatihan intensif mengenai dasar jaringan komputer, subnetting, dan konfigurasi router.',
        link: '#', img: 'image/dibimbing.jpg'
    },
    'cert-2': {
        title: 'Telkom Indonesia - FTTx',
        desc: 'Workshop teknis mengenai instalasi dan pemeliharaan jaringan Fiber Optic (FTTx).',
        link: '#', img: 'image/Telkom.jpg'
    },
    'cert-3': {
        title: 'AWS Training & Certification',
        desc: 'Sertifikasi Cloud Essential Knowladge badge Assessment.',
        link: '#', img: 'image/AWS.jpeg' 
    },
    'cert-4': {
        title: 'Telkom Akses Bekasi',
        desc: 'Berpartisipasi Mengikuti Kegiatan Company Visit PT. Telkom Akses Bekasi.',
        link: '#', img: 'image/Telkom Akses Bekasi.jpeg'
    }
};

// --- VARIABEL ---
const cardProfile = document.getElementById('card-profile');
const cardProjects = document.getElementById('card-projects');
const cardCerts = document.getElementById('card-certs');
const stage = document.querySelector('.stage-container');

const btnProfile = document.getElementById('btn-profile');
const btnProjects = document.getElementById('btn-projects');
const btnCerts = document.getElementById('btn-certs');
const allBtns = [btnProjects, btnProfile, btnCerts];

let isTiltPaused = false;

// --- LOGIKA POSISI NAVIGASI DINAMIS ---
// Fungsi ini mengubah urutan tombol (order css) agar tombol aktif selalu di tengah
function updateNavOrder(activeType) {
    // Reset kelas active visual
    allBtns.forEach(btn => btn.classList.remove('active'));

    // Menggunakan CSS Flexbox Order:
    // Order 1 = Kiri, Order 2 = Tengah (Aktif), Order 3 = Kanan
    
    if (activeType === 'profile') {
        btnProfile.classList.add('active');
        // Susunan: Project (Kiri) - Profile (Tengah) - Certs (Kanan)
        btnProjects.style.order = "1";
        btnProfile.style.order = "2";
        btnCerts.style.order = "3";
    } 
    else if (activeType === 'projects') {
        btnProjects.classList.add('active');
        // Susunan: Certs (Kiri) - Projects (Tengah) - Profile (Kanan)
        // (Asumsi putaran kartu: Certs ada di kiri Projects)
        btnCerts.style.order = "1";
        btnProjects.style.order = "2";
        btnProfile.style.order = "3";
    } 
    else if (activeType === 'certs') {
        btnCerts.classList.add('active');
        // Susunan: Profile (Kiri) - Certs (Tengah) - Project (Kanan)
        btnProfile.style.order = "1";
        btnCerts.style.order = "2";
        btnProjects.style.order = "3";
    }
}

// --- LOGIKA GANTI KARTU ---
function setPositions(center, left, right) {
    // Reset class & transform
    [center, left, right].forEach(card => {
        card.className = 'card'; 
        card.style.transform = ''; 
    });
    
    // Assign class posisi baru
    center.classList.add('position-center');
    left.classList.add('position-left');
    right.classList.add('position-right');
}

function switchCard(type) {
    // 1. Update urutan tombol Navbar agar tombol aktif pindah ke tengah
    updateNavOrder(type);

    // 2. Putar Kartu
    if (type === 'profile') {
        setPositions(cardProfile, cardProjects, cardCerts);
    } else if (type === 'projects') {
        setPositions(cardProjects, cardCerts, cardProfile);
    } else if (type === 'certs') {
        setPositions(cardCerts, cardProfile, cardProjects);
    }
}

// --- LOGIKA TILT 3D (VERSI STABIL / ANTI-LAG) ---

stage.addEventListener('mousemove', (e) => {
    // 1. Cek Device HP (tetap matikan di HP)
    if (window.innerWidth <= 768) return; 

    // 2. Cek apakah ada Modal terbuka?
    if (document.querySelector('.modal-overlay.active')) return;

    // 3. DETEKSI PINTAR: Apakah mouse sedang di atas item yang bisa diklik?
    // Jika YA, hentikan perhitungan tilt (return) agar kartu diam & stabil.
    if (e.target.closest('.clickable-item') || e.target.closest('.nav-btn')) {
        return; 
    }

    const activeCard = document.querySelector('.position-center');
    if(activeCard) { 
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2; 
        const centerY = rect.height / 2;
        
        // Sensitivitas Tilt
        const rotateX = ((y - centerY) / 25) * -1; 
        const rotateY = (x - centerX) / 25;
        
        // Update posisi hanya jika TIDAK sedang hover item
        activeCard.style.transform = `translateX(0) scale(1) translateZ(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Reset saat mouse keluar stage
stage.addEventListener('mouseleave', () => {
    const activeCard = document.querySelector('.position-center');
    if(activeCard) {
        activeCard.style.transition = 'transform 0.5s ease';
        activeCard.style.transform = `translateX(0) scale(1) translateZ(0)`;
    }
});

// (Pastikan fungsi pauseTilt yang lama DIHAPUS atau DIKOSONGKAN saja agar tidak bentrok)
function pauseTilt(shouldPause) {
    // Tidak perlu melakukan apa-apa lagi di sini karena sudah dihandle di mousemove
}

window.addEventListener('resize', () => {
    const activeCard = document.querySelector('.position-center');
    if(activeCard) activeCard.style.transform = `translateX(0) scale(1) translateZ(0)`;
});

// --- MODAL SYSTEM ---
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.toggle('active');
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });
});

// --- DETAIL SYSTEM ---
function showDetails(event, id) {
    event.stopPropagation();
    const data = detailsDatabase[id];
    if (data) {
        document.getElementById('detail-title').innerText = data.title;
        document.getElementById('detail-desc').innerText = data.desc;
        document.getElementById('detail-link').href = data.link;

        const imgElement = document.getElementById('detail-image');
        if (data.img && data.img !== '-') {
            imgElement.src = data.img;
            imgElement.style.display = 'block';
        } else {
            imgElement.style.display = 'none';
        }
        toggleModal('detailsModal');
    }
}

const textToType = "coffee, code, music and game";
const typingElement = document.getElementById('typing-text');
let typeIndex = 0;

function typeWriter() {
    if (typeIndex < textToType.length) {
        typingElement.innerHTML += textToType.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 100); // Kecepatan ngetik
    }
}
// Jalankan saat load
window.onload = typeWriter;

// Init saat load
switchCard('profile');