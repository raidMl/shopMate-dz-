// Formulaire Component
class OrderFormulaire {
  constructor(productId, productData, options = {}) {
    this.productId = productId;
    this.product = productData;
    this.onOrderSuccess = options.onOrderSuccess || (() => {});
    this.quantity = 1;
    this.selectedColor = null;
    this.selectedSize = null;
    this.deliveryType = 'door'; // 'door' or 'stopdesk'
    this.deliveryPrices = {
      door: 70,      // التوصيل للمنزل
      stopdesk: 50   // التوصيل لمكتب الشحن
    };
    
    // List of Algerian Wilayas (58 provinces)
    this.wilayas = [
      { code: '01', name: 'الجزائر البيضاء' },
      { code: '02', name: 'الشلف' },
      { code: '03', name: 'الأغواط' },
      { code: '04', name: 'أم البواقي' },
      { code: '05', name: 'باتنة' },
      { code: '06', name: 'بجاية' },
      { code: '07', name: 'بسكرة' },
      { code: '08', name: 'بشار' },
      { code: '09', name: 'البليدة' },
      { code: '10', name: 'البويرة' },
      { code: '11', name: 'تمنراست' },
      { code: '12', name: 'تبسة' },
      { code: '13', name: 'تلمسان' },
      { code: '14', name: 'تيارت' },
      { code: '15', name: 'تيزي وزو' },
      { code: '16', name: 'الجزائر' },
      { code: '17', name: 'الجلفة' },
      { code: '18', name: 'جيجل' },
      { code: '19', name: 'سطيف' },
      { code: '20', name: 'السعيدة' },
      { code: '21', name: 'سكيكدة' },
      { code: '22', name: 'سيدي بلعباس' },
      { code: '23', name: 'عنابة' },
      { code: '24', name: 'قالمة' },
      { code: '25', name: 'قسنطينة' },
      { code: '26', name: 'المدية' },
      { code: '27', name: 'مستغانم' },
      { code: '28', name: 'المسيلة' },
      { code: '29', name: 'معسكر' },
      { code: '30', name: 'ورقلة' },
      { code: '31', name: 'وهران' },
      { code: '32', name: 'البيض' },
      { code: '33', name: 'إليزي' },
      { code: '34', name: 'برج بوعريريج' },
      { code: '35', name: 'بومرداس' },
      { code: '36', name: 'الطارف' },
      { code: '37', name: 'تندوف' },
      { code: '38', name: 'تسيمسيلت' },
      { code: '39', name: 'الوادي (واد سوف)' },
      { code: '40', name: 'خنشلة' },
      { code: '41', name: 'سوق أهراس' },
      { code: '42', name: 'تيبازة' },
      { code: '43', name: 'ميلة' },
      { code: '44', name: 'عين الدفلى' },
      { code: '45', name: 'النعامة' },
      { code: '46', name: 'عين تموشنت' },
      { code: '47', name: 'غرادية' },
      { code: '48', name: 'غليزان' },
      { code: '49', name: 'تيميمون' },
      { code: '50', name: 'برج باجي مختار' },
      { code: '51', name: 'أولاد جلال' },
      { code: '52', name: 'بني عباس' },
      { code: '53', name: 'عين صالح' },
      { code: '54', name: 'عين قزام' },
      { code: '55', name: 'توقرت' },
      { code: '56', name: 'جانت' },
      { code: '57', name: 'المغير' },
      { code: '58', name: 'المنيعة' }
    ];
  }

