
        // --- Translations ---
        const translations = {
            en: {
                appName: "Food Expiry Tracker",
                dashboard: "Dashboard",
                addItem: "Add Item Manually",
                settings: "Settings",
                language: "Language",
                english: "English",
                kinyarwanda: "Kinyarwanda",
                barcode: "Barcode",
                productName: "Product Name",
                brand: "Brand",
                category: "Category",
                expiryDate: "Expiry Date",
                save: "Save",
                cancel: "Cancel",
                edit: "Edit",
                delete: "Delete",
                markConsumed: "Mark Consumed",
                noItems: "No food items tracked yet. Add manually!",
                expiringSoon: "Expiring Soon",
                expired: "Expired",
                daysLeft: "days left",
                today: "Today",
                yesterday: "Yesterday",
                tomorrow: "Tomorrow",
                addReminder: "Set Reminder",
                reminderInfo: "In a real application, this would trigger an SMS/Email reminder via a backend service like Twilio.",
                reminderSetSuccess: "Reminder set for this item!",
                unsetReminderConfirmed: "Reminder unset for this item!",
                reminderTriggered: "Reminder: '{itemName}' is expiring {daysLeft}!",
                confirmDelete: "Are you sure you want to delete this item?",
                itemAdded: "Item added successfully!",
                itemUpdated: "Item updated successfully!",
                itemDeleted: "Item deleted successfully!",
                itemMarkedConsumed: "Item marked as consumed!",
                errorFetching: "Error fetching product details:",
                errorSaving: "Error saving item:",
                errorLoading: "Error loading items:",
                loading: "Loading...",
                userId: "Your User ID:",
                offlineMode: "Offline Mode: Cannot fetch product details, please add manually.",
                unsetReminder: "Unset Reminder",
                productFound: "Product details found!",
                productNotFound: "Product not found. Please enter details manually.",
                fetchProductDetails: "Look up Barcode",
                authFailed: "Authentication failed. Please try again or contact support.",
                // Updated translation key for product search section
                searchProductsSection: "Search Products (Global)",
                searchTerm: "Search Term",
                searchProductsBtn: "Search Products",
                noProductsFound: "No products found.",
                selectThisProduct: "Select this product",
                errorSearching: "Error searching products:",
            },
            rw: {
                appName: "Ubwugamo bw'Ibiribwa",
                dashboard: "Irangiro",
                addItem: "Ongeramo Intoki",
                settings: "Amasetingi",
                language: "Ururimi",
                english: "Icyongereza",
                kinyarwanda: "Ikinyarwanda",
                barcode: "Barcode",
                productName: "Izina ry'Igicuruzwa",
                brand: "Ikigo Cyakozweho",
                category: "Icyiciro",
                expiryDate: "Itariki Kirangiriraho",
                save: "Bika",
                cancel: "Hagarika",
                edit: "Hindura",
                delete: "Siba",
                markConsumed: "Shyiraho ko Byakoreshejwe",
                noItems: "Nta biribwa birimo. Ongeramo intoki!",
                expiringSoon: "Bigiye Kurangira",
                expired: "Byarangiye",
                daysLeft: "iminsi isigaye",
                today: "Uyu Munsi",
                yesterday: "Ejo Hashize",
                tomorrow: "Ejo Hazaza",
                addReminder: "Shyiraho Icyibutso",
                reminderInfo: "Muri porogaramu nyayo, ibi byatuma SMS/Icyibutso cy'Imeri kinyura kuri serivisi nka Twilio.",
                reminderSetSuccess: "Icyibutso cyashyizweho kuri iki kintu!",
                unsetReminderConfirmed: "Icyibutso cyakuweho kuri iki kintu!",
                reminderTriggered: "Icyibutso: '{itemName}' irangira {daysLeft}!",
                confirmDelete: "Uzi neza ko ushaka gusiba iki kintu?",
                itemAdded: "Ikintu cyongeyemo neza!",
                itemUpdated: "Ikintu cyahinduwe neza!",
                itemDeleted: "Ikintu cyasibwe neza!",
                itemMarkedConsumed: "Ikintu cyashyizweho ko cyakoreshejwe!",
                errorFetching: "Ikosa mu kwinjiza amakuru y'igicuruzwa:",
                errorSaving: "Ikosa mu kubika ikintu:",
                errorLoading: "Ikosa mu kwinjiza ibintu:",
                loading: "Turimo Kwinjiza...",
                userId: "Nimero y'Umukoresha:",
                offlineMode: "Modo ya Offline: Ntabwo bishoboka kubona amakuru y'igicuruzwa, nyamuneka ongeramo intoki.",
                unsetReminder: "Kura Icyibutso",
                productFound: "Amakuru y'igicuruzwa yabonetse!",
                productNotFound: "Igicuruzwa ntabwo cyabonetse. Nyamuneka andikamo amakuru wenyine.",
                fetchProductDetails: "Reba Barcode",
                authFailed: "Kwinjira byanze. Nyamuneka ongera ugerageze cyangwa uhamagare ubufasha.",
                // Updated translation key for product search section
                searchProductsSection: "Shakisha Ibiribwa (Rusange)",
                searchTerm: "Ijambo ryo Gushakisha",
                searchProductsBtn: "Shakisha Ibiribwa",
                noProductsFound: "Nta biribwa byabonetse.",
                selectThisProduct: "Hitamo Iki Kiribwa",
                errorSearching: "Ikosa mu gushakisha ibiribwa:",
            }
        };

        // --- Global State Management ---
        const appState = {
            currentPage: 'dashboard',
            foodItems: [],
            loading: true, // Initial loading state
            error: null,
            userId: localStorage.getItem('foodTrackerUserId') || crypto.randomUUID(),
            isAuthReady: true, // Always true for this client-side demo
            scannedProduct: null,
            editingItem: null,
            message: { text: '', type: '' },
            itemToDelete: null,
            searchResults: [], // To store product search results temporarily
        };

        // Load language from localStorage and validate immediately
        let storedLanguage = localStorage.getItem('foodTrackerLanguage');
        if (storedLanguage && translations[storedLanguage]) {
            appState.currentLanguage = storedLanguage;
        } else {
            appState.currentLanguage = 'en'; // Default to English if stored value is invalid or null
            localStorage.setItem('foodTrackerLanguage', 'en'); // Persist the default
        }

        // Save the generated userId to localStorage if it's new
        if (!localStorage.getItem('foodTrackerUserId')) {
            localStorage.setItem('foodTrackerUserId', appState.userId);
        }

        // --- DOM Element References ---
        const elements = {
            appTitle: document.getElementById('app-title'),
            dashboardBtn: document.getElementById('dashboard-btn'),
            addItemBtn: document.getElementById('add-item-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            mainContent: document.getElementById('main-content'),
            messageDisplay: document.getElementById('message-display'),
            pageContent: document.getElementById('page-content'),
            confirmationModal: document.getElementById('confirmation-modal'),
            modalMessage: document.getElementById('modal-message'),
            modalCancelBtn: document.getElementById('modal-cancel-btn'),
            modalConfirmBtn: document.getElementById('modal-confirm-btn'),
            currentYear: document.getElementById('current-year'),
            footerAppName: document.getElementById('footer-app-name'),
        };

        // --- Translation Helper ---
        const t = (key) => translations[appState.currentLanguage][key] || key;

        // --- UI Feedback Functions ---
        function showMessage(msg, type = 'success') {
            appState.message = { text: msg, type };
            elements.messageDisplay.textContent = msg;
            elements.messageDisplay.className = `message-box ${type}`;
            elements.messageDisplay.classList.remove('hidden');
            setTimeout(() => {
                appState.message = { text: '', type: '' };
                elements.messageDisplay.classList.add('hidden');
            }, 3000);
        }

        function updateUIForLanguage() {
            elements.appTitle.textContent = t('appName');
            elements.dashboardBtn.textContent = t('dashboard');
            elements.addItemBtn.textContent = t('addItem');
            elements.settingsBtn.textContent = t('settings');
            elements.footerAppName.textContent = t('appName');
            elements.modalCancelBtn.textContent = t('cancel');
            elements.modalConfirmBtn.textContent = t('delete');
            elements.currentYear.textContent = new Date().getFullYear();

            // Re-render current page to apply new language to dynamic content
            renderPage();
        }

        // --- LocalStorage API Functions (No Backend) ---
        // These functions replace the fetch calls to the Node.js backend
        // and store/retrieve data directly in the browser's localStorage.

        async function apiFetchFoodItems() {
            // Simulate a small delay to mimic an API call
            await new Promise(resolve => setTimeout(resolve, 100));
            const storedItems = localStorage.getItem(`foodItems_${appState.userId}`);
            return storedItems ? JSON.parse(storedItems) : [];
        }

        async function apiSaveFoodItem(item) {
            // Simulate a small delay
            await new Promise(resolve => setTimeout(resolve, 100));
            let currentItems = JSON.parse(localStorage.getItem(`foodItems_${appState.userId}`) || '[]');
            if (item.id) {
                // Update existing item
                const index = currentItems.findIndex(i => i.id === item.id);
                if (index !== -1) {
                    currentItems[index] = item;
                }
            } else {
                // Add new item
                item.id = crypto.randomUUID(); // Generate a unique ID for new items
                currentItems.push(item);
            }
            localStorage.setItem(`foodItems_${appState.userId}`, JSON.stringify(currentItems));
            return item; // Return the saved item (with ID if new)
        }

        async function apiDeleteFoodItem(id) {
            // Simulate a small delay
            await new Promise(resolve => setTimeout(resolve, 100));
            let currentItems = JSON.parse(localStorage.getItem(`foodItems_${appState.userId}`) || '[]');
            currentItems = currentItems.filter(item => item.id !== id);
            localStorage.setItem(`foodItems_${appState.userId}`, JSON.stringify(currentItems));
            return { success: true };
        }

        // --- Data Loading and Persistence (using LocalStorage API) ---
        async function loadFoodItems() {
            appState.loading = true;
            try {
                const items = await apiFetchFoodItems();
                appState.foodItems = items.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
                appState.error = null;
            } catch (err) {
                console.error("Error loading food items:", err);
                appState.error = t('errorLoading') + err.message;
            } finally {
                appState.loading = false;
                renderPage(); // Always re-render after loading attempt
                checkReminders();
            }
        }

        // --- Reminder Logic ---
        function checkReminders() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            appState.foodItems.forEach(item => {
                const expiry = new Date(item.expiryDate);
                expiry.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                if (item.reminderSet && diffDays >= 0 && diffDays <= 2) {
                    const daysLeftText = diffDays === 0 ? t('today') : diffDays === 1 ? t('tomorrow') : `${diffDays} ${t('daysLeft')}`;
                    showMessage(t('reminderTriggered').replace('{itemName}', item.name).replace('{daysLeft}', daysLeftText), 'info');
                }
            });
        }

        // --- OpenFoodFacts API Integration (for manual barcode entry lookup) ---
        async function fetchProductDetails(barcode) {
            if (!barcode) return;
            appState.loading = true;
            renderPage(); // Show loading indicator

            try {
                const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.status === 1 && data.product) {
                    const product = data.product;
                    const newProductData = {
                        barcode: product.code || barcode, // Use product.code if available, else original barcode
                        name: product.product_name || product.generic_name || '',
                        brand: product.brands || '',
                        category: product.categories || '',
                        expiryDate: '', // User must enter
                        reminderSet: false,
                        userId: appState.userId // Associate with current user
                    };
                    appState.scannedProduct = newProductData;
                    showMessage(t('productFound'), 'success');
                } else {
                    const newProductData = {
                        barcode: barcode,
                        name: '', brand: '', category: '', expiryDate: '', reminderSet: false,
                        userId: appState.userId // Associate with current user
                    };
                    appState.scannedProduct = newProductData;
                    showMessage(t('productNotFound'), 'warning');
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
                appState.error = t('errorFetching') + (err.message || String(err)) + ". " + t('offlineMode');
                const newProductData = {
                    barcode: barcode,
                    name: '', brand: '', category: '', expiryDate: '', reminderSet: false,
                    userId: appState.userId // Associate with current user
                };
                appState.scannedProduct = newProductData;
            } finally {
                appState.loading = false;
                renderPage(); // Re-render to show updated form or error
            }
        }

        // --- OpenFoodFacts Product Search by Name (Global) ---
        async function apiSearchProducts(query) {
            let url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1`;
            console.log("Searching OpenFoodFacts URL (Global):", url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }

        async function handleProductSearch() {
            const searchQueryInput = document.getElementById('searchQuery');
            const searchResultsDiv = document.getElementById('search-results');

            const query = searchQueryInput.value.trim();

            if (!query) {
                showMessage("Please enter a search term.", "warning");
                searchResultsDiv.innerHTML = ''; // Clear previous results/loading
                return;
            }

            searchResultsDiv.innerHTML = `<p class="text-center text-indigo-600">${t('loading')}</p>`; // Show loading

            try {
                const data = await apiSearchProducts(query);
                if (data.products && data.products.length > 0) {
                    appState.searchResults = data.products; // Store raw results for easy lookup by index
                    searchResultsDiv.innerHTML = data.products.map((product, index) => {
                        const productName = product.product_name || product.generic_name || 'Unknown Product';
                        const brand = product.brands || 'Unknown Brand';
                        const category = product.categories || 'Unknown Category';
                        // Ensure product data is properly escaped for data-product attribute
                        const productJson = JSON.stringify(product).replace(/"/g, '&quot;');
                        return `
                            <div class="product-search-result-card">
                                <div>
                                    <p class="product-search-name">${productName}</p>
                                    <p class="product-search-details">${brand} - ${category}</p>
                                </div>
                                <button class="button button-green button-small" data-action="select-searched-product" data-product='${productJson}'>
                                    ${t('selectThisProduct')}
                                </button>
                            </div>
                        `;
                    }).join('');

                    // Attach event listener to the parent container searchResultsDiv using event delegation
                    // Ensure this listener is only added once
                    if (!searchResultsDiv.dataset.listenerAttached) {
                        searchResultsDiv.addEventListener('click', (event) => {
                            const targetButton = event.target.closest('button[data-action="select-searched-product"]');
                            if (targetButton) {
                                const productData = JSON.parse(targetButton.dataset.product.replace(/&quot;/g, '"'));
                                selectSearchedProduct(productData);
                            }
                        });
                        searchResultsDiv.dataset.listenerAttached = 'true'; // Mark listener as attached
                    }

                } else {
                    appState.searchResults = []; // Clear results if none found
                    searchResultsDiv.innerHTML = `<p class="text-center text-gray-600">${t('noProductsFound')}</p>`;
                }
            } catch (error) {
                console.error(t('errorSearching'), error);
                searchResultsDiv.innerHTML = `<div class="message-box warning">${t('errorSearching')} ${error.message}</div>`;
            }
        }

        function selectSearchedProduct(product) {
            document.getElementById('barcode').value = product.code || ''; // OpenFoodFacts uses 'code' for barcode
            document.getElementById('productName').value = product.product_name || product.generic_name || '';
            document.getElementById('brand').value = product.brands || '';
            document.getElementById('category').value = product.categories || '';
            // Expiry date is intentionally left blank as it's not available from OpenFoodFacts search results
            showMessage("Product details pre-filled. Please add expiry date!", "info");
            // Clear search results after selection
            document.getElementById('search-results').innerHTML = '';
            appState.searchResults = [];
        }

        // --- Item Management Functions (using LocalStorage API) ---
        async function handleSaveItem(itemData) {
            appState.loading = true;
            renderPage(); // Show loading indicator

            try {
                itemData.userId = appState.userId; // Ensure userId is always attached to the item
                await apiSaveFoodItem(itemData);
                showMessage(itemData.id ? t('itemUpdated') : t('itemAdded'), 'success');

                appState.scannedProduct = null;
                appState.editingItem = null;
                appState.currentPage = 'dashboard';
                await loadFoodItems(); // Reload data after save
            } catch (err) {
                console.error("Error saving item:", err);
                appState.error = t('errorSaving') + err.message;
            } finally {
                appState.loading = false;
                renderPage(); // Ensure UI reflects final state
            }
        }

        function confirmDeleteItem(item) {
            appState.itemToDelete = item;
            elements.modalMessage.textContent = t('confirmDelete');
            elements.confirmationModal.classList.remove('hidden');
        }

        async function handleDeleteItem() {
            elements.confirmationModal.classList.add('hidden');
            if (!appState.itemToDelete) {
                showMessage("No item selected for deletion.", "warning");
                return;
            }

            appState.loading = true;
            renderPage(); // Show loading indicator

            try {
                await apiDeleteFoodItem(appState.itemToDelete.id);
                showMessage(t('itemDeleted'), 'success');
                appState.itemToDelete = null;
                await loadFoodItems(); // Reload data after delete
            } catch (err) {
                console.error("Error deleting item:", err);
                appState.error = t('errorSaving') + err.message;
            } finally {
                appState.loading = false;
                renderPage(); // Ensure UI reflects final state
            }
        }

        async function handleMarkConsumed(id) {
            appState.loading = true;
            renderPage(); // Show loading indicator

            try {
                await apiDeleteFoodItem(id); // Simulate deletion from active list
                showMessage(t('itemMarkedConsumed'), 'success');
                await loadFoodItems(); // Reload data after marking consumed
            } catch (err) {
                console.error("Error marking item as consumed:", err);
                appState.error = t('errorSaving') + err.message;
            } finally {
                appState.loading = false;
                renderPage(); // Ensure UI reflects final state
            }
        }

        async function handleSetReminder(itemToUpdate) {
            appState.loading = true;
            renderPage(); // Show loading indicator

            try {
                const updatedItem = { ...itemToUpdate, reminderSet: !itemToUpdate.reminderSet };
                await apiSaveFoodItem(updatedItem); // Use save to update the reminder status
                const messageKey = updatedItem.reminderSet ? 'reminderSetSuccess' : 'unsetReminderConfirmed';
                showMessage(t(messageKey), 'success');
                await loadFoodItems(); // Reload data to reflect updated reminder status
            } catch (err) {
                console.error("Error setting reminder:", err);
                appState.error = t('errorSaving') + err.message;
            } finally {
                appState.loading = false;
                renderPage(); // Ensure UI reflects final state
            }
        }

        function handleEditItem(itemId) {
            const itemToEdit = appState.foodItems.find(item => item.id === itemId);
            if (itemToEdit) {
                appState.editingItem = { ...itemToEdit };
                appState.currentPage = 'add';
                renderPage();
            } else {
                showMessage("Item not found for editing.", "warning");
            }
        }

        // --- Date Helper Functions ---
        function getDaysLeft(expiryDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiry = new Date(expiryDate);
            expiry.setHours(0, 0, 0, 0);

            const diffTime = expiry.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return t('today');
            if (diffDays === 1) return t('tomorrow');
            if (diffDays < 0) return `${Math.abs(diffDays)} ${t('expired')}`;
            return `${diffDays} ${t('daysLeft')}`;
        }

        function getExpiryStatusClass(expiryDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiry = new Date(expiryDate);
            expiry.setHours(0, 0, 0, 0);

            const diffTime = expiry.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return 'card-red';
            if (diffDays <= 7) return 'card-yellow';
            return 'card-green';
        }

        function getTodayDateString() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // --- Page Render Functions ---
        function renderDashboard() {
            const itemsToDisplay = appState.foodItems.filter(item => !item.consumed);

            elements.pageContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-6 text-gray-800">${t('dashboard')}</h2>
                ${appState.loading ? `<p class="text-center text-indigo-600">${t('loading')}</p>` : ''}
                ${appState.error ? `<div class="message-box warning">${appState.error}</div>` : ''}
                <div id="food-items-list">
                    ${itemsToDisplay.length === 0 && !appState.loading ? `<p class="text-center col-span-full text-gray-600">${t('noItems')}</p>` : ''}
                    ${itemsToDisplay.map(item => `
                        <div class="card ${getExpiryStatusClass(item.expiryDate)}">
                            <h3 class="text-xl font-semibold mb-2">${item.name || 'N/A'}</h3>
                            <p class="text-sm mb-1"><strong>${t('brand')}:</strong> ${item.brand || 'N/A'}</p>
                            <p class="text-sm mb-1"><strong>${t('category')}:</strong> ${item.category || 'N/A'}</p>
                            <p class="text-sm mb-4"><strong>${t('expiryDate')}:</strong> ${item.expiryDate} (${getDaysLeft(item.expiryDate)})</p>
                            <div class="button-group">
                                <button class="button button-blue button-small" data-action="edit" data-item-id="${item.id}">${t('edit')}</button>
                                <button class="button button-red button-small" data-action="delete" data-item='${JSON.stringify(item).replace(/"/g, '&quot;')}'>${t('delete')}</button>
                                <button class="button button-green button-small" data-action="consume" data-item-id="${item.id}">${t('markConsumed')}</button>
                                <button class="button button-purple button-small" data-action="reminder" data-item='${JSON.stringify(item).replace(/"/g, '&quot;')}'>
                                    ${item.reminderSet ? t('unsetReminder') : t('addReminder')}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            // Attach event listener to the parent container using event delegation
            const foodItemsList = document.getElementById('food-items-list');
            if (foodItemsList) {
                foodItemsList.addEventListener('click', (event) => {
                    const targetButton = event.target.closest('button[data-action]');
                    if (targetButton) {
                        const action = targetButton.dataset.action;
                        const itemId = targetButton.dataset.itemId;
                        const itemData = targetButton.dataset.item ? JSON.parse(targetButton.dataset.item.replace(/&quot;/g, '"')) : null; // Handle escaped quotes

                        switch (action) {
                            case 'edit':
                                handleEditItem(itemId);
                                break;
                            case 'delete':
                                confirmDeleteItem(itemData);
                                break;
                            case 'consume':
                                handleMarkConsumed(itemId);
                                break;
                            case 'reminder':
                                handleSetReminder(itemData);
                                break;
                        }
                    }
                });
            }
        }

        function renderAddItem() {
            const isEditing = appState.editingItem !== null;
            const item = appState.editingItem || appState.scannedProduct || { barcode: '', name: '', brand: '', category: '', expiryDate: '', reminderSet: false };

            elements.pageContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-6 text-gray-800">${isEditing ? t('edit') + ' ' + t('productName') : t('addItem')}</h2>
                ${appState.error ? `<div class="message-box warning">${appState.error}</div>` : ''}
                <div class="card"> <!-- Removed p-6 here, as form itself has padding -->
                    <form id="add-item-form" class="space-y-4">
                        <div class="form-group">
                            <label for="barcode">${t('barcode')}</label>
                            <input type="text" id="barcode" name="barcode" class="form-input" value="${item.barcode}" placeholder="${t('barcode')}" ${isEditing ? 'readonly' : ''}>
                            <button type="button" id="lookup-barcode-btn" class="button button-blue mt-2">${t('fetchProductDetails')}</button>
                        </div>
                        <div class="form-group">
                            <label for="productName">${t('productName')}</label>
                            <input type="text" id="productName" name="productName" class="form-input" value="${item.name}" required placeholder="${t('productName')}">
                        </div>
                        <div class="form-group">
                            <label for="brand">${t('brand')}</label>
                            <input type="text" id="brand" name="brand" class="form-input" value="${item.brand}" placeholder="${t('brand')}">
                        </div>
                        <div class="form-group">
                            <label for="category">${t('category')}</label>
                            <input type="text" id="category" name="category" class="form-input" value="${item.category}" placeholder="${t('category')}">
                        </div>
                        <div class="form-group">
                            <label for="expiryDate">${t('expiryDate')}</label>
                            <input type="date" id="expiryDate" name="expiryDate" class="form-input" value="${item.expiryDate}" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="cancel-add-btn" class="button button-gray">${t('cancel')}</button>
                            <button type="submit" class="button button-green">${t('save')}</button>
                        </div>
                    </form>
                </div>

                <!-- Global Search Products Section -->
                <div class="card mt-6"> <!-- Removed p-6 here, as form itself has padding -->
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">${t('searchProductsSection')}</h3>
                    <div id="search-section-content" class="space-y-4"> <!-- Added ID for specific styling -->
                        <div class="form-group">
                            <label for="searchQuery">${t('searchTerm')}</label>
                            <input type="text" id="searchQuery" class="form-input" placeholder="${t('searchTerm')}">
                        </div>
                        <button type="button" id="search-products-btn" class="button button-blue">${t('searchProductsBtn')}</button>
                        <div id="search-results" class="mt-4 product-search-results-list">
                            <!-- Search results will be displayed here -->
                        </div>
                    </div>
                </div>
            `;

            const expiryDateInput = document.getElementById('expiryDate');
            if (expiryDateInput) {
                expiryDateInput.min = getTodayDateString();
            }

            document.getElementById('add-item-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newItem = {
                    id: item.id,
                    barcode: formData.get('barcode'),
                    name: formData.get('productName'),
                    brand: formData.get('brand'),
                    category: formData.get('category'),
                    expiryDate: formData.get('expiryDate'),
                    reminderSet: item.reminderSet || false,
                    consumed: item.consumed || false,
                };
                handleSaveItem(newItem);
            });

            document.getElementById('cancel-add-btn').addEventListener('click', () => {
                appState.scannedProduct = null;
                appState.editingItem = null;
                appState.currentPage = 'dashboard';
                renderPage();
            });

            document.getElementById('lookup-barcode-btn').addEventListener('click', () => {
                const barcode = document.getElementById('barcode').value;
                if (barcode) {
                    fetchProductDetails(barcode);
                } else {
                    showMessage("Please enter a barcode to look up.", "warning");
                }
            });

            // Add event listener for the product search button
            const searchProductsButton = document.getElementById('search-products-btn');
            if (searchProductsButton) {
                searchProductsButton.addEventListener('click', handleProductSearch);
            }

            if (appState.loading) {
                showMessage(t('loading'), 'info');
            }
        }

        function renderSettings() {
            elements.pageContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-6 text-gray-800">${t('settings')}</h2>
                <div class="card p-6">
                    <div class="form-group mb-4">
                        <label for="language-select">${t('language')}</label>
                        <select id="language-select" class="form-input">
                            <option value="en" ${appState.currentLanguage === 'en' ? 'selected' : ''}>${t('english')}</option>
                            <option value="rw" ${appState.currentLanguage === 'rw' ? 'selected' : ''}>${t('kinyarwanda')}</option>
                        </select>
                    </div>
                    <div class="form-group mb-4">
                        <p class="text-sm font-medium text-gray-700 mb-1">${t('userId')}</p>
                        <p class="user-id-display">${appState.userId || 'Not available'}</p>
                    </div>
                </div>
            `;
            document.getElementById('language-select').addEventListener('change', (e) => {
                appState.currentLanguage = e.target.value;
                localStorage.setItem('foodTrackerLanguage', appState.currentLanguage);
                updateUIForLanguage();
            });
        }

        // --- Main Render Function (Controls Page Display) ---
        function renderPage() {
            elements.pageContent.innerHTML = '';
            elements.messageDisplay.classList.add('hidden');

            elements.dashboardBtn.classList.remove('active');
            elements.addItemBtn.classList.remove('active');
            elements.settingsBtn.classList.remove('active');

            switch (appState.currentPage) {
                case 'dashboard':
                    renderDashboard();
                    elements.dashboardBtn.classList.add('active');
                    break;
                case 'add':
                    renderAddItem();
                    elements.addItemBtn.classList.add('active');
                    break;
                case 'settings':
                    renderSettings();
                    elements.settingsBtn.classList.add('active');
                    break;
                default:
                    appState.currentPage = 'dashboard'; // Default to dashboard
                    renderDashboard();
                    elements.dashboardBtn.classList.add('active');
            }

            if (appState.message.text) {
                elements.messageDisplay.textContent = appState.message.text;
                elements.messageDisplay.className = `message-box ${appState.message.type}`;
                elements.messageDisplay.classList.remove('hidden');
            }
        }

        // --- Global Event Listeners (for navigation and modals) ---
        elements.dashboardBtn.addEventListener('click', () => {
            appState.currentPage = 'dashboard';
            appState.error = null;
            appState.scannedProduct = null;
            appState.editingItem = null;
            loadFoodItems(); // Re-load data when navigating to dashboard
        });

        elements.addItemBtn.addEventListener('click', () => {
            appState.currentPage = 'add';
            appState.error = null;
            appState.scannedProduct = null;
            appState.editingItem = null;
            renderPage();
        });

        elements.settingsBtn.addEventListener('click', () => {
            appState.currentPage = 'settings';
            appState.error = null;
            appState.scannedProduct = null;
            appState.editingItem = null;
            renderPage();
        });

        elements.modalCancelBtn.addEventListener('click', () => {
            elements.confirmationModal.classList.add('hidden');
            appState.itemToDelete = null;
        });

        elements.modalConfirmBtn.addEventListener('click', () => {
            handleDeleteItem();
        });

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', async () => {
            appState.loading = true; // Set initial loading state
            updateUIForLanguage(); // Render initial UI with loading message
            await loadFoodItems(); // Load data from simulated API
            // No need to set appState.loading = false here, loadFoodItems() handles it
        });