// Multi-language support for ShopMate
const languages = {
  en: {
    name: "English",
    flag: "🇺🇸",
    dir: "ltr",
    translations: {
      // Navigation
      "nav.cart": "Cart",
      "nav.checkout": "Quick Checkout",
      "nav.theme": "Toggle theme",
      
      // Hero Section
      "hero.title": "Discover sleek gear crafted for your everyday flow.",
      "hero.subtitle": "Beautiful, responsive, and fast. Filter, search, and add to cart — all with zero frameworks.",
      "hero.search": "Search products… (e.g. headphones)",
      "hero.clear": "Clear",
      "hero.offer": "SAVE 15% • NEW DROPS",
      
      // Toolbar
      "toolbar.category": "Category",
      "toolbar.sort": "Sort",
      "toolbar.maxPrice": "Max Price",
      "toolbar.availability": "Availability",
      "toolbar.favorites": "Favorites",
      
      // Categories
      "category.all": "All",
      "category.audio": "Audio",
      "category.peripherals": "Peripherals",
      "category.wearables": "Wearables",
      "category.accessories": "Accessories",
      "category.home": "Home",
      "category.bags": "Bags",
      "category.shoes": "Shoes",
      "category.tshirt": "T-Shirt",

      // Sort Options
      "sort.popular": "Most Popular",
      "sort.priceAsc": "Price: Low → High",
      "sort.priceDesc": "Price: High → Low",
      "sort.new": "Newest",
      "sort.name": "Name A → Z",
      
      // Availability
      "availability.all": "Show All",
      "availability.in": "In Stock",
      "availability.out": "Out of Stock",
      
      // Favorites
      "favorites.all": "Show All",
      "favorites.only": "Favorites Only",
      
      // Product Actions
      "product.addToCart": "Add to Cart",
      "product.preview": "Preview",
      "product.outOfStock": "Out of Stock",
      "product.maxAdded": "Max Added",
      "product.addMore": "Add More",
      "product.addToFavorites": "Add to favorites",
      "product.removeFromFavorites": "Remove from favorites",
      "product.inCart": "in cart",
      
      // Cart
      "cart.title": "Your Cart",
      "cart.close": "Close",
      "cart.empty": "Your cart is empty.",
      "cart.subtotal": "Subtotal",
      "cart.checkout": "Checkout",
      "cart.emptyCart": "Empty Cart",
      "cart.remove": "Remove",
      "cart.each": "each",
      
      // Variant Selection
      "variant.selectOptions": "Select Options for",
      "variant.color": "Color",
      "variant.size": "Size",
      "variant.required": "*",
      "variant.cancel": "Cancel",
      "variant.addToCart": "Add to Cart",
      "variant.left": "left",
      
      // Checkout
      "checkout.title": "Checkout",
      "checkout.fullName": "Full Name",
      "checkout.email": "Email",
      "checkout.phone": "Phone Number",
      "checkout.wilaya": "Wilaya",
      "checkout.address": "Full Address",
      "checkout.disclaimer": "Order will be processed for delivery. Subtotal:",
      "checkout.cancel": "Cancel",
      "checkout.placeOrder": "Place Order",
      "checkout.nameExample": "e.g. Alex Doe",
      "checkout.emailExample": "you@example.com",
      "checkout.phoneExample": "+213 555 123 456",
      "checkout.selectWilaya": "Select Wilaya",
      "checkout.addressExample": "Street, Commune, Daira",
      "checkout.fillRequired": "Please fill in all required fields correctly",
      
      // Order Management
      "order.confirmation": "Order Confirmation",
      "order.id": "Order ID",
      "order.date": "Order Date",
      "order.items": "Items Ordered",
      "order.subtotal": "Subtotal",
      "order.tax": "Tax (19%)",
      "order.total": "Total",
      "order.created": "Order created successfully!",
      "order.processing": "Processing your order...",
      "customer.name": "Customer",
      "customer.wilaya": "Delivery Wilaya",
      
      // Contact
      "contact.title": "Get in Touch",
      "contact.subtitle": "Have questions about our products or need support? We'd love to hear from you.",
      "contact.email": "Email",
      "contact.phone": "Phone",
      "contact.office": "Office",
      "contact.hours": "Mon-Fri 9AM-6PM EST",
      "contact.yourName": "Your Name",
      "contact.yourEmail": "Your Email",
      "contact.subject": "Subject",
      "contact.message": "Your Message",
      "contact.send": "Send Message",
      "contact.sending": "Sending...",
      
      // Footer
      "footer.shop": "Shop",
      "footer.support": "Support",
      "footer.company": "Company",
      "footer.contactUs": "Contact Us",
      "footer.faq": "FAQ",
      "footer.shipping": "Shipping Info",
      "footer.returns": "Returns",
      "footer.about": "About Us",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.careers": "Careers",
      "footer.description": "Discover sleek gear crafted for your everyday flow. Modern e-commerce experience with zero frameworks.",
      "footer.rights": "All rights reserved. Created by: Rdesign Company",
      
      // Messages
      "message.addedToCart": "Added to cart!",
      "message.cantAdd": "Can't add",
      "message.onlyAvailable": "only {count} more available",
      "message.maxQuantity": "Maximum quantity is {max}",
      "message.outOfStock": "{color} is out of stock",
      "message.sizeOutOfStock": "Size {size} is out of stock",
      "message.cantAddVariant": "Can't add more - only {max} more available for this variant",
      "message.addedVariant": "Added {name} ({variant}) to cart!",
      "message.themeChanged": "Switched to {theme} mode",
      "message.languageChanged": "Language changed to {language}",
      "message.categoryFilter": "Showing {category} products",
      "message.contactSuccess": "Thank you! Your message has been sent successfully.",
      "message.contactError": "Sorry, there was an error sending your message. Please try again.",
      "message.orderPlaced": "Order placed successfully! Thank you for your purchase.",
      "message.noProducts": "No products match your filters. Try clearing search or adjusting filters.",
      
      // Theme names
      "theme.light": "light",
      "theme.dark": "dark",
      
      // Currency
      "currency.symbol": "da",
      "currency.name": "Algerian Dinar"
    }
  },
  
  ar: {
    name: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
    translations: {
      // Navigation
      "nav.cart": "السلة",
      "nav.checkout": "الدفع السريع",
      "nav.theme": "تغيير المظهر",
      
      // Hero Section
      "hero.title": "اكتشف الأجهزة الأنيقة المصممة لحياتك اليومية.",
      "hero.subtitle": "جميل ومتجاوب وسريع. تصفية وبحث وإضافة إلى السلة — كل ذلك بدون إطارات عمل.",
      "hero.search": "البحث في المنتجات... (مثل سماعات الرأس)",
      "hero.clear": "مسح",
      "hero.offer": "وفر 15% • منتجات جديدة",
      
      // Toolbar
      "toolbar.category": "الفئة",
      "toolbar.sort": "ترتيب",
      "toolbar.maxPrice": "أقصى سعر",
      "toolbar.availability": "التوفر",
      "toolbar.favorites": "المفضلة",
      
      // Categories
      "category.all": "الكل",
      "category.audio": "الصوتيات",
      "category.peripherals": "الملحقات",
      "category.wearables": "الأجهزة القابلة للارتداء",
      "category.accessories": "الإكسسوارات",
      "category.home": "المنزل",
      "category.bags": "الحقائب",
      "category.shoes": "أحذية",
      "category.tshirt": "قميص",

      // Sort Options
      "sort.popular": "الأكثر شعبية",
      "sort.priceAsc": "السعر: منخفض ← مرتفع",
      "sort.priceDesc": "السعر: مرتفع ← منخفض",
      "sort.new": "الأحدث",
      "sort.name": "الاسم أ ← ي",
      
      // Availability
      "availability.all": "عرض الكل",
      "availability.in": "متوفر",
      "availability.out": "غير متوفر",
      
      // Favorites
      "favorites.all": "عرض الكل",
      "favorites.only": "المفضلة فقط",
      
      // Product Actions
      "product.addToCart": "أضف إلى السلة",
      "product.preview": "معاينة",
      "product.outOfStock": "غير متوفر",
      "product.maxAdded": "تم إضافة الحد الأقصى",
      "product.addMore": "أضف المزيد",
      "product.addToFavorites": "أضف إلى المفضلة",
      "product.removeFromFavorites": "إزالة من المفضلة",
      "product.inCart": "في السلة",
      
      // Cart
      "cart.title": "سلتك",
      "cart.close": "إغلاق",
      "cart.empty": "سلتك فارغة.",
      "cart.subtotal": "المجموع الفرعي",
      "cart.checkout": "الدفع",
      "cart.emptyCart": "إفراغ السلة",
      "cart.remove": "إزالة",
      "cart.each": "لكل قطعة",
      
      // Variant Selection
      "variant.selectOptions": "اختر الخيارات لـ",
      "variant.color": "اللون",
      "variant.size": "الحجم",
      "variant.required": "*",
      "variant.cancel": "إلغاء",
      "variant.addToCart": "أضف إلى السلة",
      "variant.left": "متبقي",
      
      // Checkout
      "checkout.title": "الدفع",
      "checkout.fullName": "الاسم الكامل",
      "checkout.email": "البريد الإلكتروني",
      "checkout.phone": "رقم الهاتف",
      "checkout.wilaya": "الولاية",
      "checkout.address": "العنوان الكامل",
      "checkout.disclaimer": "سيتم معالجة الطلب للتوصيل. المجموع الفرعي:",
      "checkout.cancel": "إلغاء",
      "checkout.placeOrder": "تأكيد الطلب",
      "checkout.nameExample": "مثال: أحمد محمد",
      "checkout.emailExample": "you@example.com",
      "checkout.phoneExample": "+213 555 123 456",
      "checkout.selectWilaya": "اختر الولاية",
      "checkout.addressExample": "الشارع، البلدية، الدائرة",
      "checkout.fillRequired": "يرجى ملء جميع الحقول المطلوبة بشكل صحيح",
      
      // Order Management
      "order.confirmation": "تأكيد الطلب",
      "order.id": "رقم الطلب",
      "order.date": "تاريخ الطلب",
      "order.items": "المنتجات المطلوبة",
      "order.subtotal": "المجموع الفرعي",
      "order.tax": "الضريبة (19%)",
      "order.total": "المجموع الإجمالي",
      "order.created": "تم إنشاء الطلب بنجاح!",
      "order.processing": "جاري معالجة طلبك...",
      "customer.name": "العميل",
      "customer.wilaya": "ولاية التوصيل",
      
      // Contact
      "contact.title": "تواصل معنا",
      "contact.subtitle": "هل لديك أسئلة حول منتجاتنا أو تحتاج للدعم؟ نحن نحب أن نسمع منك.",
      "contact.email": "البريد الإلكتروني",
      "contact.phone": "الهاتف",
      "contact.office": "المكتب",
      "contact.hours": "الإثنين-الجمعة 9ص-6م بتوقيت شرق أمريكا",
      "contact.yourName": "اسمك",
      "contact.yourEmail": "بريدك الإلكتروني",
      "contact.subject": "الموضوع",
      "contact.message": "رسالتك",
      "contact.send": "إرسال الرسالة",
      "contact.sending": "جاري الإرسال...",
      
      // Footer
      "footer.shop": "تسوق",
      "footer.support": "الدعم",
      "footer.company": "الشركة",
      "footer.contactUs": "تواصل معنا",
      "footer.faq": "الأسئلة الشائعة",
      "footer.shipping": "معلومات الشحن",
      "footer.returns": "الإرجاع",
      "footer.about": "من نحن",
      "footer.privacy": "سياسة الخصوصية",
      "footer.terms": "شروط الخدمة",
      "footer.careers": "الوظائف",
      "footer.description": "اكتشف الأجهزة الأنيقة المصممة لحياتك اليومية. تجربة تجارة إلكترونية حديثة بدون إطارات عمل.",
      "footer.rights": "جميع الحقوق محفوظة. صُنع من طرف Rdesign Company",
      
      // Messages
      "message.addedToCart": "تم إضافته إلى السلة!",
      "message.cantAdd": "لا يمكن إضافة",
      "message.onlyAvailable": "فقط {count} متوفر أكثر",
      "message.maxQuantity": "الكمية القصوى هي {max}",
      "message.outOfStock": "{color} غير متوفر",
      "message.sizeOutOfStock": "الحجم {size} غير متوفر",
      "message.cantAddVariant": "لا يمكن إضافة المزيد - فقط {max} متوفر أكثر لهذا النوع",
      "message.addedVariant": "تم إضافة {name} ({variant}) إلى السلة!",
      "message.themeChanged": "تم التبديل إلى وضع {theme}",
      "message.languageChanged": "تم تغيير اللغة إلى {language}",
      "message.categoryFilter": "عرض منتجات {category}",
      "message.contactSuccess": "شكراً لك! تم إرسال رسالتك بنجاح.",
      "message.contactError": "عذراً، حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى.",
      "message.orderPlaced": "تم تأكيد الطلب بنجاح! شكراً لك على الشراء.",
      "message.noProducts": "لا توجد منتجات تطابق المرشحات. جرب مسح البحث أو تعديل المرشحات.",
      
      // Theme names
      "theme.light": "فاتح",
      "theme.dark": "داكن",
      
      // Currency
      "currency.symbol": "د.ج",
      "currency.name": "دينار جزائري"
    }
  },
  
  fr: {
    name: "Français",
    flag: "🇫🇷",
    dir: "ltr",
    translations: {
      // Navigation
      "nav.cart": "Panier",
      "nav.checkout": "Commande Rapide",
      "nav.theme": "Changer de thème",
      
      // Hero Section
      "hero.title": "Découvrez des équipements élégants conçus pour votre quotidien.",
      "hero.subtitle": "Beau, réactif et rapide. Filtrez, recherchez et ajoutez au panier — le tout sans frameworks.",
      "hero.search": "Rechercher des produits... (ex. écouteurs)",
      "hero.clear": "Effacer",
      "hero.offer": "ÉCONOMISEZ 15% • NOUVEAUTÉS",
      
      // Toolbar
      "toolbar.category": "Catégorie",
      "toolbar.sort": "Trier",
      "toolbar.maxPrice": "Prix max",
      "toolbar.availability": "Disponibilité",
      "toolbar.favorites": "Favoris",
      
      // Categories
      "category.all": "Tous",
      "category.audio": "Audio",
      "category.peripherals": "Périphériques",
      "category.wearables": "Objets connectés",
      "category.accessories": "Accessoires",
      "category.home": "Maison",
      "category.bags": "Sacs",
      "category.shoes": "Chaussures",
      "category.tshirt": "T-Shirt",

      // Sort Options
      "sort.popular": "Plus populaire",
      "sort.priceAsc": "Prix: Bas → Haut",
      "sort.priceDesc": "Prix: Haut → Bas",
      "sort.new": "Plus récent",
      "sort.name": "Nom A → Z",
      
      // Availability
      "availability.all": "Tout afficher",
      "availability.in": "En stock",
      "availability.out": "Rupture de stock",
      
      // Favorites
      "favorites.all": "Tout afficher",
      "favorites.only": "Favoris seulement",
      
      // Product Actions
      "product.addToCart": "Ajouter au panier",
      "product.preview": "Aperçu",
      "product.outOfStock": "Rupture de stock",
      "product.maxAdded": "Maximum ajouté",
      "product.addMore": "Ajouter plus",
      "product.addToFavorites": "Ajouter aux favoris",
      "product.removeFromFavorites": "Retirer des favoris",
      "product.inCart": "dans le panier",
      
      // Cart
      "cart.title": "Votre Panier",
      "cart.close": "Fermer",
      "cart.empty": "Votre panier est vide.",
      "cart.subtotal": "Sous-total",
      "cart.checkout": "Commander",
      "cart.emptyCart": "Vider le panier",
      "cart.remove": "Retirer",
      "cart.each": "chaque",
      
      // Variant Selection
      "variant.selectOptions": "Sélectionner les options pour",
      "variant.color": "Couleur",
      "variant.size": "Taille",
      "variant.required": "*",
      "variant.cancel": "Annuler",
      "variant.addToCart": "Ajouter au panier",
      "variant.left": "restant",
      
      // Checkout
      "checkout.title": "Commande",
      "checkout.fullName": "Nom complet",
      "checkout.email": "E-mail",
      "checkout.phone": "Numéro de téléphone",
      "checkout.wilaya": "Wilaya",
      "checkout.address": "Adresse complète",
      "checkout.disclaimer": "La commande sera traitée pour livraison. Sous-total:",
      "checkout.cancel": "Annuler",
      "checkout.placeOrder": "Passer commande",
      "checkout.nameExample": "ex. Alex Dupont",
      "checkout.emailExample": "vous@example.com",
      "checkout.phoneExample": "+213 555 123 456",
      "checkout.selectWilaya": "Sélectionner Wilaya",
      "checkout.addressExample": "Rue, Commune, Daira",
      "checkout.fillRequired": "Veuillez remplir tous les champs requis correctement",
      
      // Order Management
      "order.confirmation": "Confirmation de commande",
      "order.id": "ID de commande",
      "order.date": "Date de commande",
      "order.items": "Articles commandés",
      "order.subtotal": "Sous-total",
      "order.tax": "Taxe (19%)",
      "order.total": "Total",
      "order.created": "Commande créée avec succès!",
      "order.processing": "Traitement de votre commande...",
      "customer.name": "Client",
      "customer.wilaya": "Wilaya de livraison",
      
      // Contact
      "contact.title": "Contactez-nous",
      "contact.subtitle": "Vous avez des questions sur nos produits ou besoin d'aide ? Nous aimerions vous entendre.",
      "contact.email": "E-mail",
      "contact.phone": "Téléphone",
      "contact.office": "Bureau",
      "contact.hours": "Lun-Ven 9h-18h EST",
      "contact.yourName": "Votre nom",
      "contact.yourEmail": "Votre e-mail",
      "contact.subject": "Sujet",
      "contact.message": "Votre message",
      "contact.send": "Envoyer le message",
      "contact.sending": "Envoi en cours...",
      
      // Footer
      "footer.shop": "Boutique",
      "footer.support": "Support",
      "footer.company": "Entreprise",
      "footer.contactUs": "Nous contacter",
      "footer.faq": "FAQ",
      "footer.shipping": "Info livraison",
      "footer.returns": "Retours",
      "footer.about": "À propos",
      "footer.privacy": "Politique de confidentialité",
      "footer.terms": "Conditions d'utilisation",
      "footer.careers": "Carrières",
      "footer.description": "Découvrez des équipements élégants conçus pour votre quotidien. Expérience e-commerce moderne sans frameworks.",
      "footer.rights": "Tous droits réservés. Fait par: Rdesign boite de dev",
      
      // Messages
      "message.addedToCart": "Ajouté au panier !",
      "message.cantAdd": "Impossible d'ajouter",
      "message.onlyAvailable": "seulement {count} de plus disponible",
      "message.maxQuantity": "La quantité maximum est {max}",
      "message.outOfStock": "{color} est en rupture de stock",
      "message.sizeOutOfStock": "La taille {size} est en rupture de stock",
      "message.cantAddVariant": "Impossible d'ajouter plus - seulement {max} de plus disponible pour cette variante",
      "message.addedVariant": "{name} ({variant}) ajouté au panier !",
      "message.themeChanged": "Basculé en mode {theme}",
      "message.languageChanged": "Langue changée en {language}",
      "message.categoryFilter": "Affichage des produits {category}",
      "message.contactSuccess": "Merci ! Votre message a été envoyé avec succès.",
      "message.contactError": "Désolé, il y a eu une erreur lors de l'envoi de votre message. Veuillez réessayer.",
      "message.orderPlaced": "Commande passée avec succès ! Merci pour votre achat.",
      "message.noProducts": "Aucun produit ne correspond à vos filtres. Essayez d'effacer la recherche ou d'ajuster les filtres.",
      
      // Theme names
      "theme.light": "clair",
      "theme.dark": "sombre",
      
      // Currency
      "currency.symbol": "da",
      "currency.name": "Dinar Algérien"
    }
  }
};