  render() {
    return `
      <div class="formulaire-wrapper">
        <div class="formulaire-header">
          <h2>استمارة الطلب</h2>
          <p>المرجو إدخال معلوماتك الخاصة بك</p>
        </div>

        <div class="formulaire-messages">
          <div class="formulaire-error" id="formulaireError"></div>
          <div class="formulaire-success" id="formulaireSuccess"></div>
        </div>

        <form id="orderFormulaire" class="formulaire-form">
          <div class="formulaire-group">
            <label for="formFullName">
              <span class="required">*</span>الإسم الكامل
            </label>
            <input 
              type="text" 
              id="formFullName" 
              name="fullName"
              placeholder="محمد علي" 
              required 
            />
          </div>

          <div class="formulaire-group">
            <label for="formPhone">
              <span class="required">*</span>الهاتف
            </label>
            <input 
              type="tel" 
              id="formPhone" 
              name="phone"
              placeholder="0671234567" 
              required 
            />
          </div>

          <div class="formulaire-group">
            <label for="formWilaya">
              <span class="required">*</span>الولاية
            </label>
            <select id="formWilaya" name="wilaya" required>
              <option value="">اختر الولاية</option>
            </select>
          </div>

          <div class="formulaire-group">
            <label for="formMunicipality">
              <span class="required">*</span>البلدية
            </label>
            <input 
              type="text" 
              id="formMunicipality" 
              name="municipality"
              placeholder="اسم البلدية" 
              required 
            />
          </div>

          <div class="formulaire-delivery-container">
            <div class="formulaire-delivery-header">
              <span class="formulaire-delivery-icon">🚚</span>
              <span>التوصيل</span>
            </div>
            <div class="formulaire-delivery-options">
              <label class="formulaire-delivery-option">
                <input 
                  type="radio" 
                  name="delivery_type" 
                  value="door" 
                  checked
                  data-delivery-type="door"
                />
                <span class="delivery-label">التوصيل للمنزل</span>
                <span class="delivery-price">70 دج</span>
              </label>
              <label class="formulaire-delivery-option">
                <input 
                  type="radio" 
                  name="delivery_type" 
                  value="stopdesk"
                  data-delivery-type="stopdesk"
                />
                <span class="delivery-label">التوصيل لمكتب الشحن</span>
                <span class="delivery-price">50 دج</span>
              </label>
            </div>
          </div>

          <div class="formulaire-group" id="formulaireAddressGroup">
            <label for="formAddress">العنوان</label>
            <input 
              type="text" 
              id="formAddress" 
              name="address"
              placeholder="الشارع، الحي" 
            />
          </div>

          <div class="formulaire-summary">
            <div class="formulaire-summary-row">
              <span id="summarySubtotal">0 دج</span>
              <span>سعر المنتج</span>
            </div>
            <div class="formulaire-summary-row">
              <span id="summaryShipping">70 دج</span>
              <span>سعر التوصيل</span>
            </div>
            <div class="formulaire-summary-row total">
              <span id="summaryTotal">0 دج</span>
              <span>المجموع</span>
            </div>
          </div>

          <div class="formulaire-quantity">
            <button type="button" class="formulaire-qty-btn" id="qtyMinus">−</button>
            <input 
              type="number" 
              class="formulaire-qty-input" 
              id="qtyInput"
              value="1" 
              min="1" 
              readonly
            />
            <button type="button" class="formulaire-qty-btn" id="qtyPlus">+</button>
          </div>

          <button type="submit" class="formulaire-submit">إشتري الان</button>
        </form>
      </div>
    `;
  }

  formatPrice(price) {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('د.ج.', 'دج');
  }

  mount(container) {
    const element = typeof container === 'string' 
      ? document.querySelector(container)
      : container;

    if (!element) {
      console.error('Container not found');
      return;
    }

    element.innerHTML = this.render();
    this.attachEventListeners();
    this.loadWilayas();
    this.updatePrices();
  }

