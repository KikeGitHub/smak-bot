/**
 * ====================================================================
 * SMAK HONDURAS - CORE APPLICATION LOGIC (SWAP)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if configuration and products are loaded
  if (!window.SMAK_PRODUCTS || !window.SMAK_CONFIG) {
    console.error('SMAK: No se encontraron los datos del catálogo o configuración.');
    return;
  }

  const { whatsappNumber, storeName } = window.SMAK_CONFIG;
  const allProducts = window.SMAK_PRODUCTS;

  // DOM Elements
  const productGrid = document.getElementById('productGrid');
  const categoryContainer = document.getElementById('categoryPills');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClear');
  const countBadge = document.getElementById('catalogCount');
  
  // Modal Elements
  const quickViewModal = document.getElementById('quickViewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalMainImage = document.getElementById('modalMainImage');
  const modalThumbnails = document.getElementById('modalThumbnails');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDescription = document.getElementById('modalDescription');
  const modalSpecsList = document.getElementById('modalSpecsList');
  const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');

  // Navigation & Header
  const siteHeader = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileClose = document.getElementById('mobileDrawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // State
  let currentCategory = 'all';
  let searchQuery = '';

  /**
   * Helper: Generate direct WhatsApp link with pre-filled message
   */
  function createWhatsAppLink(productName = '') {
    let message = '';
    if (productName) {
      message = `¡Hola ${storeName}! Me interesa obtener información y consultar disponibilidad sobre: *${productName}*. ¿Me podrían brindar detalles?`;
    } else {
      message = `¡Hola ${storeName}! Quiero consultar sobre su catálogo de muebles y productos disponibles.`;
    }
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Render Category Pills with Dynamic Counts
   */
  function renderCategories() {
    if (!categoryContainer) return;
    
    // Calculate counts
    const counts = { all: allProducts.length };
    allProducts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const categories = window.SMAK_CATEGORIES || [
      { id: 'all', name: 'Todos los Productos', icon: 'grid' },
      { id: 'Sillas y Bancos', name: 'Sillas y Bancos', icon: 'chair' },
      { id: 'Muebles y Organización', name: 'Muebles y Organización', icon: 'box' },
      { id: 'Cocina y Baño', name: 'Cocina y Baño', icon: 'droplet' },
      { id: 'Escaleras', name: 'Escaleras', icon: 'layers' },
      { id: 'Salud y Cuidado', name: 'Salud y Cuidado', icon: 'heart' }
    ];

    categoryContainer.innerHTML = categories.map(cat => {
      const count = counts[cat.id] || 0;
      const isActive = cat.id === currentCategory ? 'active' : '';
      return `
        <button class="category-pill ${isActive}" data-category="${cat.id}">
          <span>${cat.name}</span>
          <span style="opacity: 0.6; font-size: 0.8em; margin-left: 2px;">(${count})</span>
        </button>
      `;
    }).join('');

    // Attach click events to pills
    categoryContainer.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = btn.getAttribute('data-category');
        currentCategory = cat;
        
        // Update active class
        categoryContainer.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderFilteredProducts();
      });
    });

    // Render Showcase Grid ("COMPRA POR CATEGORÍAS")
    const showcaseGrid = document.getElementById('categoriesShowcaseGrid');
    if (showcaseGrid) {
      const showcaseCategories = categories.filter(c => c.id !== 'all');
      showcaseGrid.innerHTML = showcaseCategories.map(cat => {
        const count = counts[cat.id] || 0;
        return `
          <div class="category-showcase-card" data-category="${cat.id}" role="button" tabindex="0" title="Explorar ${cat.displayName || cat.name}">
            <div class="category-card-media">
              <img src="${cat.image}" alt="${cat.displayName || cat.name}" loading="lazy">
            </div>
            <div class="category-card-info">
              <div class="category-card-texts">
                <h3 class="category-card-name">${cat.displayName || cat.name}</h3>
                <span class="category-card-subtitle">${cat.subtitle || 'Ver colección'} &bull; ${count} modelos</span>
              </div>
              <div class="category-card-arrow" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Attach click events to category showcase cards
      showcaseGrid.querySelectorAll('.category-showcase-card').forEach(card => {
        const handleCategorySelect = () => {
          const catId = card.getAttribute('data-category');
          currentCategory = catId;

          // Update active pill
          if (categoryContainer) {
            categoryContainer.querySelectorAll('.category-pill').forEach(b => {
              b.classList.toggle('active', b.getAttribute('data-category') === catId);
            });
          }

          // Render filtered products
          renderFilteredProducts();

          // Smooth scroll to catalog
          const catalogSec = document.getElementById('catalogo');
          if (catalogSec) {
            catalogSec.scrollIntoView({ behavior: 'smooth' });
          }
        };

        card.addEventListener('click', handleCategorySelect);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCategorySelect();
          }
        });
      });
    }
  }

  /**
   * Filter and Render Products
   */
  function renderFilteredProducts() {
    if (!productGrid) return;

    let filtered = allProducts;

    // Filter by Category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Update count display
    if (countBadge) {
      countBadge.innerHTML = `Mostrando <span>${filtered.length}</span> ${filtered.length === 1 ? 'producto' : 'productos'}`;
    }

    // Check if empty
    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div class="empty-catalog">
          <div class="empty-catalog-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3>No se encontraron productos</h3>
          <p>No encontramos artículos que coincidan con tu búsqueda actual.</p>
          <button class="btn-primary" id="resetFiltersBtn" style="padding: 10px 20px; font-size: 0.9rem;">
            Ver todos los productos
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (searchClearBtn) searchClearBtn.style.display = 'none';
          renderCategories();
          renderFilteredProducts();
        });
      }
      return;
    }

    // Render Cards
    productGrid.innerHTML = filtered.map(product => {
      const waUrl = createWhatsAppLink(product.name);

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-media-wrapper">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 class="card-image"
                 loading="lazy" 
                 onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'">
            <button class="btn-quick-view" data-id="${product.id}" title="Vista Rápida de ${product.name}" aria-label="Vista Rápida">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
          <div class="card-content">
            <span class="card-category">${product.category}</span>
            <h3 class="card-title" title="${product.name}">${product.name}</h3>
            
            <ul class="card-features-mini">
              <li class="card-feature-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Calidad prémium garantizada</span>
              </li>
              <li class="card-feature-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Envíos a toda Honduras</span>
              </li>
            </ul>

            <div class="card-actions">
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-action" aria-label="Consultar ${product.name} por WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>Consultar por WhatsApp</span>
              </a>
              <button class="btn-card-details" data-id="${product.id}" title="Detalles del producto" aria-label="Ver detalles">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click events for Quick View
    productGrid.querySelectorAll('.btn-quick-view, .btn-card-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        openQuickView(id);
      });
    });
  }

  /**
   * Modal: Open Quick View with full details & gallery
   */
  function openQuickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product || !quickViewModal) return;

    modalTitle.textContent = product.name;
    modalCategory.textContent = product.category;
    modalDescription.textContent = product.description;

    // Specs
    modalSpecsList.innerHTML = product.features.map(spec => `
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${spec}</span>
      </li>
    `).join('');

    // Gallery
    const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    modalMainImage.src = galleryImages[0];
    modalMainImage.alt = product.name;

    modalThumbnails.innerHTML = galleryImages.map((imgUrl, i) => `
      <div class="thumb-item ${i === 0 ? 'active' : ''}" data-url="${imgUrl}">
        <img src="${imgUrl}" alt="Miniatura ${i + 1}" loading="lazy">
      </div>
    `).join('');

    modalThumbnails.querySelectorAll('.thumb-item').forEach(item => {
      item.addEventListener('click', () => {
        modalThumbnails.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        modalMainImage.style.opacity = '0.3';
        setTimeout(() => {
          modalMainImage.src = item.getAttribute('data-url');
          modalMainImage.style.opacity = '1';
        }, 120);
      });
    });

    // WhatsApp CTA button in Modal
    modalWhatsappBtn.href = createWhatsAppLink(product.name);

    // Show modal
    quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Modal: Close Quick View
   */
  function closeQuickView() {
    if (!quickViewModal) return;
    quickViewModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeQuickView);
  }

  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) {
        closeQuickView();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quickViewModal.classList.contains('open')) {
      closeQuickView();
    }
  });

  /**
   * Search Input handling
   */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
      }
      renderFilteredProducts();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      searchClearBtn.style.display = 'none';
      renderFilteredProducts();
      if (searchInput) searchInput.focus();
    });
  }

  /**
   * FAQ Accordion Interactivity
   */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close others
        faqItems.forEach(other => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  /**
   * Mobile Menu Drawer
   */
  function toggleMobileMenu(open) {
    if (mobileDrawer) mobileDrawer.classList.toggle('open', open);
    if (mobileOverlay) mobileOverlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu(true));
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => toggleMobileMenu(false));
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  /**
   * Header Scroll Shadow
   */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Initial Setup
  renderCategories();
  renderFilteredProducts();
});
