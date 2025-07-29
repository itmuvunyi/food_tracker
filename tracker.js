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
                reminderInfo: ".",
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
                fetchProductDetails: "Look up Barcode"
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
                fetchProductDetails: "Reba Barcode"
            }
        };

        // --- Global State Management ---
        const appState = {
            currentPage: 'dashboard',
            foodItems: [],
            loading: true,
            error: null,
            userId: localStorage.getItem('foodTrackerUserId') || crypto.randomUUID(),
            isAuthReady: true, // Always true for localStorage, no external auth
            currentLanguage: localStorage.getItem('foodTrackerLanguage') || 'en', // Load language from localStorage
            scannedProduct: null, // Holds product data from API lookup
            editingItem: null, // Holds item data when in edit mode
            message: { text: '', type: '' },
            itemToDelete: null,
        };

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

        // --- Local Storage Data Management ---
        function loadFoodItems() {
            try {
                const storedItems = localStorage.getItem(`foodItems_${appState.userId}`);
                if (storedItems) {
                    appState.foodItems = JSON.parse(storedItems);
                    // Sort items by expiry date for consistent display
                    appState.foodItems.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
                } else {
                    appState.foodItems = [];
                }
                appState.error = null; // Clear any previous loading errors
            } catch (err) {
                console.error("Error loading food items from localStorage:", err);
                appState.error = t('errorLoading') + err.message;
            }
        }

        function saveFoodItems() {
            try {
                localStorage.setItem(`foodItems_${appState.userId}`, JSON.stringify(appState.foodItems));
            } catch (err) {
                console.error("Error saving food items to localStorage:", err);
                appState.error = t('errorSaving') + err.message;
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

                // Trigger reminder if set and expiring within 2 days (inclusive of today)
                if (item.reminderSet && diffDays >= 0 && diffDays <= 2) {
                    const daysLeftText = diffDays === 0 ? t('today') : diffDays === 1 ? t('tomorrow') : `${diffDays} ${t('daysLeft')}`;
                    // to prevent popping up on every page load.
                    showMessage(t('reminderTriggered').replace('{itemName}', item.name).replace('{daysLeft}', daysLeftText), 'info');
                }
            });
        }

        // --- OpenFoodFacts API Integration (for manual barcode entry lookup) ---
        async function fetchProductDetails(barcode) {
            if (!barcode) return;
            appState.loading = true;
            renderPage(); // Update UI to show loading state

            try {
                const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.status === 1 && data.product) {
                    const product = data.product;
                    const newProductData = {
                        barcode: barcode,
                        name: product.product_name || product.generic_name || '',
                        brand: product.brands || '',
                        category: product.categories || '',
                        expiryDate: '', // User must enter
                        reminderSet: false, // Default for new item
                        id: crypto.randomUUID() // Generate a unique ID for new items
                    };
                    appState.scannedProduct = newProductData;
                    showMessage(t('productFound'), 'success');
                } else {
                    const newProductData = {
                        barcode: barcode,
                        name: '', brand: '', category: '', expiryDate: '', reminderSet: false,
                        id: crypto.randomUUID() // Generate a unique ID for new items
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
                    id: crypto.randomUUID() // Generate a unique ID for new items
                };
                appState.scannedProduct = newProductData;
            } finally {
                appState.loading = false;
                renderPage(); // Re-render to show updated form with fetched data
            }
        }

        // --- Item Management Functions ---
        function handleSaveItem(itemData) {
            appState.loading = true; // Indicate loading during save
            try {
                if (itemData.id) {
                    // Update existing item
                    const index = appState.foodItems.findIndex(item => item.id === itemData.id);
                    if (index !== -1) {
                        appState.foodItems[index] = itemData;
                        showMessage(t('itemUpdated'), 'success');
                    }
                } else {
                    // Add new item with ensuring it has an ID
                    itemData.id = crypto.randomUUID(); // Generate ID if not already present
                    itemData.addedDate = new Date().toISOString().split('T')[0]; // Record when added
                    itemData.reminderSet = false; // Default for new item
                    itemData.consumed = false; // Default for new item
                    appState.foodItems.push(itemData);
                    showMessage(t('itemAdded'), 'success');
                }
                saveFoodItems(); // Save to localStorage
                appState.scannedProduct = null; // Clear scanned product data
                appState.editingItem = null; // Clear editing state
                appState.currentPage = 'dashboard'; // Navigate back to dashboard

                // Crucial: Reload and re-render the dashboard to reflect changes
                loadFoodItems(); // Re-load to get sorted items
                renderPage();
            } catch (err) {
                console.error("Error saving item:", err);
                appState.error = t('errorSaving') + err.message;
                renderPage(); // Render to show error message
            } finally {
                appState.loading = false; // End loading
            }
        }

        function confirmDeleteItem(item) {
            appState.itemToDelete = item;
            elements.modalMessage.textContent = t('confirmDelete');
            elements.confirmationModal.classList.remove('hidden');
        }

        function handleDeleteItem() {
            elements.confirmationModal.classList.add('hidden');
            if (!appState.itemToDelete) {
                showMessage("No item selected for deletion.", "warning");
                return;
            }

            appState.loading = true;
            try {
                appState.foodItems = appState.foodItems.filter(item => item.id !== appState.itemToDelete.id);
                saveFoodItems(); // Save to localStorage
                showMessage(t('itemDeleted'), 'success');
                appState.itemToDelete = null; // Clear item to delete
                loadFoodItems(); // Re-load to ensure dashboard is updated
                renderPage(); // Render the dashboard
            } catch (err) {
                console.error("Error deleting item:", err);
                appState.error = t('errorSaving') + err.message;
                renderPage(); // Render to show error message
            } finally {
                appState.loading = false; // End loading
            }
        }

        function handleMarkConsumed(id) {
            appState.loading = true;
            try {
                appState.foodItems = appState.foodItems.filter(item => item.id !== id);
                saveFoodItems(); // Save to localStorage
                showMessage(t('itemMarkedConsumed'), 'success');
                loadFoodItems(); // Re-load to ensure dashboard is updated
                renderPage(); // Render the dashboard
            } catch (err) {
                console.error("Error marking item as consumed:", err);
                appState.error = t('errorSaving') + err.message;
                renderPage(); // Render to show error message
            } finally {
                appState.loading = false;
            }
        }

        function handleSetReminder(itemToUpdate) {
            appState.loading = true;
            try {
                const index = appState.foodItems.findIndex(item => item.id === itemToUpdate.id);
                if (index !== -1) {
                    appState.foodItems[index].reminderSet = !appState.foodItems[index].reminderSet;
                    saveFoodItems(); // Save to localStorage
                    const messageKey = appState.foodItems[index].reminderSet ? 'reminderSetSuccess' : 'unsetReminderConfirmed';
                    showMessage(t(messageKey), 'success');
                }
                renderPage(); // Re-render to show updated button state (Set/Unset Reminder)
            } catch (err) {
                console.error("Error setting reminder:", err);
                appState.error = t('errorSaving') + err.message;
                renderPage(); // Render to show error message
            } finally {
                appState.loading = false;
            }
        }

        function handleEditItem(itemId) {
            const itemToEdit = appState.foodItems.find(item => item.id === itemId);
            if (itemToEdit) {
                appState.editingItem = { ...itemToEdit }; // Create a copy to avoid direct mutation
                appState.currentPage = 'add';
                renderPage();
            } else {
                showMessage("Item not found for editing.", "warning");
            }
        }

        // --- Date Helper Functions ---
        function getDaysLeft(expiryDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to start of day
            const expiry = new Date(expiryDate);
            expiry.setHours(0, 0, 0, 0); // Normalize to start of day

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

            if (diffDays < 0) return 'card-red';      // Expired
            if (diffDays <= 7) return 'card-yellow';   // Expiring soon (within 7 days)
            return 'card-green';                       // Good
        }

        // Helper to get today's date in YYYY-MM-DD format
        function getTodayDateString() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // --- Page Render Functions ---
        function renderDashboard() {
            // Filter out items marked as consumed.
            // Items are already sorted by expiry date in loadFoodItems().
            const itemsToDisplay = appState.foodItems.filter(item => !item.consumed);

            elements.pageContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-6 text-gray-800">${t('dashboard')}</h2>
                ${appState.loading ? `<p class="text-center text-indigo-600">${t('loading')}</p>` : ''}
                ${appState.error ? `<div class="message-box warning">${appState.error}</div>` : ''}
                <div id="food-items-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${itemsToDisplay.length === 0 ? `<p class="text-center col-span-full text-gray-600">${t('noItems')}</p>` : ''}
                    ${itemsToDisplay.map(item => `
                        <div class="card ${getExpiryStatusClass(item.expiryDate)}">
                            <h3 class="text-xl font-semibold mb-2">${item.name || 'N/A'}</h3>
                            <p class="text-sm mb-1"><strong>${t('brand')}:</strong> ${item.brand || 'N/A'}</p>
                            <p class="text-sm mb-1"><strong>${t('category')}:</strong> ${item.category || 'N/A'}</p>
                            <p class="text-sm mb-4"><strong>${t('expiryDate')}:</strong> ${item.expiryDate} (${getDaysLeft(item.expiryDate)})</p>
                            <div class="flex flex-wrap gap-2 justify-end">
                                <button onclick="handleEditItem('${item.id}')" class="button button-blue text-sm">${t('edit')}</button>
                                <button onclick="confirmDeleteItem(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="button button-red text-sm">${t('delete')}</button>
                                <button onclick="handleMarkConsumed('${item.id}')" class="button button-green text-sm">${t('markConsumed')}</button>
                                <button onclick="handleSetReminder(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="button button-purple text-sm">
                                    ${item.reminderSet ? t('unsetReminder') : t('addReminder')}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function renderAddItem() {
            const isEditing = appState.editingItem !== null;
            // Use existing item data if editing or default empty values
            const item = appState.editingItem || appState.scannedProduct || { barcode: '', name: '', brand: '', category: '', expiryDate: '', reminderSet: false };

            elements.pageContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-6 text-gray-800">${isEditing ? t('edit') + ' ' + t('productName') : t('addItem')}</h2>
                ${appState.error ? `<div class="message-box warning">${appState.error}</div>` : ''}
                <div class="card p-6">
                    <form id="add-item-form" class="space-y-4">
                        <div>
                            <label for="barcode" class="block text-sm font-medium text-gray-700 mb-1">${t('barcode')}</label>
                            <input type="text" id="barcode" name="barcode" class="form-input" value="${item.barcode}" placeholder="${t('barcode')}" ${isEditing ? 'readonly' : ''}>
                            <button type="button" id="lookup-barcode-btn" class="button button-blue mt-2">${t('fetchProductDetails')}</button>
                        </div>
                        <div>
                            <label for="productName" class="block text-sm font-medium text-gray-700 mb-1">${t('productName')}</label>
                            <input type="text" id="productName" name="productName" class="form-input" value="${item.name}" required placeholder="${t('productName')}">
                        </div>
                        <div>
                            <label for="brand" class="block text-sm font-medium text-gray-700 mb-1">${t('brand')}</label>
                            <input type="text" id="brand" name="brand" class="form-input" value="${item.brand}" placeholder="${t('brand')}">
                        </div>
                        <div>
                            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">${t('category')}</label>
                            <input type="text" id="category" name="category" class="form-input" value="${item.category}" placeholder="${t('category')}">
                        </div>
                        <div>
                            <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-1">${t('expiryDate')}</label>
                            <input type="date" id="expiryDate" name="expiryDate" class="form-input" value="${item.expiryDate}" required>
                        </div>
                        <div class="flex justify-end gap-3">
                            <button type="button" id="cancel-add-btn" class="button button-gray">${t('cancel')}</button>
                            <button type="submit" class="button button-green">${t('save')}</button>
                        </div>
                    </form>
                </div>
            `;

            // Set min date for expiryDate input field
            const expiryDateInput = document.getElementById('expiryDate');
            if (expiryDateInput) {
                expiryDateInput.min = getTodayDateString();
            }

            // Add event listeners for the form and buttons within this view
            document.getElementById('add-item-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newItem = {
                    id: item.id, // Preserve ID if editing
                    barcode: formData.get('barcode'),
                    name: formData.get('productName'),
                    brand: formData.get('brand'),
                    category: formData.get('category'),
                    expiryDate: formData.get('expiryDate'),
                    reminderSet: item.reminderSet || false, // Preserve existing reminder status or default to false
                    consumed: item.consumed || false, // Preserve existing consumed status or default to false
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

            if (appState.loading) {
                showMessage(t('loading'), 'info');
            }
        }

        function renderSettings() {
            elements.pageContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-6 text-gray-800">${t('settings')}</h2>
                <div class="card p-6">
                    <div class="mb-4">
                        <label for="language-select" class="block text-sm font-medium text-gray-700 mb-1">${t('language')}</label>
                        <select id="language-select" class="form-input">
                            <option value="en" ${appState.currentLanguage === 'en' ? 'selected' : ''}>${t('english')}</option>
                            <option value="rw" ${appState.currentLanguage === 'rw' ? 'selected' : ''}>${t('kinyarwanda')}</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <p class="text-sm font-medium text-gray-700 mb-1">${t('userId')}</p>
                        <p class="p-2 bg-gray-100 rounded-md text-gray-800 break-all">${appState.userId}</p>
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
            // Clear previous content and hide messages
            elements.pageContent.innerHTML = '';
            elements.messageDisplay.classList.add('hidden'); // Ensure message is hidden on page switch

            // Remove active class from all nav buttons
            elements.dashboardBtn.classList.remove('active');
            elements.addItemBtn.classList.remove('active');
            elements.settingsBtn.classList.remove('active');

            // Render content based on currentPage state
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
                    renderDashboard(); // Default to dashboard
                    elements.dashboardBtn.classList.add('active');
            }

            // Show global messages if any are pending (re-display after render)
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
            // Always reload items before rendering dashboard to ensure fresh data
            loadFoodItems();
            renderPage();
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

        // Confirmation Modal Event Listeners
        elements.modalCancelBtn.addEventListener('click', () => {
            elements.confirmationModal.classList.add('hidden');
            appState.itemToDelete = null; // Clear item to delete
        });

        elements.modalConfirmBtn.addEventListener('click', () => {
            handleDeleteItem();
        });

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Load food items first (sets appState.foodItems)
            loadFoodItems();
            // 2. Update UI for language (calls renderPage() internally, which then uses the loaded foodItems)
            updateUIForLanguage();
            // 3. Check for reminders after initial load and render
            checkReminders();
        });