  attachEventListeners() {
    const form = document.getElementById('orderFormulaire');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyInput = document.getElementById('qtyInput');
    const deliveryRadios = document.querySelectorAll('input[name="delivery_type"]');

    // Quantity button listeners
    if (qtyPlus) {
      qtyPlus.addEventListener('click', (e) => {
        e.preventDefault();
        this.quantity = Math.min(parseInt(qtyInput.value) + 1, this.product.stock || 999);
        qtyInput.value = this.quantity;
        this.updatePrices();
      });
    }

    if (qtyMinus) {
      qtyMinus.addEventListener('click', (e) => {
        e.preventDefault();
        this.quantity = Math.max(1, parseInt(qtyInput.value) - 1);
        qtyInput.value = this.quantity;
        this.updatePrices();
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener('change', () => {
        const val = Math.max(1, Math.min(parseInt(qtyInput.value) || 1, this.product.stock || 999));
        this.quantity = val;
        qtyInput.value = val;
        this.updatePrices();
      });
    }

    // Delivery type listeners
    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.deliveryType = e.target.value;
        this.toggleAddressField();
        this.updatePrices();
      });
    });

    // Form submit listener
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  toggleAddressField() {
    const addressGroup = document.getElementById('formulaireAddressGroup');
    if (addressGroup) {
      if (this.deliveryType === 'door') {
        addressGroup.style.display = 'block';
      } else {
        addressGroup.style.display = 'none';
      }
    }
  }

  loadWilayas() {
    const wilayaSelect = document.getElementById('formWilaya');
    if (!wilayaSelect) return;

    wilayaSelect.innerHTML = '<option value="">اختر الولاية</option>';
    
    // Use component's wilayas list
    this.wilayas.forEach(w => {
      const option = document.createElement('option');
      option.value = w.code;
      option.textContent = `${w.code} - ${w.name}`;
      wilayaSelect.appendChild(option);
    });
  }

  updatePrices() {
    const subtotal = (this.product.price || 0) * this.quantity;
    const currentDeliveryPrice = this.deliveryPrices[this.deliveryType] || this.deliveryPrices.door;
    const total = subtotal + currentDeliveryPrice;

    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');

    if (summarySubtotal) {
      summarySubtotal.textContent = this.formatPrice(subtotal);
    }

    if (summaryShipping) {
      summaryShipping.textContent = this.formatPrice(currentDeliveryPrice);
    }

    if (summaryTotal) {
      summaryTotal.textContent = this.formatPrice(total);
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const fullName = document.getElementById('formFullName')?.value.trim();
    const phone = document.getElementById('formPhone')?.value.trim();
    const wilaya = document.getElementById('formWilaya')?.value;
    const municipality = document.getElementById('formMunicipality')?.value.trim();
    const address = document.getElementById('formAddress')?.value.trim();

    // Validation
    if (!fullName || !phone || !wilaya || !municipality) {
      this.showError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    if (phone.length < 9) {
      this.showError('رقم الهاتف غير صحيح');
      return;
    }

    // If delivery type is 'door', address is required
    if (this.deliveryType === 'door' && !address) {
      this.showError('الرجاء إدخال العنوان للتوصيل للمنزل');
      return;
    }

    // Get current delivery price
    const currentDeliveryPrice = this.deliveryPrices[this.deliveryType] || this.deliveryPrices.door;

    // Prepare order data
    const orderData = {
      fullName,
      phone,
      wilaya,
      municipality,
      address: this.deliveryType === 'door' ? address : 'التوصيل لمكتب الشحن',
      quantity: this.quantity,
      deliveryType: this.deliveryType,
      productId: this.product.id,
      productName: this.product.name,
      productPrice: this.product.price,
      productImage: this.product.image,
      deliveryPrice: currentDeliveryPrice,
      totalPrice: (this.product.price * this.quantity) + currentDeliveryPrice,
      timestamp: new Date().toISOString(),
      color: this.selectedColor,
      size: this.selectedSize
    };

    // Save to localStorage
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Show success message
      document.getElementById('orderFormulaire').reset();
      document.getElementById('qtyInput').value = 1;
      this.quantity = 1;
      this.deliveryType = 'door';
      this.toggleAddressField();
      this.updatePrices();
      
      this.showSuccess('تم استقبال طلبك بنجاح! سنتصل بك قريباً.');
      
      // Trigger success callback
      if (typeof this.onOrderSuccess === 'function') {
        this.onOrderSuccess(orderData);
      }

      // Clear form after 3 seconds
      setTimeout(() => {
        this.hideMessages();
      }, 3000);

    } catch (error) {
      console.error('Order submission error:', error);
      this.showError('حدث خطأ في معالجة الطلب، يرجى المحاولة لاحقاً');
    }
  }

  showError(message) {
    const errorEl = document.getElementById('formulaireError');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      document.getElementById('formulaireSuccess').style.display = 'none';
    }
  }

  showSuccess(message) {
    const successEl = document.getElementById('formulaireSuccess');
    if (successEl) {
      successEl.textContent = message;
      successEl.style.display = 'block';
      document.getElementById('formulaireError').style.display = 'none';
    }
  }

  hideMessages() {
    const errorEl = document.getElementById('formulaireError');
    const successEl = document.getElementById('formulaireSuccess');
    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';
  }

  setSelectedColor(color) {
    this.selectedColor = color;
  }

  setSelectedSize(size) {
    this.selectedSize = size;
  }

  destroy() {
    // Cleanup
    const form = document.getElementById('orderFormulaire');
    if (form) {
      form.removeEventListener('submit', this.handleSubmit);
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OrderFormulaire;
}
