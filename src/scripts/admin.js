// admin.js (Incorporating UI Fixes and Burger Menu Logic)

// Verify/Adjust path 
import { 
  fetchCategories, fetchProducts, fetchUsers, fetchOrders, 
  addProduct, deleteProduct, fetchProductById, updateProduct 
} from '../utils/api.js'; // Using relative path

document.addEventListener("DOMContentLoaded", () => {
  // --- State Variables ---
  let isEditMode = false;         
  let editingProductId = null;    

  // --- Element Selections ---
  const desktopNavLinks = document.querySelectorAll(".desktop-nav ul li a");
  const contentSections = document.querySelectorAll(".content-section");
  const addProductForm = document.getElementById("addProductForm");
  const categoriesContainer = document.getElementById("categories");
  const cancelButton = addProductForm?.querySelector('.btn-cancel');
  const productListTableBody = document.getElementById('productListBody'); 
  const categoryListTableBody = document.getElementById('categoryListBody'); 
  const customerListTableBody = document.getElementById('customerListBody'); 
  const orderListTableBody = document.getElementById('orderListBody'); 
  const addProductSubmitButton = addProductForm?.querySelector('button[type="submit"]'); 
  const burgerBtn = document.getElementById('burgerMenuBtn'); // For burger menu
  const navModal = document.getElementById('navModal'); // For modal
  const closeModalBtn = document.getElementById('closeModalBtn'); // Modal close button
  const modalNavLinks = document.querySelectorAll(".modal-nav ul li a"); // Links inside modal
  const logoLink = document.querySelector('.logo-link'); 
  const startPageSection = document.getElementById('start-page'); // Welcome section

  // --- Helper Functions ---
  function hideAllSections() {
    contentSections.forEach((section) => {
       section.style.display = "none";
    });
  }

  function showSection(id) {
      hideAllSections(); // Hide all sections first
      
      const target = document.getElementById(id);
      if (target) {
          target.style.display = "block"; // Show the target section
          
          // Trigger data loading based on section ID
          if (id === 'product-list') { loadProductList(); } 
          else if (id === 'category-list') { loadCategoryList(); } 
          else if (id === 'customer-list') { loadCustomerList(); } 
          else if (id === 'order-list') { loadOrderList(); } 
          
          // Reset edit mode if navigating away from add form
          if (id !== 'product-add') {
              resetEditMode();
          }
      } else if (id === 'start-page') {
           // Special case handled by default display or direct call
           const startTarget = document.getElementById('start-page');
           if(startTarget) startTarget.style.display = 'block';
           resetEditMode();
      } else { 
          console.warn(`Content section with id "${id}" not found.`); 
          // Show start page if target not found?
           const startTarget = document.getElementById('start-page');
           if(startTarget) startTarget.style.display = 'block';
      }
  }
  
  function resetEditMode() {
      isEditMode = false; editingProductId = null; 
      if (addProductSubmitButton) { addProductSubmitButton.textContent = 'Lägg till produkt'; } 
      if (addProductForm) { addProductForm.reset(); }
      const hiddenInput = addProductForm?.querySelector('input[name="editProductId"]'); if (hiddenInput) hiddenInput.remove();
  }

  // --- Data Loading Functions ---
  async function loadCategories() { /* ... function as before ... */ 
      if (!categoriesContainer) { return; } try { const categories = await fetchCategories(); categoriesContainer.innerHTML = ""; if (categories && categories.length > 0) { categoriesContainer.disabled = false; const defaultOption = document.createElement("option"); defaultOption.textContent = "Välj kategori"; defaultOption.value = ""; defaultOption.disabled = true; defaultOption.selected = true; categoriesContainer.appendChild(defaultOption); categories.forEach((category) => { const element = document.createElement("option"); element.value = category.name; element.textContent = category.name; categoriesContainer.appendChild(element); }); } else { const defaultOption = document.createElement("option"); defaultOption.textContent = "Inga kategorier tillgängliga"; defaultOption.value = ""; defaultOption.disabled = true; categoriesContainer.appendChild(defaultOption); categoriesContainer.disabled = true; console.log("No categories available."); } } catch (error) { console.error("Error loading categories:", error); const errorOption = document.createElement("option"); errorOption.textContent = "Kunde inte ladda kategorier"; errorOption.value = ""; errorOption.disabled = true; categoriesContainer.innerHTML = ''; categoriesContainer.appendChild(errorOption); categoriesContainer.disabled = true; }
  }

  async function loadCategoryList() { /* Uses Font Awesome Icons */
    const tableBody = document.getElementById('categoryListBody'); const errorElement = document.getElementById('categoryListError'); if (!tableBody || !errorElement) { return; } tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Laddar kategorier...</td></tr>`; errorElement.textContent = ''; errorElement.style.display = 'none'; try { const categories = await fetchCategories(); tableBody.innerHTML = ''; if (categories && categories.length > 0) { categories.forEach(category => { const row = document.createElement('tr'); const name = category.name || 'Ingen namn'; const description = category.description || '-'; const categoryId = category._id || null; row.innerHTML = `<td>${name}</td><td>${description}</td><td> <button class="btn-icon btn-edit-category" data-id="${categoryId}" ${!categoryId ? 'disabled' : ''} title="Redigera kategori (API saknas)" aria-label="Redigera kategori"><i class="fas fa-pencil-alt" aria-hidden="true"></i></button> <button class="btn-icon btn-delete-category" data-id="${categoryId}" ${!categoryId ? 'disabled' : ''} title="Ta bort kategori (API saknas)" aria-label="Ta bort kategori"><i class="fas fa-trash-alt" aria-hidden="true"></i></button> </td>`; tableBody.appendChild(row); }); } else { tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Inga kategorier hittades.</td></tr>`; } } catch (error) { console.error("Error loading category list:", error); tableBody.innerHTML = ''; errorElement.textContent = 'Kunde inte ladda kategorilistan.'; errorElement.style.display = 'block'; }
  }

  async function loadProductList() { /* Uses Font Awesome Icons & Description Clipping */
    const tableBody = document.getElementById('productListBody'); const errorElement = document.getElementById('productListError'); if (!tableBody || !errorElement) { return; } tableBody.innerHTML = `<tr><td colspan="8" style="text-align: left;">Laddar produkter...</td></tr>`; errorElement.textContent = ''; errorElement.style.display = 'none'; 
    try { 
        const products = await fetchProducts(); tableBody.innerHTML = ''; 
        if (products && products.length > 0) { 
            products.forEach(product => { 
                const row = document.createElement('tr'); const category = product.category || 'Ingen kategori'; const title = product.title || 'Ingen titel'; const producer = product.producer || '-'; const weight = product.weight || '-'; const description = product.description || '-'; const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'; const productId = product._id || null; const stock = product.stock !== undefined && product.stock !== null ? product.stock : '-'; 
                
                const fullDescription = description;
                const limit = 60; // Character limit for description
                const shortDescription = fullDescription.length > limit ? fullDescription.substring(0, limit) + '...' : fullDescription;
                const descriptionHTML = fullDescription.length > limit ? `${shortDescription} <a href="#" class="see-more-desc" data-full-desc="${encodeURIComponent(fullDescription)}">(mer)</a>` : shortDescription;
                
                row.innerHTML = `<td>${category}</td><td>${title}</td><td>${producer}</td><td>${weight}</td><td>${descriptionHTML}</td><td>${price}</td><td>${stock}</td><td><button class="btn-icon btn-edit-icon" data-id="${productId}" ${!productId ? 'disabled' : ''} aria-label="Redigera produkt"><i class="fas fa-pencil-alt" aria-hidden="true"></i></button> <button class="btn-icon btn-delete-icon" data-id="${productId}" ${!productId ? 'disabled' : ''} aria-label="Ta bort produkt"><i class="fas fa-trash-alt" aria-hidden="true"></i></button></td>`; 
                tableBody.appendChild(row); 
            });
        } else { tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">Inga produkter hittades.</td></tr>`; }
    } catch (error) { console.error("Error loading product list:", error); tableBody.innerHTML = ''; errorElement.textContent = 'Kunde inte ladda produktlistan.'; errorElement.style.display = 'block'; }
  }

  async function loadCustomerList() { /* Uses Font Awesome Icons */
      const tableBody = document.getElementById('customerListBody'); const errorElement = document.getElementById('customerListError'); if (!tableBody || !errorElement) { return; } tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Laddar kunder...</td></tr>`; errorElement.textContent = ''; errorElement.style.display = 'none'; try { const users = await fetchUsers(); tableBody.innerHTML = ''; if (users && users.length > 0) { users.forEach(user => { const row = document.createElement('tr'); const firstName = user.firstName || '-'; const lastName = user.lastName || '-'; const email = user.email || '-'; const isAdmin = user.isAdmin ? 'Ja' : 'Nej'; const registeredDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('sv-SE') : '-'; const userId = user._id || null; row.innerHTML = `<td>${firstName}</td><td>${lastName}</td><td>${email}</td><td>${isAdmin}</td><td>${registeredDate}</td><td> <button class="btn-icon btn-edit-customer" data-id="${userId}" ${!userId ? 'disabled' : ''} title="Redigera kund (API saknas)" aria-label="Redigera kund"><i class="fas fa-pencil-alt" aria-hidden="true"></i></button> <button class="btn-icon btn-delete-customer" data-id="${userId}" ${!userId ? 'disabled' : ''} title="Ta bort kund (API saknas)" aria-label="Ta bort kund"><i class="fas fa-trash-alt" aria-hidden="true"></i></button></td>`; tableBody.appendChild(row); }); } else { tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Inga kunder hittades.</td></tr>`; } } catch (error) { console.error("Error loading customer list:", error); tableBody.innerHTML = ''; errorElement.textContent = 'Kunde inte ladda kundlistan.'; errorElement.style.display = 'block';}
  }
  
  async function loadOrderList() { /* Placeholder - Requires Auth & Order Schema Info */
      const tableBody = document.getElementById('orderListBody'); const errorElement = document.getElementById('orderListError'); if (!tableBody || !errorElement) { return; } tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">Laddar ordrar...</td></tr>`; errorElement.textContent = ''; errorElement.style.display = 'none';
      try {
          const orders = await fetchOrders(); tableBody.innerHTML = '';
          if (orders && orders.length > 0) {
               orders.forEach(order => { const row = document.createElement('tr'); /* ... Populate with known fields ... */ const orderId = order.orderNumber || order._id || 'N/A'; const firstName = order.customer?.firstName || order.shippingAddress?.firstName || '-'; const lastName = order.customer?.lastName || order.shippingAddress?.lastName || '-'; const address = order.shippingAddress?.street ? `${order.shippingAddress.street}, ${order.shippingAddress.zipCode} ${order.shippingAddress.city}` : '-'; const phone = order.shippingAddress?.phone || '-'; const email = order.customer?.email || '-'; const total = typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : 'N/A'; const orderMongoId = order._id || null; row.innerHTML = `<td>${orderId}</td><td>${firstName}</td><td>${lastName}</td><td>${address}</td><td>${phone}</td><td>${email}</td><td>${total}</td><td> <button class="btn-icon btn-view-order" data-id="${orderMongoId}" ${!orderMongoId ? 'disabled' : ''} aria-label="Visa orderdetaljer"><i class="fas fa-search" aria-hidden="true"></i></button></td>`; tableBody.appendChild(row); });
          } else { tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">Inga ordrar hittades.</td></tr>`; }
      } catch (error) { console.error("Error loading order list:", error); tableBody.innerHTML = ''; errorElement.textContent = 'Kunde inte ladda orderlistan. Autentisering eller API kan saknas.'; errorElement.style.display = 'block'; }
  }

  // --- Handler Functions for Actions ---
  async function handleDeleteProduct(productId) { /* ... function as before ... */ 
      if (typeof deleteProduct !== 'function') { alert("Fel: deleteProduct function missing."); return; } try { console.log(`handleDeleteProduct called for ID: ${productId}`); const result = await deleteProduct(productId); if (result.success) { alert(`Produkt ${productId} borttagen!`); loadProductList(); } else { const errorMsg = result.error?.message || 'Okänt fel'; const statusMsg = result.status ? ` (${result.status})` : ''; alert(`Kunde inte ta bort produkt ${productId}: ${errorMsg}${statusMsg}`); } } catch (error) { console.error(`Error in handleDeleteProduct:`, error); alert(`Fel vid borttagning.`); }
  }
  async function handleEditProduct(productId) { /* ... function as before ... */ 
      if (!productId) return; console.log(`handleEditProduct called for ID: ${productId}`); const product = await fetchProductById(productId); if (!product) { alert(`Kunde inte hämta produktdata för ID: ${productId}`); return; } const titleInput=document.getElementById('productTitle'), categorySelect=document.getElementById('categories'), producerInput=document.getElementById('productProducer'), weightInput=document.getElementById('productWeight'), descriptionTextarea=document.getElementById('productDescription'), priceInput=document.getElementById('forsaljningspris'), stockInput=document.getElementById('lager'), imageInput=document.getElementById('productImage'); if(titleInput)titleInput.value = product.title||''; if(categorySelect)categorySelect.value = product.category||''; if(producerInput)producerInput.value = product.producer||''; if(weightInput)weightInput.value = product.weight||''; if(descriptionTextarea)descriptionTextarea.value = product.description||''; if(priceInput)priceInput.value = product.price||''; if(stockInput)stockInput.value = product.stock!==undefined&&product.stock!==null?product.stock:''; if(imageInput)imageInput.value = product.image||''; isEditMode = true; editingProductId = productId; if (addProductSubmitButton) { addProductSubmitButton.textContent = 'Uppdatera produkt'; } showSection('product-add'); addProductForm?.scrollIntoView({ behavior: 'smooth' });
  }

  // --- Event Listeners ---
  // Navigation (Desktop Links + Logo Link)
  desktopNavLinks.forEach((link) => { link.addEventListener("click", (e) => { e.preventDefault(); const target = link.getAttribute("data-section"); if(target) { showSection(target); } }); });
  if (logoLink) { logoLink.addEventListener('click', (e) => { e.preventDefault(); showSection('start-page'); }); } 

  // Add/Update Product form submission 
  if (addProductForm) { addProductForm.addEventListener("submit", async (e) => { /* ... Code as before (handles add/update logic) ... */ 
      e.preventDefault(); const titleInput=document.getElementById('productTitle'), categorySelect=document.getElementById('categories'), producerInput=document.getElementById('productProducer'), weightInput=document.getElementById('productWeight'), descriptionTextarea=document.getElementById('productDescription'), priceInput=document.getElementById('forsaljningspris'), stockInput=document.getElementById('lager'), imageInput=document.getElementById('productImage'); if (!titleInput?.value || !categorySelect?.value || !priceInput?.value) { alert('Fyll i åtminstone Titel, Kategori och Pris.'); return; } const productData = { title: titleInput.value.trim(), category: categorySelect.value, producer: producerInput.value.trim(), weight: weightInput.value.trim(), description: descriptionTextarea.value.trim(), price: parseFloat(priceInput.value) || 0, stock: parseInt(stockInput.value) || 0, image: imageInput.value.trim() }; console.log("Form submitted. Edit Mode:", isEditMode, "Data:", productData); if (isEditMode && editingProductId) { console.log(`Attempting to update product ID: ${editingProductId}`); try { const result = await updateProduct(editingProductId, productData); if (result.success) { alert(`Produkt ${editingProductId} uppdaterad!`); resetEditMode(); showSection('product-list'); } else { const errorMsg = result.error?.message || 'Okänt fel'; const statusMsg = result.status ? ` (${result.status})` : ''; alert(`Kunde inte uppdatera produkt: ${errorMsg}${statusMsg}`); } } catch (error) { console.error("Error updating product:", error); alert("Fel vid uppdatering."); } } else { console.log("Attempting to call addProduct API..."); try { const result = await addProduct(productData); if (result.success) { alert("Produkt tillagd!"); resetEditMode(); showSection('product-list'); } else { const errorMsg = result.error?.message || 'Okänt fel'; const statusMsg = result.status ? ` (${result.status})` : ''; alert(`Kunde inte lägga till produkt: ${errorMsg}${statusMsg}`); } } catch (error) { console.error("Error submitting product:", error); alert("Fel vid tillägg."); } }
    });
  }

  // MODIFIED Cancel button listener (handles edit mode return)
  if (cancelButton) {
      cancelButton.addEventListener('click', () => {
          const wasEditing = isEditMode; 
          resetEditMode(); 
          hideAllSections(); 
          // If cancelling an edit, go back to product list, otherwise show start page
          if(wasEditing) {
              showSection('product-list');
          } else {
               showSection('start-page'); 
          }
      });
  }

  // Listener for Product List Actions (Edit/Delete Icons + See More Desc)
  if (productListTableBody) {
      productListTableBody.addEventListener('click', (event) => {
          const target = event.target; 
          const editButton = target.closest('.btn-edit-icon'); 
          if (editButton) { const productId = editButton.getAttribute('data-id'); handleEditProduct(productId); return; }
          
          const deleteButton = target.closest('.btn-delete-icon');
          if (deleteButton) { const productId = deleteButton.getAttribute('data-id'); if (confirm(`Är du säker på att du vill ta bort produkt ${productId}?`)) { handleDeleteProduct(productId); } return; }
          
          // Listener for 'See More' Description Link
          const seeMoreLink = target.closest('.see-more-desc');
          if (seeMoreLink) {
              event.preventDefault();
              try {
                  // Use try-catch for decodeURIComponent
                  const fullDesc = decodeURIComponent(seeMoreLink.getAttribute('data-full-desc') || '');
                  alert(`Full Beskrivning:\n\n${fullDesc}`);
              } catch (e) {
                  console.error("Error decoding description:", e);
                  alert("Kunde inte visa full beskrivning.");
              }
          }
      });
  }
  
  // Listener for Category List Actions (Placeholder Icons)
  if (categoryListTableBody) {
      categoryListTableBody.addEventListener('click', (event) => { const target = event.target; const editButton = target.closest('.btn-edit-category'); if(editButton) { const categoryId = editButton.getAttribute('data-id'); console.log('Edit category clicked:', categoryId); alert(`Redigera Kategori ${categoryId} - API saknas!`); } const deleteButton = target.closest('.btn-delete-category'); if(deleteButton) { const categoryId = deleteButton.getAttribute('data-id'); console.log('Delete category clicked:', categoryId); alert(`Ta bort Kategori ${categoryId} - API saknas!`); } });
  }
   // Listener for Customer List Actions (Placeholder Icons)
   if (customerListTableBody) {
      customerListTableBody.addEventListener('click', (event) => { const target = event.target; const editButton = target.closest('.btn-edit-customer'); if(editButton) { const customerId = editButton.getAttribute('data-id'); console.log('Edit customer clicked:', customerId); alert(`Redigera Kund ${customerId} - API saknas!`); } const deleteButton = target.closest('.btn-delete-customer'); if(deleteButton) { const customerId = deleteButton.getAttribute('data-id'); console.log('Delete customer clicked:', customerId); alert(`Ta bort Kund ${customerId} - API saknas!`); } });
  }
  // Listener for Order List Actions (Placeholder Icon)
   if (orderListTableBody) {
      orderListTableBody.addEventListener('click', (event) => { const target = event.target; const viewButton = target.closest('.btn-view-order'); if(viewButton) { const orderId = viewButton.getAttribute('data-id'); console.log('View order clicked:', orderId); alert(`Visa Order ${orderId} - Detaljvy ej implementerad än.`); } });
  }

  // --- Burger Menu/Modal Listeners ---
  if (burgerBtn && navModal) {
      burgerBtn.addEventListener('click', () => {
          navModal.style.display = 'block'; // Use display instead of hidden attr
          navModal.offsetHeight; // Trigger reflow before adding class for transition
          navModal.classList.add('open');
          burgerBtn.classList.add('active'); 
          burgerBtn.setAttribute('aria-expanded', 'true');
      });
  }
  if (closeModalBtn && navModal) {
      closeModalBtn.addEventListener('click', () => {
          navModal.classList.remove('open');
          burgerBtn?.classList.remove('active'); 
          burgerBtn?.setAttribute('aria-expanded', 'false');
          // Reset display after transition ends
           navModal.addEventListener('transitionend', (e) => {
               // Ensure it's the opacity transition finishing
               if (e.propertyName === 'opacity' && !navModal.classList.contains('open')) { 
                   navModal.style.display = 'none'; 
               }
           }, { once: true }); 
      });
  }
  if (navModal) {
      navModal.addEventListener('click', (event) => { if (event.target === navModal) { closeModalBtn?.click(); } });
  }
  if (modalNavLinks.length > 0 && navModal) {
      modalNavLinks.forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault(); 
              const targetSection = link.getAttribute('data-section'); 
              if (targetSection) { showSection(targetSection); }
              closeModalBtn?.click(); 
          });
      });
  }

  // --- Initial Setup Calls ---
  loadCategories(); 
  // Default view is now #start-page via HTML/CSS

}); // --- End of DOMContentLoaded Listener ---