// --- DATA BASE ---
const detailsDatabase = {
    'proj-1': {
        title: 'Personal Website',
        desc: 'Personal Website dengan gaya visual dark mode dan 3D motion ini adalah projek pertama saya yang di publikasikan',
        link: '#',
        img: 'image/project1.png'
    },
    'proj-2': {
        title: '-',
        desc: '-',
        link: '#',
        img: '-'
    },
    'cert-1': {
        title: 'Dibimbing Network Engineer',
        desc: 'Sertifikasi fundamental mengenai Network Engineer.',
        link: '#',
        img: 'image/dibimbing.jpg'
    },
    'cert-2': {
        title: 'Fiber To The x',
        desc: 'Workshop Overview Telkomsel mengenai FTTx (Fiber To The x).',
        link: '#',
        img : 'image/Telkom.jpg'
    }
};

// --- VARIABEL ---
const cardProfile = document.getElementById('card-profile');
const cardProjects = document.getElementById('card-projects');
const cardCerts = document.getElementById('card-certs');
const btns = document.querySelectorAll('.nav-btn');
const stage = document.querySelector('.stage-container');
let isTiltPaused = false; // Flag untuk menghentikan gerak 3D saat hover tombol

// --- NAVIGASI & KARTU ---
function resetNav() { btns.forEach(btn => btn.classList.remove('active')); }

function setPositions(center, left, right) {
    [center, left, right].forEach(card => {
        card.className = 'card'; 
        card.style.transform = ''; // Reset transform manual
    });
    center.classList.add('position-center');
    left.classList.add('position-left');
    right.classList.add('position-right');
}

function switchCard(type) {
    resetNav();
    if (type === 'profile') {
        document.getElementById('btn-profile').classList.add('active');
        setPositions(cardProfile, cardProjects, cardCerts);
    } else if (type === 'projects') {
        document.getElementById('btn-projects').classList.add('active');
        setPositions(cardProjects, cardCerts, cardProfile);
    } else if (type === 'certs') {
        document.getElementById('btn-certs').classList.add('active');
        setPositions(cardCerts, cardProfile, cardProjects);
    }
}

// --- LOGIKA TILT 3D (OPTIMAL UNTUK RESPONSIVE) ---

function pauseTilt(shouldPause) {
    isTiltPaused = shouldPause;
    
    // Jika dipause (mouse di atas tombol), reset posisi kartu
    if (shouldPause) {
        const activeCard = document.querySelector('.position-center');
        if (activeCard) {
            activeCard.style.transform = `translateX(0) scale(1) translateZ(0) rotateX(0) rotateY(0)`;
        }
    }
}

stage.addEventListener('mousemove', (e) => {
    // UPDATE: Cek Device! Jika lebar layar < 768px (HP), jangan jalankan efek tilt
    if (window.innerWidth <= 768) return; 

    if (isTiltPaused || document.querySelector('.modal-overlay.active')) return;

    const activeCard = document.querySelector('.position-center');
    if(activeCard) { 
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2; const centerY = rect.height / 2;
        
        // Sensitivitas
        const rotateX = ((y - centerY) / 25) * -1; 
        const rotateY = (x - centerX) / 25;
        
        activeCard.style.transform = `translateX(0) scale(1) translateZ(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

stage.addEventListener('mouseleave', () => {
    const activeCard = document.querySelector('.position-center');
    if(activeCard) {
        activeCard.style.transition = 'transform 0.5s ease';
        activeCard.style.transform = `translateX(0) scale(1) translateZ(0) rotateX(0) rotateY(0)`;
    }
});

// UPDATE: Reset posisi jika layar di-resize
window.addEventListener('resize', () => {
    const activeCard = document.querySelector('.position-center');
    if(activeCard) {
        activeCard.style.transform = `translateX(0) scale(1) translateZ(0)`;
    }
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

// --- SHOW DETAILS ---
function showDetails(event, id) {
    event.stopPropagation(); 
    console.log("Mencoba membuka ID:", id);

    const data = detailsDatabase[id];
    
    if (data) {
        document.getElementById('detail-title').innerText = data.title;
        document.getElementById('detail-desc').innerHTML = data.desc;
        document.getElementById('detail-link').href = data.link;

        const imgElement = document.getElementById('detail-image');
        if (data.img && data.img !== '-') {
            imgElement.src = data.img;
            imgElement.style.display = 'block';
        } else {
            imgElement.style.display = 'none';
        }

        toggleModal('detailsModal');
    } else {
        console.error("Data tidak ditemukan untuk ID:", id);
    }
}

// Init
switchCard('profile');
