// --- 1. Data Structure ---
const images = [
    { id: 1, src: 'Assets/landscapes.jpg', title: 'landscapes', category: 'Nature' },
    { id: 2, src: 'Assets/forest.jpg', title: 'forest', category: 'Nature' },
    { id: 3, src: 'Assets/quiet-lake.jpg', title: 'quiet lake', category: 'Nature' },
    { id: 4, src: 'Assets/dog.jpg', title: 'dog', category: 'Animals' },
    { id: 5, src: 'Assets/cat.jpg', title: 'cat', category: 'Animals' },
    { id: 6, src: 'Assets/bird.jpg', title: 'bird', category: 'Animals' },
    { id: 7, src: 'Assets/cityscapes.jpg', title: 'cityscapes', category: 'Travel' },
    { id: 8, src: 'Assets/the-louvre-pyramid.jpg', title: 'The Louvre Pyramid', category: 'Travel' },
    { id: 9, src: 'Assets/airplanes.jpg', title: 'airplanes', category: 'Travel' },
    { id: 10, src: 'Assets/plated-dishes.jpg', title: 'Plated dishes', category: 'Food' },
    { id: 11, src: 'Assets/coffee-art.jpg', title: 'coffee art', category: 'Food' },
    { id: 12, src: 'Assets/dessert.jpg', title: 'dessert', category: 'Food' },
    { id: 13, src: 'Assets/landscapes.jpg', title: 'landscapes 2', category: 'Nature' },
    { id: 14, src: 'Assets/forest.jpg', title: 'forest 2', category: 'Nature' },
    { id: 15, src: 'Assets/quiet-lake.jpg', title: 'quiet lake 2', category: 'Nature' },
    { id: 16, src: 'Assets/dog.jpg', title: 'dog 2', category: 'Animals' },
    { id: 17, src: 'Assets/cat.jpg', title: 'cat 2', category: 'Animals' },
    { id: 18, src: 'Assets/bird.jpg', title: 'bird 2', category: 'Animals' },
    { id: 19, src: 'Assets/cityscapes.jpg', title: 'cityscapes 2', category: 'Travel' },
    { id: 20, src: 'Assets/the-louvre-pyramid.jpg', title: 'The Louvre Pyramid 2', category: 'Travel' },
    { id: 21, src: 'Assets/airplanes.jpg', title: 'airplanes 2', category: 'Travel' },
    { id: 22, src: 'Assets/plated-dishes.jpg', title: 'Plated dishes 2', category: 'Food' },
    { id: 23, src: 'Assets/coffee-art.jpg', title: 'coffee art 2', category: 'Food' },
    { id: 24, src: 'Assets/dessert.jpg', title: 'dessert 2', category: 'Food' }
];

// State
let currentImages = [...images];
let lightboxIndex = 0;
let isSlideshowPlaying = false;
let slideshowInterval = null;

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const noResults = document.getElementById('no-results');

// Lightbox DOM Elements
const lightbox = document.getElementById('lightbox');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxCounter = document.getElementById('lightbox-counter');
const btnClose = document.getElementById('lightbox-close');
const btnPrev = document.getElementById('lightbox-prev');
const btnNext = document.getElementById('lightbox-next');
const btnSsPrev = document.getElementById('slideshow-prev');
const btnSsNext = document.getElementById('slideshow-next');
const btnSsToggle = document.getElementById('slideshow-toggle');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');

// --- 2. Render Gallery ---
function renderGallery(imageArray) {
    galleryGrid.innerHTML = '';
    if (imageArray.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        imageArray.forEach((img, index) => {
            // Create card
            const card = document.createElement('div');
            card.className = 'card glass-card rounded-xl overflow-hidden cursor-pointer animate-fade-in group';
            card.style.animationDelay = `${index * 0.05}s`; // Staggered animation
            
            // Allow clicking to open lightbox
            card.addEventListener('click', () => openLightbox(img.id));

            // HTML structure
            card.innerHTML = `
                <div class="image-container relative">
                    <img src="${img.src}" alt="${img.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x500?text=Image+Not+Found'">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <span class="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">${img.category}</span>
                        <h3 class="text-lg font-bold text-white">${img.title}</h3>
                    </div>
                </div>
            `;
            galleryGrid.appendChild(card);
        });
    }
}

// --- 3. Filter & Search Logic ---
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.dataset.filter : 'All';

    currentImages = images.filter(img => {
        const matchesSearch = img.title.toLowerCase().includes(searchTerm) || img.category.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'All' || img.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    renderGallery(currentImages);
}

// Event Listeners for Search
searchInput.addEventListener('input', applyFilters);

// Event Listeners for Filter Buttons
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked
        btn.classList.add('active');
        applyFilters();
    });
});

// --- 4. Lightbox & Slideshow Logic ---
function openLightbox(id) {
    // Find index in current filtered array
    const index = currentImages.findIndex(img => img.id === id);
    if (index === -1) return; // Edge case if not found
    
    lightboxIndex = index;
    updateLightboxContent();
    
    // Show lightbox
    lightbox.classList.remove('hidden');
    // Trigger reflow for transition
    void lightbox.offsetWidth;
    lightbox.classList.remove('opacity-0');
    lightbox.classList.add('opacity-100');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    stopSlideshow();
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }, 300); // match transition duration
}

function updateLightboxContent() {
    if (currentImages.length === 0) return;
    const img = currentImages[lightboxIndex];
    
    // Fade out slightly, change source, fade in
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxTitle.textContent = img.title;
        lightboxCategory.textContent = img.category;
        lightboxCounter.textContent = `${lightboxIndex + 1} / ${currentImages.length}`;
        lightboxImg.style.opacity = '1';
    }, 150);
}

function nextImage() {
    if (currentImages.length === 0) return;
    lightboxIndex = (lightboxIndex + 1) % currentImages.length;
    updateLightboxContent();
}

function prevImage() {
    if (currentImages.length === 0) return;
    lightboxIndex = (lightboxIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxContent();
}

function toggleSlideshow() {
    if (isSlideshowPlaying) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
}

function startSlideshow() {
    if (currentImages.length <= 1) return;
    isSlideshowPlaying = true;
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
    slideshowInterval = setInterval(nextImage, 3000);
}

function stopSlideshow() {
    isSlideshowPlaying = false;
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// Lightbox Event Listeners
btnClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);

btnNext.addEventListener('click', () => {
    stopSlideshow(); // Manual navigation stops slideshow
    nextImage();
});
btnPrev.addEventListener('click', () => {
    stopSlideshow();
    prevImage();
});

btnSsNext.addEventListener('click', () => {
    stopSlideshow();
    nextImage();
});
btnSsPrev.addEventListener('click', () => {
    stopSlideshow();
    prevImage();
});

btnSsToggle.addEventListener('click', toggleSlideshow);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return; // Only if lightbox is open
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') { stopSlideshow(); nextImage(); }
    if (e.key === 'ArrowLeft') { stopSlideshow(); prevImage(); }
    if (e.key === ' ') { e.preventDefault(); toggleSlideshow(); } // Space to toggle
});

// Initialize
renderGallery(currentImages);
