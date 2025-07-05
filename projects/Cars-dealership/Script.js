// Sample car data
const cars = [
    {
      id: '1',
      name: 'BMW X5',
      model: 'SUV',
      seats: 5,
      price: {
        rent: 150,
        purchase: 65000,
      },
      image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800',
      driverFeePerDay: 100,
    },
    {
      id: '2',
      name: 'Mercedes S-Class',
      model: 'Luxury',
      seats: 4,
      price: {
        rent: 200,
        purchase: 95000,
      },
      image: 'https://images.unsplash.com/photo-1622200294772-e99a72390faa?auto=format&fit=crop&q=80&w=800',
      driverFeePerDay: 150,
    },
    {
      id: '3',
      name: 'Tesla Model 3',
      model: 'Sedan',
      seats: 5,
      price: {
        rent: 120,
        purchase: 45000,
      },
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?auto=format&fit=crop&q=80&w=800',
      driverFeePerDay: 80,
    },
  ];
  
  // Initialize Lucide icons
  lucide.createIcons();
  
  // DOM Elements
  const searchForm = document.getElementById('searchForm');
  const carList = document.getElementById('carList');
  const newSearchBtn = document.getElementById('newSearchBtn');
  const rentalModal = document.getElementById('rentalModal');
  const purchaseModal = document.getElementById('purchaseModal');
  const rentalForm = document.getElementById('rentalForm');
  const purchaseForm = document.getElementById('purchaseForm');
  
  let selectedCar = null;
  
  // Event Listeners
  document.getElementById('carSearchForm').addEventListener('submit', handleSearch);
  newSearchBtn.addEventListener('click', showSearchForm);
  rentalForm.addEventListener('submit', handleRentalSubmit);
  purchaseForm.addEventListener('submit', handlePurchaseSubmit);
  
  document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
      rentalModal.classList.add('hidden');
      purchaseModal.classList.add('hidden');
    });
  });
  
  // Handle search form submission
  function handleSearch(e) {
    e.preventDefault();
    const filters = {
      model: document.getElementById('carModel').value,
      name: document.getElementById('carName').value,
      seats: parseInt(document.getElementById('seats').value),
    };
  
    const filteredCars = cars.filter(car => {
      const modelMatch = !filters.model || car.model === filters.model;
      const nameMatch = !filters.name || car.name.toLowerCase().includes(filters.name.toLowerCase());
      const seatsMatch = !filters.seats || car.seats >= filters.seats;
      return modelMatch && nameMatch && seatsMatch;
    });
  
    displayCars(filteredCars);
    searchForm.classList.add('hidden');
    carList.classList.remove('hidden');
    newSearchBtn.classList.remove('hidden');
  }
  
  // Display filtered cars
  function displayCars(filteredCars) {
    if (filteredCars.length === 0) {
      carList.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-600">No cars found matching your criteria.</p>
        </div>
      `;
      return;
    }
  
    carList.innerHTML = filteredCars.map(car => `
      <div class="car-card">
        <img src="${car.image}" alt="${car.name}" class="car-image">
        <div class="car-details">
          <h3 class="car-name">${car.name}</h3>
          <p class="car-model">${car.model}</p>
          <div class="car-seats">
            <i data-lucide="users"></i>
            <span>${car.seats} seats</span>
          </div>
          <div class="car-price">
            <div class="price-row">
              <span>Rent per day:</span>
              <span class="price-amount">$${car.price.rent}</span>
            </div>
            <div class="price-row">
              <span>Purchase price:</span>
              <span class="price-amount">$${car.price.purchase}</span>
            </div>
          </div>
          <div class="car-actions">
            <button class="button button-primary" onclick="openRentalModal('${car.id}')">
              Rent
            </button>
            <button class="button button-success" onclick="openPurchaseModal('${car.id}')">
              Buy
            </button>
          </div>
        </div>
      </div>
    `).join('');
  
    // Reinitialize Lucide icons for the new content
    lucide.createIcons();
  }
  
  // Show search form
  function showSearchForm() {
    searchForm.classList.remove('hidden');
    carList.classList.add('hidden');
    newSearchBtn.classList.add('hidden');
  }
  
  // Open rental modal
  function openRentalModal(carId) {
    selectedCar = cars.find(car => car.id === carId);
    rentalModal.classList.remove('hidden');
    rentalModal.querySelector('.car-name').textContent = selectedCar.name;
    rentalModal.querySelector('.amount').textContent = `$${selectedCar.price.rent}`;
    
    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').min = today;
    document.getElementById('returnDate').min = today;
  }
  
  // Open purchase modal
  function openPurchaseModal(carId) {
    selectedCar = cars.find(car => car.id === carId);
    purchaseModal.classList.remove('hidden');
    purchaseModal.querySelector('.car-name').textContent = selectedCar.name;
    purchaseModal.querySelector('.amount').textContent = `$${selectedCar.price.purchase}`;
    
    // Set minimum date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchasePickupDate').min = today;
  }
  
  // Calculate rental total
  function calculateRentalTotal() {
    const pickupDate = new Date(document.getElementById('pickupDate').value);
    const returnDate = new Date(document.getElementById('returnDate').value);
    const needsDriver = document.getElementById('needsDriver').checked;
  
    if (!isNaN(pickupDate.getTime()) && !isNaN(returnDate.getTime()) && selectedCar) {
      const days = Math.max(1, Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)));
      const driverFee = needsDriver ? selectedCar.driverFeePerDay * days : 0;
      const total = (selectedCar.price.rent * days) + driverFee;
      rentalModal.querySelector('.amount').textContent = `$${total.toFixed(2)}`;
    } else {
      rentalModal.querySelector('.amount').textContent = `$0.00`;
    }
  }
  
  // Event listeners for rental calculation
  document.getElementById('pickupDate').addEventListener('change', calculateRentalTotal);
  document.getElementById('returnDate').addEventListener('change', calculateRentalTotal);
  document.getElementById('needsDriver').addEventListener('change', calculateRentalTotal);
  
  // Handle rental form submission
  function handleRentalSubmit(e) {
    e.preventDefault();
    const formData = {
      carId: selectedCar.id,
      pickupDate: document.getElementById('pickupDate').value,
      returnDate: document.getElementById('returnDate').value,
      needsDriver: document.getElementById('needsDriver').checked,
      paymentMethod: document.querySelector('input[name="payment"]:checked').value,
    };
    console.log('Rental form submitted:', formData);
    rentalModal.classList.add('hidden');
  }
  
  // Handle purchase form submission
  function handlePurchaseSubmit(e) {
    e.preventDefault();
    const formData = {
      carId: selectedCar.id,
      pickupDate: document.getElementById('purchasePickupDate').value,
      paymentMethod: document.querySelector('input[name="purchasePayment"]:checked').value,
    };
    console.log('Purchase form submitted:', formData);
    purchaseModal.classList.add('hidden');
  }
  