// Language utility functions
let currentLanguage = localStorage.getItem('language') || 'en';

function t(key, replacements = {}) {
  const translation = languages[currentLanguage]?.translations[key] || languages.en.translations[key] || key;
  
  // Replace placeholders like {count}, {max}, etc.
  return Object.keys(replacements).reduce((text, placeholder) => {
    return text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
  }, translation);
}

function setLanguage(langCode) {
  if (languages[langCode]) {
    currentLanguage = langCode;
    localStorage.setItem('language', langCode);
    
    // Update document direction
    document.documentElement.dir = languages[langCode].dir;
    document.documentElement.lang = langCode;
    
    // Update all translatable elements
    updatePageTranslations();
    
    // Show success message
    toast(t('message.languageChanged', {language: languages[langCode].name}), 'success');
  }
}

function getCurrentLanguage() {
  return currentLanguage;
}

function updatePageTranslations() {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);
    
    if (element.tagName === 'INPUT' && element.type !== 'submit') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
  
  // Update aria-labels for icon-only buttons
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', t('nav.theme'));
  }
  
  const cartButton = document.getElementById('openCart');
  if (cartButton) {
    cartButton.setAttribute('aria-label', t('nav.cart'));
  }
}

function updateDynamicTranslations() {
  // Re-render products to update button text
  if (typeof renderProducts === 'function') {
    renderProducts();
  }
  
  // Update cart UI
  if (typeof updateCartUI === 'function') {
    updateCartUI();
  }
  
  // Update filters
  if (typeof updateFilters === 'function') {
    updateFilters();
  }
}
  
// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  // Set initial language direction
  document.documentElement.dir = languages[currentLanguage].dir;
  document.documentElement.lang = currentLanguage;
  
  // Update translations after a short delay to ensure all elements are loaded
  setTimeout(() => {
    updatePageTranslations();
    updateDynamicTranslations();
  }, 100);
});
