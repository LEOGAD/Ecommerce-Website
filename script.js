/**
 * Stitch E-Commerce - Shared Functionality
 * Simulates Login, Registration, Cart, Admin Dashboard, and Search/Filters
 */

document.addEventListener('DOMContentLoaded', () => {
    initStoreData();
    initAuth();
    initCart();
    initNewsletter();
    const path = window.location.pathname.toLowerCase();
    if (path.includes('products.html') || path.includes('index.html') || path.includes('new-arrivals.html') || path === '/' || path.endsWith('/stitch/')) {
        initProducts();
    }
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
    if (window.location.pathname.includes('admin.html')) {
        initAdmin();
    }
    ensureProductLinks();
    trackAnalytics();
    initMobileMenus();
});

// --- Mobile Menus ---
function initMobileMenus() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    const adminMenuBtn = document.getElementById('admin-menu-btn');
    const adminSidebar = document.getElementById('admin-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (adminMenuBtn && adminSidebar && sidebarOverlay) {
        const toggleAdminSidebar = () => {
            adminSidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
        };

        adminMenuBtn.addEventListener('click', toggleAdminSidebar);
        sidebarOverlay.addEventListener('click', toggleAdminSidebar);
    }
}

// --- Store Data Initialization ---
function initStoreData() {
    if (!localStorage.getItem('stitch_categories')) {
        const initialCategories = ['Apparel', 'Accessories', 'Home Decor', 'Footwear'];
        localStorage.setItem('stitch_categories', JSON.stringify(initialCategories));
    }

    if (!localStorage.getItem('stitch_products')) {
        const initialProducts = [
            {
                id: '1',
                name: 'Signature Series Chrono',
                price: '299.00',
                category: 'Accessories',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Ni-oHt7RgY6Gds64YGd_CDGBST448zGEJvCQWJT-CIjGUULNwRirZzbRsXCDLNORO4ZoD7HCqQK2lhKAM5-kdA-B9SnkQ4A1Eq9EGJOp63Cx3lsS2tKY-A8M0Jw1k1fqfqqeL-rW9Ls5UWEcyW_mv9-qA2tdKZQJcSqOnxOzE1eugXtf_gEGKBKGyaOK2MyYu7he6LaU8o029dLcnr5WnjBqFEvk6mU8Njj-tA44AnIJn_YSS5VFdbLYstEdw6npWiRAXdXCsykW',
                hoverImage: '',
                description: 'Minimalist luxury white watch on studio background',
                stock: 10,
                discount: 0,
                colors: ['#e2e8f0', '#1e293b']
            },
            {
                id: '2',
                name: 'Velocity Sport Elite',
                price: '185.00',
                category: 'Footwear',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgHnKPxopHBCnvTmRHZzpZUg0CbXvJdZTt2kv_I4nnBgP7tSTqI8gV2PFoZe6hjxkEojc0vjnTprmHTGI_Y3UOGCcsGzAfh9w-Vs5g5cOUZEKdPyHts19pLEGS_EwyTSeU6WoQ7j5hOe3aXO58CCtVegw4_4lDioD6coqKe_MNmbNbA5lcvSihxXbKxc4ZflxAPo6kUoa8eEJPEcwHRv6WSEVS3yNC4R_XYnY2deTq26WXzZ2av7_TqJOrMggeGVBA-p77rjpNlgds',
                hoverImage: '',
                description: 'Vibrant orange professional running sneakers',
                stock: 15,
                discount: 0,
                colors: ['#ec5b13', '#0f172a']
            },
            {
                id: '3',
                name: 'Studio Harmony ANC',
                price: '350.00',
                category: 'Accessories',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDknpXCfuyy9sPvcXqmsGDK8e1169owvbOiMBFVo5b-LMM71ba9BY_xpr_SeQFqOxPunCgpRM802Pu13YF_kVXC5tb4-p4snoRIAkYicIeAftUAsKqDcgD2VF7ZbZMKeFVmq1GJ6MVhC1tt346KO2Yvzaph2wck_ttmLyj20htswjxAi6N0Lq5wU_T0tkiXbjFIQI0shM-7kzeZvq0H9qlWaYK6x6NAZBWfUbFwsuRBVb7V4hCES1TC9VIYMyLSRws3ays4J1eZbwF',
                hoverImage: '',
                description: 'Professional wireless over-ear headphones in gold and black',
                stock: 5,
                discount: 0,
                colors: [],
                badge: 'NEW'
            },
            {
                id: '4',
                name: 'Heritage Leather Low',
                price: '210.00',
                category: 'Footwear',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOsS4ziZlzjFXlAwZ7RvX0hA6atBzEVQ3rnMUbYOoK-myc2TZc8Yt6RcPJLKMRWc0tpeiqlG3flDLGis5Pv3-xYIkRJo3oNoDV3BTdUzh60DF_EO-Rx1bh3_3Ed-S9NXmIcTTn9AlEm-KirMjuJv-wKQ42fApqLw7noUlxB7ibf141Gh_5Wb7qaFrNxU--5lRluB4I3ZrHeMrVEPJHVtxSOEn3mO6HXTFdU2NkA7ASDg3ChjpG7B_5j09UmYuodO5XoZXZ4um19Euc',
                hoverImage: '',
                description: 'Luxury leather casual shoes in a lifestyle setting',
                stock: 20,
                discount: 0,
                colors: ['#8B4513', '#94a3b8']
            }
        ];
        localStorage.setItem('stitch_products', JSON.stringify(initialProducts));
    }
}

// --- Analytics ---

function trackAnalytics() {
    let analytics = JSON.parse(localStorage.getItem('stitch_analytics')) || { pageViews: 0, clicks: 0, productClicks: {} };
    analytics.pageViews += 1;
    localStorage.setItem('stitch_analytics', JSON.stringify(analytics));

    document.addEventListener('click', (e) => {
        const productBtn = e.target.closest('.add-to-cart-btn, .quick-add');
        if (productBtn) {
            analytics.clicks += 1;
            const productCard = productBtn.closest('.group, .product-card-hover, .max-w-7xl');
            const productName = productCard?.querySelector('h1, h2, h3')?.textContent?.trim() || 'Unknown';
            analytics.productClicks[productName] = (analytics.productClicks[productName] || 0) + 1;
            localStorage.setItem('stitch_analytics', JSON.stringify(analytics));
        }
    });
}

