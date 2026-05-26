// Clean Delta Export JavaScript
document.addEventListener("DOMContentLoaded", function () {
    // Initialize AOS
    if (typeof AOS !== 'undefined' && AOS.init) {
        AOS.init({ duration: 1000, once: true });
    }

    // WhatsApp buttons (open in new tab)
    document.querySelectorAll(".whatsapp-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            window.open(this.href, "_blank");
        });
    });

    // Mobile menu (align with #navToggle and #navMenu in HTML)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Counter Animation for Statistics
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .stat-value');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // ~60fps
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Trigger counter animation when stats sections are visible
    const statsElements = document.querySelectorAll('.hero-stats, .stats-section');
    if (statsElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsElements.forEach(element => observer.observe(element));
    } else {
        // Fallback
        animateCounters();
    }

    // =========================
    // Product Search Functionality
    // =========================
    const productSearch = document.getElementById('productSearch');
    const clearSearch = document.getElementById('clearSearch');
    const searchInfo = document.getElementById('searchInfo');
    const customOrderNotice = document.getElementById('customOrderNotice');

    if (productSearch) {
        let searchTimeout;

        // Keyword mappings for each product type (synonyms)
        const productKeywords = {
            'turmeric': ['turmeric', 'turmeric powder', 'haldi'],
            'red chilli': ['red chilli', 'red chili', 'chilli', 'chili', 'red pepper', 'chilli powder', 'chili powder'],
            'cardamom': ['cardamom', 'green cardamom', 'elaichi'],
            'black pepper': ['black pepper', 'pepper', 'kali mirch'],
            'cumin': ['cumin', 'cumin seeds', 'jeera'],
            'coriander': ['coriander', 'coriander seeds', 'dhania'],
            'cloves': ['cloves', 'clove', 'laung'],
            'cinnamon': ['cinnamon', 'dalchini'],
            'ginger': ['dry ginger', 'ginger', 'sonth']
        };

        // Extract lowercase word tokens (alphabetic only)
        const getWords = (text) => (text || '').toLowerCase().match(/[a-z]+/g) || [];

        // Does any word begin with the given prefix?
        const anyWordStartsWith = (words, prefix) => {
            if (!prefix) return false;
            return words.some(w => w.startsWith(prefix));
        };

        // Map product name to a product type key for synonyms
        const getProductTypeFromName = (name) => {
            if (name.includes('turmeric')) return 'turmeric';
            if (name.includes('chilli') || name.includes('chili')) return 'red chilli';
            if (name.includes('cardamom')) return 'cardamom';
            if (name.includes('black pepper') || name.includes('pepper')) return 'black pepper';
            if (name.includes('cumin')) return 'cumin';
            if (name.includes('coriander')) return 'coriander';
            if (name.includes('cloves') || name.includes('clove')) return 'cloves';
            if (name.includes('cinnamon')) return 'cinnamon';
            if (name.includes('ginger')) return 'ginger';
            return null;
        };

        productSearch.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            const raw = this.value.trim().toLowerCase();

            // Show/hide clear button
            if (raw.length > 0) {
                clearSearch && clearSearch.classList.add('active');
            } else {
                clearSearch && clearSearch.classList.remove('active');
                hideCustomOrderNotice();
                clearSearchInfo();
                showAllProducts();
                return;
            }

            // Progressive prefix matching using the last token (e.g., "red ch")
            const tokens = getWords(raw);
            const query = tokens.length ? tokens[tokens.length - 1] : raw;

            // Debounce search
            searchTimeout = setTimeout(() => performSearch(query), 200);
        });

        clearSearch && clearSearch.addEventListener('click', function () {
            productSearch.value = '';
            clearSearch.classList.remove('active');
            hideCustomOrderNotice();
            clearSearchInfo();
            showAllProducts();
            productSearch.focus();
        });

        function performSearch(query) {
            const productCards = document.querySelectorAll('.product-detail-card');
            let foundMatch = false;
            let visibleCount = 0;

            productCards.forEach(card => {
                const productName = (card.querySelector('h3')?.textContent || '').toLowerCase();
                // We ignore description words to prevent false positives like 'hi' matching 'high' in text
                const nameWords = getWords(productName);

                // Rule 1: direct word-prefix match on product name only
                let shouldShow = anyWordStartsWith(nameWords, query);

                // Rule 2: synonym-prefix match mapped to the card's product type
                if (!shouldShow) {
                    const type = getProductTypeFromName(productName);
                    const synonyms = (type && productKeywords[type]) ? productKeywords[type] : [];
                    shouldShow = synonyms.some(s => anyWordStartsWith(getWords(s), query));
                }

                if (shouldShow) {
                    card.style.display = 'grid';
                    foundMatch = true;
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Update search info and notices
            if (foundMatch) {
                searchInfo && (searchInfo.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success);"></i> Found ${visibleCount} matching product${visibleCount !== 1 ? 's' : ''}`);
                hideCustomOrderNotice();
            } else {
                searchInfo && (searchInfo.innerHTML = `<i class=\"fas fa-search\" style=\"color: var(--text-light);\"></i> No products found for \"${query}\"`);
                showCustomOrderNotice();
            }
        }

        function showAllProducts() {
            const productCards = document.querySelectorAll('.product-detail-card');
            productCards.forEach(card => { card.style.display = 'grid'; });
        }

        function showCustomOrderNotice() {
            if (customOrderNotice) {
                customOrderNotice.style.display = 'block';
                if (typeof AOS !== 'undefined' && AOS.refresh) AOS.refresh();
            }
        }

        function hideCustomOrderNotice() {
            if (customOrderNotice) customOrderNotice.style.display = 'none';
        }

        function clearSearchInfo() {
            if (searchInfo) searchInfo.innerHTML = '';
        }
    }

    // =====================================
    // Interactive Bulk Quote Configurator
    // =====================================
    let currentStep = 1;
    let selectedCategory = '';
    let selectedProducts = [];

    // Product lists by category with specifications for dynamic loading
    const configuratorProducts = {
        spices: [
            { id: 'turmeric', name: 'Turmeric Powder', icon: 'fa-seedling', desc: 'Curcumin-rich, standard grade' },
            { id: 'chilli', name: 'Red Chilli Powder', icon: 'fa-pepper-hot', desc: 'Vibrant color, high pungency' },
            { id: 'cardamom', name: 'Green Cardamom', icon: 'fa-leaf', desc: 'Bold, highly aromatic pods' },
            { id: 'pepper', name: 'Black Pepper', icon: 'fa-circle-notch', desc: 'Bold flavor, premium quality' },
            { id: 'cumin', name: 'Cumin Seeds', icon: 'fa-fill-drip', desc: 'High oil content, pure grade' },
            { id: 'coriander', name: 'Coriander Seeds', icon: 'fa-compass', desc: 'Clean, aromatic seeds' },
            { id: 'cloves', name: 'Cloves', icon: 'fa-spa', desc: 'Vibrant, oil-rich cloves' }
        ],
        metal: [
            { id: 'copper_millberry', name: 'Copper Scrap (Millberry)', icon: 'fa-bolt', desc: '99.9% Purity, bare bright wire' },
            { id: 'copper_berry', name: 'Copper Scrap (Berry/Candy)', icon: 'fa-cubes', desc: 'Clean copper wire / tubing' },
            { id: 'aluminium_extrusion', name: 'Aluminium Extrusion (6063)', icon: 'fa-industry', desc: 'Clean sorted extrusion scrap' },
            { id: 'aluminium_ubc', name: 'Aluminium UBC', icon: 'fa-bottle-water', desc: 'Used Beverage Can scrap' },
            { id: 'brass_honey', name: 'Yellow Brass Scrap (Honey)', icon: 'fa-coins', desc: 'Clean yellow brass solids' }
        ]
    };

    // Category Select Handler
    window.selectCategory = function(category) {
        selectedCategory = category;
        selectedProducts = []; // reset products on category change
        
        // Highlight active category card
        const cards = document.querySelectorAll('#step-1 .option-card');
        cards.forEach(card => {
            if (card.getAttribute('data-value') === category) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Generate and inject Step 2 products dynamically
        const itemsGrid = document.getElementById('itemsGrid');
        if (itemsGrid) {
            itemsGrid.innerHTML = '';
            configuratorProducts[category].forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'option-card';
                productCard.setAttribute('data-id', product.id);
                productCard.innerHTML = `
                    <div class="card-icon"><i class="fas ${product.icon}"></i></div>
                    <h4>${product.name}</h4>
                    <p>${product.desc}</p>
                    <div class="select-indicator"><i class="fas fa-check"></i></div>
                `;
                productCard.addEventListener('click', () => toggleProduct(product.id, productCard));
                itemsGrid.appendChild(productCard);
            });
        }
        
        // Auto navigate to step 2 for better micro-UX after brief delay
        setTimeout(() => {
            window.navigateStep(1);
        }, 300);
    };

    // Toggle selected products in Step 2
    function toggleProduct(productId, element) {
        const index = selectedProducts.indexOf(productId);
        if (index > -1) {
            selectedProducts.splice(index, 1);
            element.classList.remove('selected');
        } else {
            selectedProducts.push(productId);
            element.classList.add('selected');
        }
    }

    // Step Navigation controller
    window.navigateStep = function(direction) {
        // Validation check before moving forward
        if (direction === 1) {
            if (currentStep === 1 && !selectedCategory) {
                alert('Please select a product category to proceed.');
                return;
            }
            if (currentStep === 2 && selectedProducts.length === 0) {
                alert('Please select at least one product to continue.');
                return;
            }
            if (currentStep === 3) {
                // Prepare Step 4 Summary details
                updateSummaryDetails();
            }
        }

        // Adjust step index
        currentStep += direction;
        if (currentStep < 1) currentStep = 1;
        if (currentStep > 4) currentStep = 4;

        // Render steps visibility
        const steps = document.querySelectorAll('.configurator-step');
        steps.forEach((step, idx) => {
            if (idx + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update active tracker circles
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, idx) => {
            const stepNum = idx + 1;
            if (stepNum === currentStep) {
                step.className = 'progress-step active';
            } else if (stepNum < currentStep) {
                step.className = 'progress-step completed';
            } else {
                step.className = 'progress-step';
            }
        });

        // Update progress line fill percentage
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const percent = ((currentStep - 1) / 3) * 100;
            progressFill.style.width = `${percent}%`;
        }

        // Adjust navigation button visibilities
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const btnSubmit = document.getElementById('btnSubmit');

        if (btnPrev && btnNext && btnSubmit) {
            if (currentStep === 1) {
                btnPrev.style.display = 'none';
            } else {
                btnPrev.style.display = 'inline-flex';
            }

            if (currentStep === 4) {
                btnNext.style.display = 'none';
                btnSubmit.style.display = 'inline-flex';
            } else {
                btnNext.style.display = 'inline-flex';
                btnSubmit.style.display = 'none';
            }
        }
    };

    // Sync input range slider and quantity text box
    const qtyInput = document.getElementById('qtyInput');
    const qtySlider = document.getElementById('qtySlider');

    if (qtyInput && qtySlider) {
        qtySlider.addEventListener('input', function() {
            qtyInput.value = this.value;
        });
        qtyInput.addEventListener('input', function() {
            let val = parseInt(this.value) || 1;
            if (val < 1) val = 1;
            if (val > 1000) val = 1000;
            qtySlider.value = val;
        });
    }

    // Populate the Review Summary Card
    function updateSummaryDetails() {
        const categoryBadge = document.getElementById('summaryCategoryBadge');
        const productsList = document.getElementById('summaryProductsList');
        const summaryQty = document.getElementById('summaryQty');
        const summaryPackaging = document.getElementById('summaryPackaging');
        const summaryDelivery = document.getElementById('summaryDelivery');

        if (categoryBadge) {
            categoryBadge.textContent = selectedCategory === 'spices' ? 'Premium Spices' : 'Metal Scrap';
            categoryBadge.style.background = selectedCategory === 'spices' ? 'var(--gradient)' : 'linear-gradient(135deg, #2c3e50, #7f8c8d)';
        }

        if (productsList) {
            // Map product IDs to clean names
            const names = selectedProducts.map(id => {
                const match = configuratorProducts[selectedCategory].find(p => p.id === id);
                return match ? match.name : id;
            });
            productsList.textContent = names.join(', ');
        }

        if (summaryQty && qtyInput) {
            summaryQty.textContent = `${qtyInput.value} Metric Tons (MT)`;
        }

        if (summaryPackaging) {
            const packagingPref = document.getElementById('packagingPref');
            summaryPackaging.textContent = packagingPref ? packagingPref.value : 'Standard Export Bagging';
        }

        if (summaryDelivery) {
            const deliveryTerms = document.getElementById('deliveryTerms');
            summaryDelivery.textContent = deliveryTerms ? deliveryTerms.value : 'FOB';
        }
    }

    // Submit inquiry through WhatsApp
    window.submitInquiry = function() {
        const buyerName = document.getElementById('buyerName')?.value.trim();
        const buyerEmail = document.getElementById('buyerEmail')?.value.trim();
        const buyerPhone = document.getElementById('buyerPhone')?.value.trim();
        const buyerCountry = document.getElementById('buyerCountry')?.value.trim();
        const buyerNotes = document.getElementById('buyerNotes')?.value.trim();

        if (!buyerName || !buyerEmail || !buyerPhone || !buyerCountry) {
            alert('Please fill out all required fields marked with * to submit your inquiry.');
            return;
        }

        const mappedProducts = selectedProducts.map(id => {
            const match = configuratorProducts[selectedCategory].find(p => p.id === id);
            return match ? match.name : id;
        }).join(', ');

        const packaging = document.getElementById('packagingPref')?.value || 'Standard';
        const delivery = document.getElementById('deliveryTerms')?.value || 'FOB';
        const quantity = qtyInput ? qtyInput.value : '10';

        // Format a highly professional message for the exporter
        let message = `*NEW BULK EXPORT INQUIRY - DELTA EXPORT*\n`;
        message += `---------------------------------------\n`;
        message += `*Category:* ${selectedCategory === 'spices' ? 'Premium Spices' : 'Metal Scrap'}\n`;
        message += `*Products:* ${mappedProducts}\n`;
        message += `*Target Volume:* ${quantity} MT (Metric Tons)\n`;
        message += `*Packaging:* ${packaging}\n`;
        message += `*INCOTERMS:* ${delivery}\n`;
        message += `---------------------------------------\n`;
        message += `*BUYER INFORMATION*\n`;
        message += `*Name/Company:* ${buyerName}\n`;
        message += `*Email:* ${buyerEmail}\n`;
        message += `*Phone:* ${buyerPhone}\n`;
        message += `*Destination Country:* ${buyerCountry}\n`;
        if (buyerNotes) {
            message += `*Additional Notes/Specs:* ${buyerNotes}\n`;
        }

        // WhatsApp number of exporter is +919662679966 (from index.html)
        const whatsappNumber = "919662679966";
        const encodedText = encodeURIComponent(message);
        const url = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
        
        window.open(url, '_blank');
    };
});

console.log("Delta Export loaded successfully!");