// --- Authentication (Simulation via localStorage) ---

function initAuth() {
    const user = JSON.parse(localStorage.getItem('stitch_user'));
    const authButtons = document.querySelectorAll('.person-btn, [href="#person"], #person-icon');

    if (user) {
        authButtons.forEach(btn => {
            btn.innerHTML = `<span class="material-symbols-outlined">account_circle</span> <span class="text-xs hidden md:inline font-bold">${user.name}</span>`;
            btn.classList.add('logged-in');

            // Create Dropdown Container
            btn.style.position = 'relative';
            const dropdown = document.createElement('div');
            dropdown.className = 'auth-dropdown hidden absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl z-[100] overflow-hidden';
            dropdown.innerHTML = `
                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <p class="text-xs text-slate-500">Logged in as</p>
                    <p class="text-sm font-bold truncate">${user.email}</p>
                </div>
                ${user.role === 'admin' ? `
                    <a href="admin.html" class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span class="material-symbols-outlined text-lg">dashboard</span> Admin Panel
                    </a>
                ` : ''}
                <button id="logout-btn" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <span class="material-symbols-outlined text-lg">logout</span> Logout
                </button>
            `;
            btn.appendChild(dropdown);

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });

            dropdown.querySelector('#logout-btn').addEventListener('click', () => {
                localStorage.removeItem('stitch_user');
                window.location.reload();
            });
        });

        // Close dropdown on outside click
        window.addEventListener('click', () => {
            document.querySelectorAll('.auth-dropdown').forEach(d => d.classList.add('hidden'));
        });
    } else {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.person-btn, [href="#person"], #person-icon');
            if (btn) {
                e.preventDefault();
                window.location.href = 'login.html';
            }
        });
    }
}

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');

if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.replace('text-slate-500', 'text-primary');
        tabLogin.classList.replace('border-transparent', 'border-primary');
        tabRegister.classList.replace('text-primary', 'text-slate-500');
        tabRegister.classList.replace('border-primary', 'border-transparent');
    });

    tabRegister.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        tabRegister.classList.replace('text-slate-500', 'text-primary');
        tabRegister.classList.replace('border-transparent', 'border-primary');
        tabLogin.classList.replace('text-primary', 'text-slate-500');
        tabLogin.classList.replace('border-primary', 'border-transparent');
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        let customers = JSON.parse(localStorage.getItem('stitch_customers')) || [];
        // Check if customer email already exists
        if (customers.find(c => c.email === data.email)) {
            alert('Email already registered! Please log in.');
            return;
        }

        const newCustomer = {
            id: `CUST-${Math.floor(Math.random() * 9000) + 1000}`,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password, // Simulated plaintext storage
            registeredAt: new Date().toLocaleDateString()
        };

        customers.unshift(newCustomer);
        localStorage.setItem('stitch_customers', JSON.stringify(customers));

        localStorage.setItem('stitch_user', JSON.stringify({
            name: newCustomer.name,
            email: newCustomer.email,
            role: 'user'
        }));

        alert('Registration successful! Welcome to LUXE.');
        const redirect = localStorage.getItem('auth_redirect') || 'index.html';
        localStorage.removeItem('auth_redirect');
        window.location.href = redirect;
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        const isAdmin = data.email === 'admin@luxe.com' && data.password === 'LuxeAdminSecureX99';
        const customers = JSON.parse(localStorage.getItem('stitch_customers')) || [];
        const customer = customers.find(c => c.email === data.email && c.password === data.password);

        if (isAdmin) {
            localStorage.setItem('stitch_user', JSON.stringify({
                name: 'Administrator',
                email: data.email,
                role: 'admin'
            }));
            alert('Admin access granted. Redirecting to dashboard.');
            window.location.href = 'admin.html';
        } else if (customer) {
            localStorage.setItem('stitch_user', JSON.stringify({
                name: customer.name,
                email: customer.email,
                role: 'user'
            }));
            alert('Login successful! Welcome back.');
            const redirect = localStorage.getItem('auth_redirect') || 'index.html';
            localStorage.removeItem('auth_redirect');
            window.location.href = redirect;
        } else {
            alert('Invalid email or password.');
        }
    });
}

// --- Cart Functionality ---

function initCart() {
    updateCartBadge();

    document.addEventListener('click', (e) => {
        const cartBtn = e.target.closest('.add-to-cart-btn, .quick-add');
        if (cartBtn) {
            e.preventDefault();
            const productCard = cartBtn.closest('.group, .product-card-hover, .max-w-7xl');
            if (productCard) {
                // More robust selectors that don't depend on specific Tailwind classes
                const nameEl = productCard.querySelector('h1, h2, h3, .product-title');
                // Target elements that look like prices (usually have $ or are bold/xl)
                const priceEl = productCard.querySelector('.price, .text-2xl, .text-xl, .font-bold, .text-primary, span[class*="text-slate-500"]');
                const imgEl = productCard.querySelector('img');

                const product = {
                    id: Date.now(),
                    name: nameEl?.textContent?.trim() || 'Premium Product',
                    price: priceEl?.textContent?.trim() || '$0.00',
                    image: imgEl?.src || '',
                    quantity: 1
                };
                console.log('Adding product:', product);
                addToCart(product);

                // Visual feedback
                const originalText = cartBtn.innerHTML;
                cartBtn.innerHTML = '<span class="material-symbols-outlined">done</span> Added!';
                setTimeout(() => { cartBtn.innerHTML = originalText; }, 1500);
            }
        }
    });

    const cartIcon = document.querySelector('.shopping-bag-btn, [href="#shopping_bag"]');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('stitch_cart')) || [];
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }
    localStorage.setItem('stitch_cart', JSON.stringify(cart));
    updateCartBadge();
    trackAbandonedCart(cart);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('stitch_cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('stitch_cart')) || [];
    const emptyState = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');

    if (cart.length === 0) {
        if (cartContainer) cartContainer.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (cartSummary) cartSummary.classList.add('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (cartSummary) cartSummary.classList.remove('hidden');

    if (cartContainer) {
        cartContainer.innerHTML = cart.map((item, index) => `
            <div class="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1">
                    <h3 class="font-bold">${item.name}</h3>
                    <p class="text-primary font-semibold">${item.price}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="updateQty(${index}, -1)" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span class="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span class="text-sm font-bold">${item.quantity}</span>
                        <button onclick="updateQty(${index}, 1)" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span class="material-symbols-outlined text-sm">add</span>
                        </button>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="text-slate-400 hover:text-red-500">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            return sum + (price * item.quantity);
        }, 0);

        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
}

window.updateQty = (index, delta) => {
    let cart = JSON.parse(localStorage.getItem('stitch_cart')) || [];
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('stitch_cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
    trackAbandonedCart(cart);
};

window.removeFromCart = (index) => {
    let cart = JSON.parse(localStorage.getItem('stitch_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('stitch_cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
};

window.checkout = () => {
    if (!localStorage.getItem('stitch_user')) {
        localStorage.setItem('auth_redirect', 'cart.html');
        window.location.href = 'login.html';
    } else {
        const cart = JSON.parse(localStorage.getItem('stitch_cart')) || [];
        const user = JSON.parse(localStorage.getItem('stitch_user'));
        const orders = JSON.parse(localStorage.getItem('stitch_orders')) || [];

        // Find and complete abandoned order if exists
        const existingAbandonedIndex = orders.findIndex(o => o.email === user.email && o.status === 'Abandoned');

        const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
            customer: user.name,
            email: user.email,
            date: new Date().toLocaleDateString(),
            amount: cart.reduce((sum, item) => sum + (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity), 0).toFixed(2),
            status: 'Completed',
            items: cart
        };

        if (existingAbandonedIndex > -1) {
            orders[existingAbandonedIndex] = newOrder;
        } else {
            orders.unshift(newOrder);
        }

        localStorage.setItem('stitch_orders', JSON.stringify(orders));

        alert('Thank you for your order! It has been successfully processed.');
        localStorage.removeItem('stitch_cart');
        window.location.href = 'index.html';
    }
};

function trackAbandonedCart(cart) {
    const user = JSON.parse(localStorage.getItem('stitch_user'));
    if (!user || cart.length === 0) return;

    const orders = JSON.parse(localStorage.getItem('stitch_orders')) || [];
    const existingIndex = orders.findIndex(o => o.email === user.email && o.status === 'Abandoned');

    const abandonedOrder = {
        id: `ABD-${Math.floor(Math.random() * 9000) + 1000}`,
        customer: user.name,
        email: user.email,
        date: new Date().toLocaleDateString(),
        amount: cart.reduce((sum, item) => sum + (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity), 0).toFixed(2),
        status: 'Abandoned',
        items: cart
    };

    if (existingIndex > -1) {
        orders[existingIndex] = abandonedOrder;
    } else {
        orders.unshift(abandonedOrder);
    }
    localStorage.setItem('stitch_orders', JSON.stringify(orders));
}

// --- Admin Interactivity ---

function initAdmin() {
    const navLinks = document.querySelectorAll('aside nav a');
    const sections = ['Dashboard', 'Products', 'Categories', 'Orders', 'Customers', 'Settings'];

    // Load persisted tab or default to Dashboard
    let activeTab = localStorage.getItem('luxe_admin_tab') || 'Dashboard';
    if (!sections.includes(activeTab)) activeTab = 'Dashboard';

    // Function to set active link styling
    const setActiveLink = (tabName) => {
        navLinks.forEach(l => {
            const linkName = l.querySelector('span:last-child')?.textContent;
            if (linkName === tabName) {
                l.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-800');
                l.classList.add('bg-primary', 'text-white');
            } else {
                l.classList.remove('bg-primary', 'text-white');
                l.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-800');
            }
        });
    };

    // Initialize initial tab
    setActiveLink(activeTab);
    renderAdminSection(activeTab);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const tabName = link.querySelector('span:last-child')?.textContent;
            if (sections.includes(tabName)) {
                e.preventDefault();
                localStorage.setItem('luxe_admin_tab', tabName);
                setActiveLink(tabName);
                renderAdminSection(tabName);
            }
        });
    });
}

function renderAdminSection(section) {
    const mainTitle = document.querySelector('main h1');
    const contentArea = document.querySelector('#admin-content');
    if (!mainTitle || !contentArea) return;

    const analytics = JSON.parse(localStorage.getItem('stitch_analytics')) || { pageViews: 0, clicks: 0, productClicks: {} };
    const orders = JSON.parse(localStorage.getItem('stitch_orders')) || [];

    mainTitle.textContent = section;

    if (section === 'Dashboard') {
        const completedOrders = orders.filter(o => o.status === 'Completed' || !o.status?.includes('Abandoned'));
        const abandonedOrders = orders.filter(o => o.status === 'Abandoned');
        const revenue = completedOrders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

        contentArea.innerHTML = `
            <div class="space-y-8 pb-8">
                <!-- Top Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Revenue -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div class="absolute -right-6 -top-6 text-primary/10 group-hover:text-primary/20 transition-colors">
                            <span class="material-symbols-outlined text-8xl" style="font-size: 100px;">payments</span>
                        </div>
                        <p class="text-sm text-slate-500 mb-1 relative z-10">Total Revenue</p>
                        <h3 class="text-3xl font-bold relative z-10">$${revenue.toFixed(2)}</h3>
                    </div>
                    <!-- Completed Orders -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div class="absolute -right-6 -top-6 text-green-500/10 group-hover:text-green-500/20 transition-colors">
                            <span class="material-symbols-outlined text-8xl" style="font-size: 100px;">check_circle</span>
                        </div>
                        <p class="text-sm text-slate-500 mb-1 relative z-10">Completed Orders</p>
                        <h3 class="text-3xl font-bold relative z-10">${completedOrders.length}</h3>
                    </div>
                    <!-- Abandoned Orders -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div class="absolute -right-6 -top-6 text-red-500/10 group-hover:text-red-500/20 transition-colors">
                            <span class="material-symbols-outlined text-8xl" style="font-size: 100px;">remove_shopping_cart</span>
                        </div>
                        <p class="text-sm text-slate-500 mb-1 relative z-10">Abandoned Orders</p>
                        <h3 class="text-3xl font-bold relative z-10">${abandonedOrders.length}</h3>
                    </div>
                    <!-- Product Clicks -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div class="absolute -right-6 -top-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                            <span class="material-symbols-outlined text-8xl" style="font-size: 100px;">ads_click</span>
                        </div>
                        <p class="text-sm text-slate-500 mb-1 relative z-10">Total Product Clicks</p>
                        <h3 class="text-3xl font-bold relative z-10">${analytics.clicks}</h3>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Revenue Chart -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-bold">Revenue Overview</h3>
                            <button class="text-sm text-primary font-bold hover:underline">View Report</button>
                        </div>
                        <div class="relative h-64 w-full">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>

                    <!-- Orders/Engagement Mix -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-bold">Order Breakdown</h3>
                            <span class="text-xs text-slate-500">Based on cart interaction</span>
                        </div>
                        <div class="relative h-64 w-full flex justify-center">
                            <canvas id="ordersChart"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- Bottom Activity Table -->
                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 w-full lg:w-1/2">
                    <h3 class="text-lg font-bold mb-4">Top Products by Clicks</h3>
                    <div class="space-y-3">
                        ${Object.entries(analytics.productClicks).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => `
                            <div class="flex items-center justify-between">
                                <span class="text-sm">${name}</span>
                                <span class="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">${count} clicks</span>
                            </div>
                        `).join('') || '<p class="text-sm text-slate-500">No clicks tracked yet.</p>'}
                    </div>
                </div>
            </div>
        `;

        // Initialize Charts safely
        setTimeout(() => {
            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#94a3b8' : '#64748b';
            const gridColor = isDark ? '#1e293b' : '#f1f5f9';

            // Generate some dummy historical data, appending actual total to the end
            const revCtx = document.getElementById('revenueChart');
            if (revCtx) {
                new Chart(revCtx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
                        datasets: [{
                            label: 'Revenue ($)',
                            data: [1200, 1900, 800, 2400, 1500, 3100, revenue || 100],
                            borderColor: '#ec5b13',
                            backgroundColor: 'rgba(236, 91, 19, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { grid: { display: false }, ticks: { color: textColor } },
                            y: { grid: { color: gridColor }, border: { dash: [4, 4] }, ticks: { color: textColor } }
                        }
                    }
                });
            }

            const ordCtx = document.getElementById('ordersChart');
            if (ordCtx) {
                // Determine sensible data points to display
                const compCount = completedOrders.length > 0 ? completedOrders.length : 12;
                const abCount = abandonedOrders.length > 0 ? abandonedOrders.length : 4;

                new Chart(ordCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Completed Orders', 'Abandoned Carts'],
                        datasets: [{
                            data: [compCount, abCount],
                            backgroundColor: ['#22c55e', '#ef4444'],
                            borderWidth: 0,
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { color: textColor, padding: 20, usePointStyle: true }
                            }
                        }
                    }
                });
            }
        }, 50);

        return;
    }

    if (section === 'Products') {
        const products = JSON.parse(localStorage.getItem('stitch_products')) || [];
        const categories = JSON.parse(localStorage.getItem('stitch_categories')) || ['Apparel', 'Accessories', 'Home Decor', 'Footwear', 'Tech', 'Grooming', 'Knitwear', 'T-Shirts', 'Home', 'Dining'];

        contentArea.innerHTML = `
            <div class="space-y-8 pb-8">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 class="text-xl font-bold mb-6" id="productFormTitle">Create New Product</h3>
                    <form id="add-product-form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="hidden" name="id" id="productId">
                        <div class="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                           <!-- Primary Image Upload -->
                            <div class="text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 hover:border-primary transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer h-full flex flex-col items-center justify-center" onclick="document.getElementById('productImage').click()">
                                <input type="file" id="productImage" accept="image/*" class="hidden" onchange="previewImage(event, 'imagePreview', 'imagePreviewContainer', 'imagePlaceholder', 'primaryImageData')">
                                <div id="imagePreviewContainer" class="hidden mx-auto size-24 rounded-xl overflow-hidden mb-2 border border-slate-200 dark:border-slate-700">
                                    <img id="imagePreview" src="" class="w-full h-full object-cover">
                                </div>
                                <div id="imagePlaceholder">
                                    <span class="material-symbols-outlined text-3xl text-slate-400 mb-2">cloud_upload</span>
                                    <p class="text-sm font-bold opacity-70">Primary Image</p>
                                </div>
                                <input type="hidden" id="primaryImageData" name="image">
                            </div>
                           <!-- Secondary Image Upload -->
                            <div class="text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 hover:border-primary transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer h-full flex flex-col items-center justify-center" onclick="document.getElementById('hoverImage').click()">
                                <input type="file" id="hoverImage" accept="image/*" class="hidden" onchange="previewImage(event, 'hoverPreview', 'hoverPreviewContainer', 'hoverPlaceholder', 'hoverImageData')">
                                <div id="hoverPreviewContainer" class="hidden mx-auto size-24 rounded-xl overflow-hidden mb-2 border border-slate-200 dark:border-slate-700">
                                    <img id="hoverPreview" src="" class="w-full h-full object-cover">
                                </div>
                                <div id="hoverPlaceholder">
                                    <span class="material-symbols-outlined text-3xl text-slate-400 mb-2">photo_library</span>
                                    <p class="text-sm font-bold opacity-70">Hover Image (Optional)</p>
                                </div>
                                <input type="hidden" id="hoverImageData" name="hoverImageBase64">
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-bold opacity-70">Product Name</label>
                            <input name="name" id="productName" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" placeholder="e.g. Minimalist Lamp">
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold opacity-70">Category</label>
                            <select name="category" id="productCategory" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary">
                                ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold opacity-70">Price ($)</label>
                            <input name="price" id="productPrice" type="text" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" placeholder="e.g. 120.00">
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold opacity-70">Discount (%)</label>
                            <input name="discount" id="productDiscount" type="number" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" placeholder="e.g. 15">
                        </div>
                        <div class="space-y-2 md:col-span-2">
                            <label class="text-sm font-bold opacity-70">Product Description</label>
                            <textarea name="description" id="productDesc" rows="2" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary resize-none" placeholder="Detailed description..."></textarea>
                        </div>
                        <div class="space-y-2 md:col-span-2 flex gap-4 mt-2">
                            <button type="button" onclick="resetProductForm()" class="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                            <button type="submit" class="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 flex justify-center items-center gap-2">
                                <span class="material-symbols-outlined">save</span> Save Product
                            </button>
                        </div>
                    </form>
                </div>

                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 class="text-lg font-bold">All Products</h3>
                        <span class="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">${products.length} items</span>
                    </div>
                    <div class="p-0">
                        ${products.length === 0 ? '<p class="text-center py-12 text-slate-500">No products found.</p>' : `
                            <div class="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                                ${products.map(p => `
                                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div class="relative w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 group">
                                            <img src="${p.image}" class="w-full h-full object-cover bg-white">
                                            ${p.hoverImage ? `<img src="${p.hoverImage}" class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white">` : ''}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center gap-2 mb-1">
                                                <p class="font-bold text-lg truncate">${p.name}</p>
                                                ${p.discount ? `<span class="px-2 py-0.5 mt-0.5 rounded text-[10px] bg-green-100 dark:bg-green-500/10 text-green-600 font-bold">-${p.discount}% OFF</span>` : ''}
                                            </div>
                                            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                                                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">sell</span> ${p.category}</span>
                                                <span class="font-bold text-slate-900 dark:text-white">${p.price}</span>
                                            </div>
                                            <p class="text-xs text-slate-400 mt-2 truncate">${p.description || 'No description provided'}</p>
                                        </div>
                                        <div class="flex items-center gap-2 mt-4 sm:mt-0">
                                            <button onclick='editProduct(${JSON.stringify(p).replace(/'/g, "&apos;")})' class="p-2 text-blue-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                                                <span class="material-symbols-outlined">edit</span>
                                            </button>
                                            <button onclick="deleteProduct('${p.id}')" class="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                                <span class="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        window.previewImage = (event, previewId, containerId, placeholderId, inputId) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById(previewId).src = e.target.result;
                    document.getElementById(containerId).classList.remove('hidden');
                    document.getElementById(placeholderId).classList.add('hidden');
                    document.getElementById(inputId).value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        window.resetProductForm = () => {
            const form = document.getElementById('add-product-form');
            if (form) form.reset();
            document.getElementById('productId').value = '';
            document.getElementById('primaryImageData').value = '';
            document.getElementById('hoverImageData').value = '';
            document.getElementById('productFormTitle').textContent = 'Create New Product';
            document.getElementById('imagePreviewContainer').classList.add('hidden');
            document.getElementById('imagePlaceholder').classList.remove('hidden');
            document.getElementById('hoverPreviewContainer').classList.add('hidden');
            document.getElementById('hoverPlaceholder').classList.remove('hidden');
            document.getElementById('productImage').value = '';
            document.getElementById('hoverImage').value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.editProduct = (p) => {
            const form = document.getElementById('add-product-form');
            if (!form) return;
            document.getElementById('productFormTitle').textContent = 'Edit Product';
            document.getElementById('productId').value = p.id;
            document.getElementById('productName').value = p.name || '';
            document.getElementById('productCategory').value = p.category || '';
            // Handle different price formats
            let displayPrice = String(p.price) || '';
            document.getElementById('productPrice').value = displayPrice.replace(/[^0-9.]/g, '');
            document.getElementById('productDesc').value = p.description || '';
            document.getElementById('productDiscount') ? document.getElementById('productDiscount').value = p.discount || '' : null;
            document.getElementById('primaryImageData').value = p.image || '';
            document.getElementById('hoverImageData').value = p.hoverImage || '';

            if (p.image && p.image !== 'https://via.placeholder.com/300x400?text=No+Image') {
                document.getElementById('imagePreview').src = p.image;
                document.getElementById('imagePreviewContainer').classList.remove('hidden');
                document.getElementById('imagePlaceholder').classList.add('hidden');
            } else {
                document.getElementById('imagePreviewContainer').classList.add('hidden');
                document.getElementById('imagePlaceholder').classList.remove('hidden');
            }

            if (p.hoverImage) {
                document.getElementById('hoverPreview').src = p.hoverImage;
                document.getElementById('hoverPreviewContainer').classList.remove('hidden');
                document.getElementById('hoverPlaceholder').classList.add('hidden');
            } else {
                document.getElementById('hoverPreviewContainer').classList.add('hidden');
                document.getElementById('hoverPlaceholder').classList.remove('hidden');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.deleteProduct = (id) => {
            if (confirm('Are you sure you want to delete this product?')) {
                let prods = JSON.parse(localStorage.getItem('stitch_products')) || [];
                prods = prods.filter(p => String(p.id) !== String(id));
                localStorage.setItem('stitch_products', JSON.stringify(prods));
                renderAdminSection('Products');
            }
        };

        const addForm = document.getElementById('add-product-form');
        if (addForm) {
            const newForm = addForm.cloneNode(true);
            addForm.parentNode.replaceChild(newForm, addForm);

            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(newForm);
                const p = Object.fromEntries(formData.entries());

                if (!p.image && !document.getElementById('productId').value) {
                    alert('Please provide a primary image.');
                    return;
                }

                const productId = p.id || 'PROD-' + Date.now();
                const product = {
                    id: productId,
                    name: p.name,
                    category: p.category,
                    price: '$' + parseFloat(p.price).toFixed(2),
                    description: p.description,
                    discount: p.discount || null,
                    image: p.image || 'https://via.placeholder.com/300x400?text=No+Image',
                    hoverImage: p.hoverImageBase64 || null
                };

                let products = JSON.parse(localStorage.getItem('stitch_products')) || [];

                if (p.id) {
                    const idx = products.findIndex(x => String(x.id) === String(p.id));
                    if (idx > -1) {
                        // Preserve original image if not updated
                        if (!p.image) product.image = products[idx].image;
                        if (!p.hoverImageBase64) product.hoverImage = products[idx].hoverImage;
                        products[idx] = { ...products[idx], ...product };
                    } else {
                        products.unshift(product);
                    }
                } else {
                    products.unshift(product);
                }

                localStorage.setItem('stitch_products', JSON.stringify(products));
                alert(p.id ? 'Product updated!' : 'Product added!');
                renderAdminSection('Products');
            });
        }
        return;
    }

    if (section === 'Categories') {
        const categories = JSON.parse(localStorage.getItem('stitch_categories')) || ['Apparel', 'Accessories', 'Home Decor', 'Footwear', 'Tech', 'Grooming', 'Knitwear', 'T-Shirts', 'Home', 'Dining'];
        contentArea.innerHTML = `
            <div class="space-y-8 pb-8">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 class="text-xl font-bold mb-6">Add New Category</h3>
                    <form id="add-category-form" class="flex gap-4">
                        <input name="categoryName" required class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" placeholder="e.g. Vintage Apparel">
                        <button type="submit" class="bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">Add</button>
                    </form>
                </div>

                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 class="text-lg font-bold">Manage Categories</h3>
                        <span class="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">${categories.length} categories</span>
                    </div>
                    <div class="divide-y divide-slate-100 dark:divide-slate-800">
                        ${categories.map((cat, idx) => `
                            <div class="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <span class="font-bold text-slate-900 dark:text-white">${cat}</span>
                                <button onclick="deleteCategory(${idx})" class="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        window.deleteCategory = (idx) => {
            if (confirm('Delete this category?')) {
                let cats = JSON.parse(localStorage.getItem('stitch_categories')) || [];
                cats.splice(idx, 1);
                localStorage.setItem('stitch_categories', JSON.stringify(cats));
                renderAdminSection('Categories');
            }
        };

        const catForm = document.getElementById('add-category-form');
        if (catForm) {
            catForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = catForm.querySelector('input').value.trim();
                if (name) {
                    let cats = JSON.parse(localStorage.getItem('stitch_categories')) || [];
                    if (!cats.includes(name)) {
                        cats.push(name);
                        localStorage.setItem('stitch_categories', JSON.stringify(cats));
                        renderAdminSection('Categories');
                    } else {
                        alert('Category already exists!');
                    }
                }
            });
        }
        return;
    }

    if (section === 'Orders') {
        const completedOrders = orders.filter(o => o.status === 'Completed' || !o.status?.includes('Abandoned'));
        const abandonedOrders = orders.filter(o => o.status === 'Abandoned');

        contentArea.innerHTML = `
            <div class="space-y-8 pb-8">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Manage Orders</h2>
                    <span class="text-sm text-slate-500">${completedOrders.length} completed, ${abandonedOrders.length} abandoned</span>
                </div>

                <!-- Completed Orders -->
                <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 class="text-lg font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-green-500">check_circle</span>
                            Completed Orders
                        </h3>
                    </div>
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th class="p-6">Order ID</th>
                                <th class="p-6">Customer</th>
                                <th class="p-6">Date</th>
                                <th class="p-6">Total</th>
                                <th class="p-6 text-right">Items</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                            ${completedOrders.length === 0 ? '<tr><td colspan="5" class="p-12 text-center text-slate-400">No completed orders yet.</td></tr>' :
                completedOrders.map(o => `
                                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td class="p-6 font-bold text-primary">${o.id}</td>
                                        <td class="p-6">
                                            <div class="font-bold text-slate-900 dark:text-white">${o.customer}</div>
                                            <div class="text-xs text-slate-500">${o.email}</div>
                                        </td>
                                        <td class="p-6 text-sm text-slate-500">${o.date}</td>
                                        <td class="p-6 font-bold text-slate-900 dark:text-white">$${o.amount}</td>
                                        <td class="p-6 text-right font-bold">${o.items?.length || 0}</td>
                                    </tr>
                                `).join('')
            }
                        </tbody>
                    </table>
                </div>

                <!-- Abandoned Orders -->
                <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm opacity-80 mt-8">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 class="text-lg font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-red-500">remove_shopping_cart</span>
                            Abandoned Carts
                        </h3>
                    </div>
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th class="p-6">Cart ID</th>
                                <th class="p-6">Customer</th>
                                <th class="p-6">Last Active</th>
                                <th class="p-6">Cart Value</th>
                                <th class="p-6 text-right">Items</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                            ${abandonedOrders.length === 0 ? '<tr><td colspan="5" class="p-12 text-center text-slate-400">No abandoned carts found.</td></tr>' :
                abandonedOrders.map(o => `
                                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td class="p-6 font-bold text-red-500">${o.id}</td>
                                        <td class="p-6">
                                            <div class="font-bold text-slate-900 dark:text-white">${o.customer}</div>
                                            <div class="text-xs text-slate-500">${o.email}</div>
                                        </td>
                                        <td class="p-6 text-sm text-slate-500">${o.date}</td>
                                        <td class="p-6 font-bold text-slate-900 dark:text-white">$${o.amount}</td>
                                        <td class="p-6 text-right font-bold">${o.items?.length || 0}</td>
                                    </tr>
                                `).join('')
            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        return;
    } else if (section === 'Customers') {
        let customers = JSON.parse(localStorage.getItem('stitch_customers')) || [];
        const orders = JSON.parse(localStorage.getItem('stitch_orders')) || [];

        // Segmentation logic
        const now = new Date();
        const segments = { New: 0, Active: 0, Dormant: 0 };

        customers = customers.map(c => {
            const regDate = c.registeredAt ? new Date(c.registeredAt) : new Date(); // Mock recent if missing
            const daysSinceReg = (now - regDate) / (1000 * 60 * 60 * 24);
            const customerOrders = orders.filter(o => o.email === c.email && o.status === 'Completed');

            let status = 'Active';
            let badgeClass = 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';

            if (daysSinceReg <= 7 && customerOrders.length === 0) {
                status = 'New';
                badgeClass = 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400';
            } else if (daysSinceReg > 30 && customerOrders.length === 0) {
                status = 'Dormant';
                badgeClass = 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
            } else {
                status = 'Active';
                badgeClass = 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400';
            }

            segments[status]++;
            return { ...c, status, badgeClass, orderCount: customerOrders.length };
        });

        contentArea.innerHTML = `
            <div class="space-y-6 pb-8">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Manage Customers</h2>
                    <span class="text-sm text-slate-500">${customers.length} total customers</span>
                </div>

                <!-- Segment Overview -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm text-slate-500">Active Customers</p>
                            <h3 class="text-2xl font-bold text-green-600 dark:text-green-400">${segments.Active}</h3>
                        </div>
                        <span class="material-symbols-outlined text-4xl text-green-500/20">how_to_reg</span>
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm text-slate-500">New (Last 7 Days)</p>
                            <h3 class="text-2xl font-bold text-purple-600 dark:text-purple-400">${segments.New}</h3>
                        </div>
                        <span class="material-symbols-outlined text-4xl text-purple-500/20">fiber_new</span>
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm text-slate-500">Dormant (30+ Days)</p>
                            <h3 class="text-2xl font-bold text-slate-600 dark:text-slate-400">${segments.Dormant}</h3>
                        </div>
                        <span class="material-symbols-outlined text-4xl text-slate-500/20">snooze</span>
                    </div>
                </div>

                <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th class="p-6">Customer Name</th>
                                <th class="p-6">Contact Information</th>
                                <th class="p-6">Registration Date</th>
                                <th class="p-6">Orders</th>
                                <th class="p-6">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                            ${customers.length === 0 ? '<tr><td colspan="5" class="p-12 text-center text-slate-400">No customers registered yet.</td></tr>' :
                customers.map(c => `
                                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td class="p-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                ${c.name.charAt(0).toUpperCase()}
                                            </div>
                                            ${c.name}
                                        </td>
                                        <td class="p-6">
                                            <div class="text-sm">${c.email}</div>
                                            <div class="text-xs text-slate-500">${c.phone || 'N/A'}</div>
                                        </td>
                                        <td class="p-6 text-sm text-slate-500">${c.registeredAt || 'Recent'}</td>
                                        <td class="p-6 font-bold">${c.orderCount}</td>
                                        <td class="p-6">
                                            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.badgeClass}">
                                                ${c.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')
            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (section === 'Settings') {
        contentArea.innerHTML = `
            <div class="space-y-8 pb-8">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-2xl font-bold">Store Settings & CRM Config</h2>
                        <p class="text-sm text-slate-500 mt-1">Manage your store operations and customer notification preferences.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- General Settings -->
                    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 class="text-lg font-bold flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">storefront</span>
                                General Store
                            </h3>
                        </div>
                        <div class="p-6 space-y-6">
                            <div class="space-y-2">
                                <label class="text-sm font-bold opacity-70">Store Name</label>
                                <input type="text" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" value="Stitch | Luxe Essentials">
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold opacity-70">Support Email</label>
                                <input type="email" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" value="support@stitchluxe.com">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-sm font-bold opacity-70">Currency</label>
                                    <select class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                    </select>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-bold opacity-70">Tax Rate (%)</label>
                                    <input type="number" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" value="8.5">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Notification Preferences -->
                    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 class="text-lg font-bold flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">notifications_active</span>
                                Email & Notifications
                            </h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div>
                                    <p class="font-bold text-sm">New Order Alerts</p>
                                    <p class="text-xs text-slate-500">Receive an email for every new order.</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" checked>
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div>
                                    <p class="font-bold text-sm">Abandoned Cart Recovery</p>
                                    <p class="text-xs text-slate-500">Automatically email users with abandoned carts after 24 hours.</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" checked>
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div>
                                    <p class="font-bold text-sm">Daily Summary Report</p>
                                    <p class="text-xs text-slate-500">Morning digest of store performance.</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button class="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors" onclick="alert('Settings saved successfully!')">
                        Save Changes
                    </button>
                </div>
            </div>
        `;
    }
}

window.deleteCustomProduct = (index) => {
    let products = JSON.parse(localStorage.getItem('stitch_custom_products')) || [];
    products.splice(index, 1);
    localStorage.setItem('stitch_custom_products', JSON.stringify(products));
    renderAdminSection('Products');
};

// --- Utilities ---

function ensureProductLinks() {
    document.addEventListener('click', (e) => {
        const productLink = e.target.closest('h3 a, .product-card-hover img');
        if (productLink && !productLink.closest('.add-to-cart-btn, .quick-add')) {
            // Browsers naturally handle <a> links, but we might need to programmatically navigate for images
            if (e.target.tagName === 'IMG') {
                window.location.href = 'product-detail.html';
            }
        }
    });
}

function initNewsletter() {
    const newsletterForms = document.querySelectorAll('form[onsubmit="event.preventDefault()"], .newsletter-form');
    newsletterForms.forEach(form => {
        const btn = form.querySelector('button');
        if (btn) {
            btn.addEventListener('click', () => {
                const email = form.querySelector('input[type="email"]');
                if (email && email.value) {
                    alert('Thank you for subscribing to our newsletter!');
                    email.value = '';
                }
            });
        }
    });
}

function initProducts() {
    const productsGrid = document.getElementById('products-grid');
    const featuredGrid = document.getElementById('featured-products-grid');
    const products = JSON.parse(localStorage.getItem('stitch_products')) || [];
    const categories = JSON.parse(localStorage.getItem('stitch_categories')) || ['Apparel', 'Accessories', 'Home Decor', 'Footwear', 'Tech', 'Grooming', 'Knitwear', 'T-Shirts', 'Home', 'Dining'];

    // Render Navbar Categories dynamically
    const navDropdowns = document.querySelectorAll('nav .group .absolute .py-2');
    navDropdowns.forEach(dropdown => {
        dropdown.innerHTML = categories.map(cat => `
            <a href="products.html?category=${encodeURIComponent(cat)}" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">${cat}</a>
        `).join('') + `
            <div class="border-t border-slate-100 dark:border-slate-800 my-1"></div>
            <a href="products.html" class="block px-4 py-2 text-sm font-bold text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Shop All</a>
        `;
    });

    // Render Sidebar Categories dynamically if elements exist
    const sidebarCategoryContainer = document.querySelector('aside .space-y-3');
    if (sidebarCategoryContainer) {
        sidebarCategoryContainer.innerHTML = `
            <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors bg-primary/10 border-l-2 border-primary">
                <input type="radio" name="category" class="hidden" checked>
                <div class="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary shrink-0">
                    <span class="material-symbols-outlined text-[14px] text-white opacity-0 peer-checked:opacity-100">check</span>
                </div>
                <span class="font-bold text-primary">All Products</span>
            </label>
        ` + categories.map(cat => `
            <label class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors cursor-pointer">
                <input type="radio" name="category" class="hidden">
                <div class="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary shrink-0">
                    <span class="material-symbols-outlined text-[14px] text-white opacity-0 peer-checked:opacity-100">check</span>
                </div>
                <span class="text-slate-600 dark:text-slate-400 font-medium">${cat}</span>
            </label>
        `).join('');
    }

    const renderProductCards = (container, productList) => {
        if (!container) return;
        if (productList.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-12 text-slate-500">No products found.</div>';
            return;
        }

        container.innerHTML = productList.map(p => `
            <div class="product-card group relative flex flex-col cursor-pointer" onclick="window.location.href='product-detail.html'">
                <div class="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 relative">
                    ${p.discount ? `<div class="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">-${p.discount}% OFF</div>` : ''}
                    <img src="${p.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-white">
                    ${p.hoverImage ? `<img src="${p.hoverImage}" class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white">` : ''}
                    <div class="add-to-cart absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-20">
                        <button class="w-full py-3 bg-white/95 backdrop-blur dark:bg-slate-900/95 text-slate-900 dark:text-white font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 add-to-cart-btn hover:bg-primary hover:text-white transition-colors">
                            <span class="material-symbols-outlined text-xl">shopping_cart</span> Add to Cart
                        </button>
                    </div>
                </div>
                <div class="mt-4 space-y-1">
                    <h3 class="text-slate-900 dark:text-white font-bold text-lg group-hover:text-primary transition-colors">${p.name}</h3>
                    <div class="flex items-center justify-between mt-2 flex-wrap gap-2">
                        <span class="font-bold text-lg text-slate-900 dark:text-white">${p.price}</span>
                        <span class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider hidden sm:block">${p.category}</span>
                    </div>
                </div>
            </div>
        `).join('');
    };

    // Filter Logic
    const searchInput = document.getElementById('search-input') || document.querySelector('input[placeholder*="Search"]');
    const categoryLabels = document.querySelectorAll('aside label');

    const applyFilters = () => {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const activeLabel = Array.from(categoryLabels).find(l => l.classList.contains('border-primary'));
        let activeCategory = 'all products';
        if (activeLabel) {
            const span = activeLabel.querySelector('span:last-child');
            if (span) activeCategory = span.textContent.toLowerCase();
        }

        let filtered = products;

        if (activeCategory !== 'all products') {
            filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory);
        }

        if (query) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        }

        if (productsGrid) renderProductCards(productsGrid, filtered);
    };

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    categoryLabels.forEach(label => {
        label.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT') return;

            categoryLabels.forEach(l => {
                l.classList.remove('bg-primary/10', 'border-l-2', 'border-primary');
                l.querySelector('span:last-child')?.classList.remove('text-primary', 'font-bold');
                l.querySelector('span:last-child')?.classList.add('text-slate-600', 'dark:text-slate-400');
                const radio = l.querySelector('input[type="radio"]');
                if (radio) radio.checked = false;
            });

            label.classList.add('bg-primary/10', 'border-l-2', 'border-primary');
            const span = label.querySelector('span:last-child');
            if (span) {
                span.classList.add('text-primary', 'font-bold');
                span.classList.remove('text-slate-600', 'dark:text-slate-400');
            }
            const radio = label.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            applyFilters();
        });
    });

    // Check query parameters for initial filtering
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    // Initial render
    let initialRenderDone = false;

    if (categoryParam && categoryLabels.length > 0) {
        const targetLabel = Array.from(categoryLabels).find(l => {
            const span = l.querySelector('span:last-child');
            return span && span.textContent.toLowerCase() === categoryParam.toLowerCase();
        });
        if (targetLabel) {
            targetLabel.click();
            initialRenderDone = true;
        }
    }

    if (!initialRenderDone) {
        if (featuredGrid) renderProductCards(featuredGrid, products.slice(0, 4));
        if (productsGrid) renderProductCards(productsGrid, products);
    }
}
