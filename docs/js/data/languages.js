// Multi-language support for ShopMate
const languages = {
  en: {
    name: "English",
    flag: "🇺🇸",
    dir: "ltr",
    translations: {
      // Navigation
      "nav.cart": "Shopping Cart",
      "nav.checkout": "Quick Checkout", 
      "nav.contact": "Contact Us",
      "nav.language": "Language",
      "nav.theme": "Toggle Theme",
      
      // Hero Section
      "hero.title": "Discover sleek gear crafted for your everyday flow.",
      "hero.subtitle": "Beautiful, responsive, and fast. Filter, search, and add to cart .",
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
      "cart.empty": "Your cart is empty",
      "cart.emptySubtext": "Add some amazing products to get started!",
      "cart.subtotal": "Subtotal",
      "cart.checkout": "Checkout",
      "cart.emptyCart": "Empty Cart",
      "cart.remove": "Remove",
      "cart.each": "each",
      "cart.continueShopping": "Continue Shopping",
      "cart.deliveryTax": "Delivery Tax",

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
      "order.print": "Print Order",
      "order.close": "Close",
      
      // Order Confirmation
      "order.confirmationTitle": "Order Confirmed!",
      "order.confirmationSubtitle": "Thank you for your purchase. Your order has been successfully placed.",
      "order.summary": "Order Summary",
      "order.customerInfo": "Customer Information",
      "order.deliveryTo": "Delivery To",
      "order.item": "item",
      "order.qrCode": "Order QR Code",
      "order.qrCodeDescription": "Show this QR code for order verification",
      "order.guestOrderNotice": "Guest Order",
      "order.guestOrderDescription": "Please save this information for order tracking. You can contact us with your order ID for updates.",
      "order.copyDetails": "Copy Details",
      "order.copiedToClipboard": "Order details copied to clipboard!",
      "order.copyFailed": "Failed to copy order details",
      
      // Customer information
      "customer.name": "Customer",
      "customer.email": "Email",
      "customer.phone": "Phone",
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
      
      // Contact Form
      "contact.success": "Thank you! Your message has been sent successfully.",
      "contact.error": "Sorry, there was an error sending your message. Please try again.",
      "contact.successTitle": "Message Sent!",
      "contact.successMessage": "Thank you for contacting us! We have received your message and will get back to you soon.",
      "contact.messageSummary": "Message Summary:",
      "contact.responseTime": "We typically respond within 24 hours during business days.",
      "contact.close": "Close",
      
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
      "footer.description": "Discover sleek gear crafted for your everyday flow. Modern e-commerce experience .",
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
      "currency.name": "Algerian Dinar",

      // Admin UI translations
      "admin.title": "Admin Panel",
      "admin.dashboard": "Dashboard",
      "admin.orders": "Orders",
      "admin.products": "Products",
      "admin.categories": "Categories",
      "admin.logout": "Logout",
      "admin.welcome": "Welcome back",
      "admin.totalProducts": "Total Products",
      "admin.totalCategories": "Total Categories",
      "admin.totalOrders": "Total Orders",
      "admin.totalRevenue": "Total Revenue",
      "admin.monthlyRevenue": "Monthly Revenue",
      "admin.orderCompletion": "Order Completion Rate",
      "admin.recentOrders": "Recent Orders",
      "admin.noRecentOrders": "No recent orders",
      "admin.ordersCompleted": "orders completed",
      "admin.loading": "Loading dashboard data...",
      
      // Authentication
      "auth.welcomeBack": "Welcome Back",
      "auth.signInSubtitle": "Sign in to your admin account to manage your store",
      "auth.email": "Email Address",
      "auth.password": "Password",
      "auth.emailPlaceholder": "Enter your email",
      "auth.passwordPlaceholder": "Enter your password",
      "auth.fillAllFields": "Please fill in all fields",
      "auth.secureAccess": "Secure admin access with encrypted authentication",
      "auth.needHelp": "Need help accessing your account? Contact support.",
      
      // Orders management
      "orders.title": "Orders Management",
      "orders.orderId": "Order ID",
      "orders.totalPrice": "Total Price",
      "orders.status": "Status",
      "orders.createdAt": "Created At",
      "orders.customer": "Customer",
      "orders.actions": "Actions",
      "orders.details": "Details",
      "orders.confirmDelete": "Are you sure you want to delete this order?",
      "orders.statuses.pending": "Pending",
      "orders.statuses.paid": "Paid",
      "orders.statuses.shipped": "Shipped",
      "orders.statuses.delivered": "Delivered",
      "orders.statuses.cancelled": "Cancelled",
      
      // Categories management
      "categories.title": "Categories Management",
      "categories.addNew": "Add New Category",
      "categories.edit": "Edit",
      "categories.delete": "Delete",
      "categories.confirmDelete": "Are you sure you want to delete this category?",
      "categories.name": "Category Name",
      "categories.description": "Description",
      "categories.namePlaceholder": "Enter category name",
      "categories.descriptionPlaceholder": "Enter category description (optional)",
      "categories.create": "Create Category",
      "categories.update": "Update Category",
      "categories.cancel": "Cancel",
      "categories.loading": "Loading categories...",
      "categories.noCategories": "No categories found. Create your first category to get started.",
      
      // Support page translations
      "support.title": "Customer Support",
      "support.subtitle": "How can we help you today?",
      "support.contact": "Contact Us",
      "support.faq": "FAQ",
      "support.shipping": "Shipping Info",
      "support.returns": "Returns",
      
      // FAQ translations
      "faq.title": "Frequently Asked Questions",
      "faq.subtitle": "Find quick answers to the most common questions about ShopMate Algeria.",
      "faq.general": "General Questions",
      "faq.orders": "Orders & Payment",
      "faq.products": "Products & Warranty",
      
      "faq.whatIsShopmate": "What is ShopMate Algeria?",
      "faq.whatIsShopmate.answer": "ShopMate Algeria is a modern e-commerce platform specializing in quality electronics, accessories, and gadgets. We serve customers across all 58 wilayas of Algeria with fast delivery and excellent customer service.",
      
      "faq.deliveryWilayas": "Do you deliver to all wilayas in Algeria?",
      "faq.deliveryWilayas.answer": "Yes! We deliver to all 58 wilayas across Algeria. Delivery times and costs may vary depending on your location, but we ensure nationwide coverage.",
      
      "faq.languages": "What languages do you support?",
      "faq.languages.answer": "Our website and customer support are available in three languages: Arabic, French, and English. You can switch languages using the language selector on our website.",
      
      "faq.paymentMethods": "What payment methods do you accept?",
      "faq.paymentMethods.answer": "We accept various payment methods including cash on delivery (COD), bank transfers, and major credit cards. All payment methods are clearly displayed at checkout.",
      
      "faq.trackOrder": "How can I track my order?",
      "faq.trackOrder.answer": "Once your order is shipped, you'll receive a tracking number via email or SMS. You can use this number to track your package through our delivery partners or contact our customer service for updates.",
      
      "faq.cancelOrder": "Can I cancel or modify my order?",
      "faq.cancelOrder.answer": "You can cancel or modify your order within 2 hours of placement. After that, if the order hasn't been shipped yet, contact our customer service immediately. Once shipped, cancellation may not be possible.",
      
      "faq.warranty": "Do your products come with warranty?",
      "faq.warranty.answer": "Yes! All our products come with manufacturer warranty. The warranty period varies by product and is clearly stated on each product page. We also provide after-sales support for all warranty claims.",
      
      "faq.authentic": "Are your products authentic?",
      "faq.authentic.answer": "Absolutely! We only sell authentic products from authorized distributors and manufacturers. All our products are genuine and come with proper documentation and warranty.",
      
      // Shipping information
      "shipping.title": "Shipping Information",
      "shipping.subtitle": "Fast Nationwide Delivery",
      "shipping.coverage": "Shipping Coverage",
      "shipping.coverageText": "We proudly serve customers across all of Algeria's 58 wilayas. Our delivery network ensures that whether you're in Algiers, Constantine, Oran, Setif, or any other wilaya, your order will reach you safely and on time.",
      "shipping.deliveryTimes": "Delivery Times & Costs",
      "shipping.wilayaType": "Wilaya Type",
      "shipping.deliveryTime": "Delivery Time",
      "shipping.shippingCost": "Shipping Cost",
      "shipping.examples": "Examples",
      "shipping.majorCities": "Major Cities",
      "shipping.regionalCenters": "Regional Centers",
      "shipping.remoteAreas": "Remote Areas",
      "shipping.freeShipping": "Free Shipping",
      "shipping.orderProcessing": "Order Processing",
      "shipping.partners": "Shipping Partners",
      "shipping.notes": "Important Shipping Notes",
      
      // Returns policy
      "returns.title": "Returns & Refunds",
      "returns.subtitle": "7-Day Return Policy",
      "returns.policy": "We want you to be completely satisfied with your purchase. If you're not happy, we offer easy returns within 7 days.",
      "returns.eligibility": "Return Eligibility",
      "returns.eligible": "Eligible for Return",
      "returns.notEligible": "Not Eligible for Return",
      "returns.process": "How to Return an Item",
      "returns.contactUs": "Contact Us",
      "returns.authorization": "Get Return Authorization",
      "returns.packShip": "Pack & Ship",
      "returns.refundProcessed": "Refund Processed",
      "returns.refundInfo": "Refund Information",
      "returns.defective": "Defective or Damaged Items",
      "returns.exchange": "Exchange Policy"
    }
  },
  
  ar: {
    name: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
    translations: {
      // Navigation
      "nav.cart": "سلة التسوق",
      "nav.checkout": "الدفع السريع", 
      "nav.contact": "اتصل بنا",
      "nav.language": "اللغة",
      "nav.theme": "تغيير المظهر",
      
      // Hero Section
      "hero.title": "اكتشف الأجهزة الأنيقة المصممة لحياتك اليومية.",
      "hero.subtitle": "جميل ومتجاوب وسريع. تصفية وبحث وإضافة إلى السلة.",
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
      "cart.empty": "سلتك فارغة",
      "cart.emptySubtext": "أضف بعض المنتجات للبدء",
      "cart.subtotal": "المجموع الفرعي",
      "cart.checkout": "الدفع",
      "cart.emptyCart": "إفراغ السلة",
      "cart.remove": "إزالة",
      "cart.each": "لكل قطعة",
      "cart.continueShopping": "تابع التسوق",
      "cart.deliveryTax": "ضريبة التوصيل",


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
      "order.print": "طباعة الطلب",
      "order.close": "إغلاق",
      
      // Order Confirmation
      "order.confirmationTitle": "تم تأكيد الطلب!",
      "order.confirmationSubtitle": "شكراً لك على الشراء. تم تقديم طلبك بنجاح.",
      "order.summary": "ملخص الطلب",
      "order.customerInfo": "معلومات العميل",
      "order.deliveryTo": "التوصيل إلى",
      "order.item": "عنصر",
      "order.qrCode": "رمز الاستجابة السريعة للطلب",
      "order.qrCodeDescription": "اعرض رمز الاستجابة السريعة هذا للتحقق من الطلب",
      "order.guestOrderNotice": "طلب كضيف",
      "order.guestOrderDescription": "يرجى حفظ هذه المعلومات لتتبع الطلب. يمكنك الاتصال بنا برقم تعريف الطلب الخاص بك للحصول على التحديثات.",
      "order.copyDetails": "نسخ التفاصيل",
      "order.copiedToClipboard": "تم نسخ تفاصيل الطلب إلى الحافظة!",
      "order.copyFailed": "فشل نسخ تفاصيل الطلب",
      
      // Customer information
      "customer.name": "Customer",
      "customer.email": "Email",
      "customer.phone": "Phone",
      "customer.wilaya": "Delivery Wilaya",
      
      // Contact
      "contact.title": "تواصل معنا",
      "contact.subtitle": "هل لديك أسئلة حول منتجاتنا أو تحتاج للدعم؟ نحن نحب أن نسمع منك.",
      "contact.email": "البريد الإلكتروني",
      "contact.phone": "الهاتف",
      "contact.office": "المكتب",
      "contact.hours": "الإثنين-الجمعة 9ص-4م",
      "contact.yourName": "اسمك",
      "contact.yourEmail": "بريدك الإلكتروني",
      "contact.subject": "الموضوع",
      "contact.message": "رسالتك",
      "contact.send": "إرسال الرسالة",
      "contact.sending": "جاري الإرسال...",
      
      // Contact Form
      "contact.success": "شكراً لك! تم إرسال رسالتك بنجاح.",
      "contact.error": "عذراً، حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى.",
      "contact.successTitle": "تم إرسال الرسالة!",
      "contact.successMessage": "شكراً لتواصلكم معنا! لقد استلمنا رسالتك وسنعود إليك قريبًا.",
      "contact.messageSummary": "ملخص الرسالة:",
      "contact.responseTime": "نحن عادةً نرد في غضون 24 ساعة خلال أيام العمل.",
      "contact.close": "إغلاق",
      
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
      "footer.description": "اكتشف الأجهزة الأنيقة المصممة لحياتك اليومية. تجربة تجارة إلكترونية حديثة .",
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
      "currency.name": "دينار جزائري",

      // Admin UI translations
      "admin.title": "لوحة الإدارة",
      "admin.dashboard": "لوحة التحكم",
      "admin.orders": "الطلبات",
      "admin.products": "المنتجات",
      "admin.categories": "الفئات",
      "admin.logout": "تسجيل الخروج",
      "admin.welcome": "مرحباً بعودتك",
      "admin.totalProducts": "إجمالي المنتجات",
      "admin.totalCategories": "إجمالي الفئات",
      "admin.totalOrders": "إجمالي الطلبات",
      "admin.totalRevenue": "إجمالي الإيرادات",
      "admin.monthlyRevenue": "الإيرادات الشهرية",
      "admin.orderCompletion": "معدل إتمام الطلبات",
      "admin.recentOrders": "الطلبات الحديثة",
      "admin.noRecentOrders": "لا توجد طلبات حديثة",
      "admin.ordersCompleted": "طلبات مكتملة",
      "admin.loading": "جاري تحميل بيانات لوحة التحكم...",
      
      // Authentication
      "auth.welcomeBack": "مرحباً بعودتك",
      "auth.signInSubtitle": "سجل دخولك لحساب الإدارة لإدارة متجرك",
      "auth.email": "عنوان البريد الإلكتروني",
      "auth.password": "كلمة المرور",
      "auth.emailPlaceholder": "أدخل بريدك الإلكتروني",
      "auth.passwordPlaceholder": "أدخل كلمة المرور",
      "auth.fillAllFields": "يرجى ملء جميع الحقول",
      "auth.secureAccess": "وصول آمن للمدير مع تشفير المصادقة",
      "auth.needHelp": "تحتاج مساعدة في الوصول لحسابك؟ اتصل بالدعم.",
      
      // Orders management
      "orders.title": "إدارة الطلبات",
      "orders.orderId": "رقم الطلب",
      "orders.totalPrice": "السعر الإجمالي",
      "orders.status": "الحالة",
      "orders.createdAt": "تاريخ الإنشاء",
      "orders.customer": "العميل",
      "orders.actions": "الإجراءات",
      "orders.details": "التفاصيل",
      "orders.confirmDelete": "هل أنت متأكد من حذف هذا الطلب؟",
      "orders.statuses.pending": "قيد الانتظار",
      "orders.statuses.paid": "مدفوع",
      "orders.statuses.shipped": "تم الشحن",
      "orders.statuses.delivered": "تم التسليم",
      "orders.statuses.cancelled": "ملغى",
      
      // Categories management
      "categories.title": "إدارة الفئات",
      "categories.addNew": "إضافة فئة جديدة",
      "categories.edit": "تعديل",
      "categories.delete": "حذف",
      "categories.confirmDelete": "هل أنت متأكد من حذف هذه الفئة؟",
      "categories.name": "اسم الفئة",
      "categories.description": "الوصف",
      "categories.namePlaceholder": "أدخل اسم الفئة",
      "categories.descriptionPlaceholder": "أدخل وصف الفئة (اختياري)",
      "categories.create": "إنشاء فئة",
      "categories.update": "تحديث الفئة",
      "categories.cancel": "إلغاء",
      "categories.loading": "جاري تحميل الفئات...",
      "categories.noCategories": "لم يتم العثور على فئات. قم بإنشاء فئتك الأولى للبدء.",
      
      // Support page translations
      "support.title": "دعم العملاء",
      "support.subtitle": "كيف يمكننا مساعدتك اليوم؟",
      "support.contact": "اتصل بنا",
      "support.faq": "الأسئلة الشائعة",
      "support.shipping": "معلومات الشحن",
      "support.returns": "الإرجاع",
      
      // FAQ translations
      "faq.title": "الأسئلة الشائعة",
      "faq.subtitle": "احصل على إجابات سريعة للأسئلة الأكثر شيوعاً حول شوب مايت الجزائر",
      "faq.general": "أسئلة عامة",
      "faq.orders": "الطلبات والدفع",
      "faq.products": "المنتجات والضمان",
      
      "faq.whatIsShopmate": "ما هو شوب مايت الجزائر؟",
      "faq.whatIsShopmate.answer": "شوب مايت الجزائر هو منصة تجارة إلكترونية حديثة متخصصة في الإلكترونيات والإكسسوارات والأجهزة عالية الجودة. نخدم العملاء في جميع الولايات الـ58 في الجزائر مع توصيل سريع وخدمة عملاء ممتازة.",
      
      "faq.deliveryWilayas": "هل تقومون بالتوصيل لجميع ولايات الجزائر؟",
      "faq.deliveryWilayas.answer": "نعم! نقوم بالتوصيل لجميع الولايات الـ58 في الجزائر. قد تختلف أوقات وتكاليف التوصيل حسب موقعك، لكننا نضمن التغطية على مستوى البلاد.",
      
      "faq.languages": "ما هي اللغات التي تدعمونها؟",
      "faq.languages.answer": "موقعنا ودعم العملاء متاح بثلاث لغات: العربية والفرنسية والإنجليزية. يمكنك تغيير اللغة باستخدام محدد اللغة على موقعنا.",
      
      "faq.paymentMethods": "ما هي طرق الدفع التي تقبلونها؟",
      "faq.paymentMethods.answer": "نقبل طرق دفع متنوعة تشمل الدفع عند التسليم والتحويلات البنكية وبطاقات الائتمان الرئيسية. جميع طرق الدفع معروضة بوضوح عند الدفع.",
      
      "faq.trackOrder": "كيف يمكنني تتبع طلبي؟",
      "faq.trackOrder.answer": "بمجرد شحن طلبك، ستتلقى رقم تتبع عبر البريد الإلكتروني أو الرسائل النصية. يمكنك استخدام هذا الرقم لتتبع طردك من خلال شركاء التوصيل أو الاتصال بخدمة العملاء للحصول على التحديثات.",
      
      "faq.cancelOrder": "هل يمكنني إلغاء أو تعديل طلبي؟",
      "faq.cancelOrder.answer": "يمكنك إلغاء أو تعديل طلبك خلال ساعتين من تقديمه. بعد ذلك، إذا لم يتم شحن الطلب بعد، اتصل بخدمة العملاء فوراً. بمجرد الشحن، قد لا يكون الإلغاء ممكناً.",
      
      "faq.warranty": "هل تأتي منتجاتكم مع ضمان؟",
      "faq.warranty.answer": "نعم! جميع منتجاتنا تأتي مع ضمان الشركة المصنعة. فترة الضمان تختلف حسب المنتج وهي مذكورة بوضوح في صفحة كل منتج. نوفر أيضاً دعم ما بعد البيع لجميع مطالبات الضمان.",
      
      "faq.authentic": "هل منتجاتكم أصلية؟",
      "faq.authentic.answer": "بالطبع! نبيع فقط منتجات أصلية من موزعين وشركات مصنعة معتمدة. جميع منتجاتنا أصلية وتأتي مع وثائق وضمان مناسب.",
      
      // Shipping information
      "shipping.title": "معلومات الشحن",
      "shipping.subtitle": "توصيل سريع على مستوى البلاد",
      "shipping.coverage": "تغطية الشحن",
      "shipping.coverageText": "نفخر بخدمة العملاء في جميع الولايات الـ58 في الجزائر. شبكة التوصيل لدينا تضمن أنه سواء كنت في الجزائر العاصمة أو قسنطينة أو وهران أو سطيف أو أي ولاية أخرى، سيصلك طلبك بأمان وفي الوقت المحدد.",
      "shipping.deliveryTimes": "أوقات وتكاليف التوصيل",
      "shipping.wilayaType": "نوع الولاية",
      "shipping.deliveryTime": "وقت التوصيل",
      "shipping.shippingCost": "تكلفة الشحن",
      "shipping.examples": "أمثلة",
      "shipping.majorCities": "المدن الكبرى",
      "shipping.regionalCenters": "المراكز الإقليمية",
      "shipping.remoteAreas": "المناطق النائية",
      "shipping.freeShipping": "شحن مجاني",
      "shipping.orderProcessing": "معالجة الطلب",
      "shipping.partners": "شركاء الشحن",
      "shipping.notes": "ملاحظات شحن مهمة",
      
      // Returns policy
      "returns.title": "الإرجاع والاسترداد",
      "returns.subtitle": "سياسة إرجاع لمدة 7 أيام",
      "returns.policy": "نريدك أن تكون راضياً تماماً عن مشترياتك. إذا لم تكن سعيداً، نوفر إرجاع سهل خلال 7 أيام.",
      "returns.eligibility": "أهلية الإرجاع",
      "returns.eligible": "مؤهل للإرجاع",
      "returns.notEligible": "غير مؤهل للإرجاع",
      "returns.process": "كيفية إرجاع منتج",
      "returns.contactUs": "اتصل بنا",
      "returns.authorization": "احصل على تصريح الإرجاع",
      "returns.packShip": "اربط واشحن",
      "returns.refundProcessed": "تم معالجة الاسترداد",
      "returns.refundInfo": "معلومات الاسترداد",
      "returns.defective": "منتجات معيبة أو تالفة",
      "returns.exchange": "سياسة التبديل"
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
      "nav.contact": "Contactez-nous",
      "nav.language": "Langue",
      "nav.theme": "Basculer le Thème",
      
      // Hero Section
      "hero.title": "Découvrez des équipements élégants conçus pour votre quotidien.",
      "hero.subtitle": "Beau, réactif et rapide. Filtrez, recherchez et ajoutez au panier .",
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
      "cart.emptySubtext": "Ajoutez des produits pour commencer",
      "cart.subtotal": "Sous-total",
      "cart.checkout": "Commander",
      "cart.emptyCart": "Vider le panier",
      "cart.remove": "Retirer",
      "cart.each": "chaque",
      "cart.continueShopping": "Continuer vos achats",
      "cart.deliveryTax": "Taxe de livraison",

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
      "order.print": "Imprimer la commande",
      "order.close": "Fermer",
      
      // Order Confirmation
      "order.confirmationTitle": "Commande confirmée !",
      "order.confirmationSubtitle": "Merci pour votre achat. Votre commande a été passée avec succès.",
      "order.summary": "Résumé de la commande",
      "order.customerInfo": "Informations sur le client",
      "order.deliveryTo": "Livraison à",
      "order.item": "article",
      "order.qrCode": "Code QR de la commande",
      "order.qrCodeDescription": "Montrez ce code QR pour vérification de la commande",
      "order.guestOrderNotice": "Commande invité",
      "order.guestOrderDescription": "Veuillez enregistrer ces informations pour le suivi de la commande. Vous pouvez nous contacter avec votre ID de commande pour des mises à jour.",
      "order.copyDetails": "Copier les détails",
      "order.copiedToClipboard": "Détails de la commande copiés dans le presse-papiers !",
      "order.copyFailed": "Échec de la copie des détails de la commande",
      
      // Customer information
      "customer.name": "Customer",
      "customer.email": "Email",
      "customer.phone": "Phone",
      "customer.wilaya": "Delivery Wilaya",
      
      // Contact
      "contact.title": "Contactez-nous",
      "contact.subtitle": "Vous avez des questions sur nos produits ou besoin d'aide ? Nous aimerions vous entendre.",
      "contact.email": "E-mail",
      "contact.phone": "Téléphone",
      "contact.office": "Bureau",
      "contact.hours": "Lun-Ven 9h-16h",
      "contact.yourName": "Votre nom",
      "contact.yourEmail": "Votre e-mail",
      "contact.subject": "Sujet",
      "contact.message": "Votre message",
      "contact.send": "Envoyer le message",
      "contact.sending": "Envoi en cours...",
      
      // Contact Form
      "contact.success": "Merci ! Votre message a été envoyé avec succès.",
      "contact.error": "Désolé, il y a eu une erreur lors de l'envoi de votre message. Veuillez réessayer.",
      "contact.successTitle": "Message envoyé !",
      "contact.successMessage": "Merci de nous avoir contactés ! Nous avons reçu votre message et nous vous répondrons bientôt.",
      "contact.messageSummary": "Résumé du message :",
      "contact.responseTime": "Nous répondons généralement dans les 24 heures pendant les jours ouvrables.",
      "contact.close": "Fermer",
      
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
      "footer.description": "Découvrez des équipements élégants conçus pour votre quotidien. Expérience e-commerce moderne .",
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
      "currency.name": "Dinar Algérien",

      // Admin UI translations
      "admin.title": "Panneau d'Administration",
      "admin.dashboard": "Tableau de Bord",
      "admin.orders": "Commandes",
      "admin.products": "Produits",
      "admin.categories": "Catégories",
      "admin.logout": "Déconnexion",
      "admin.welcome": "Bon retour",
      "admin.totalProducts": "Total Produits",
      "admin.totalCategories": "Total Catégories",
      "admin.totalOrders": "Total Commandes",
      "admin.totalRevenue": "Chiffre d'Affaires Total",
      "admin.monthlyRevenue": "Revenus Mensuels",
      "admin.orderCompletion": "Taux de Completion des Commandes",
      "admin.recentOrders": "Commandes Récentes",
      "admin.noRecentOrders": "Aucune commande récente",
      "admin.ordersCompleted": "commandes terminées",
      "admin.loading": "Chargement des données du tableau de bord...",
      
      // Authentication
      "auth.welcomeBack": "Bon Retour",
      "auth.signInSubtitle": "Connectez-vous à votre compte admin pour gérer votre boutique",
      "auth.email": "Adresse E-mail",
      "auth.password": "Mot de Passe",
      "auth.emailPlaceholder": "Entrez votre e-mail",
      "auth.passwordPlaceholder": "Entrez votre mot de passe",
      "auth.fillAllFields": "Veuillez remplir tous les champs",
      "auth.secureAccess": "Accès admin sécurisé avec authentification chiffrée",
      "auth.needHelp": "Besoin d'aide pour accéder à votre compte? Contactez le support.",
      
      // Orders management
      "orders.title": "Gestion des Commandes",
      "orders.orderId": "ID Commande",
      "orders.totalPrice": "Prix Total",
      "orders.status": "Statut",
      "orders.createdAt": "Créé le",
      "orders.customer": "Client",
      "orders.actions": "Actions",
      "orders.details": "Détails",
      "orders.confirmDelete": "Êtes-vous sûr de vouloir supprimer cette commande?",
      "orders.statuses.pending": "En attente",
      "orders.statuses.paid": "Payé",
      "orders.statuses.shipped": "Expédié",
      "orders.statuses.delivered": "Livré",
      "orders.statuses.cancelled": "Annulé",
      
      // Categories management
      "categories.title": "Gestion des Catégories",
      "categories.addNew": "Ajouter Nouvelle Catégorie",
      "categories.edit": "Modifier",
      "categories.delete": "Supprimer",
      "categories.confirmDelete": "Êtes-vous sûr de vouloir supprimer cette catégorie?",
      "categories.name": "Nom de la Catégorie",
      "categories.description": "Description",
      "categories.namePlaceholder": "Entrez le nom de la catégorie",
      "categories.descriptionPlaceholder": "Entrez la description de la catégorie (optionnel)",
      "categories.create": "Créer la Catégorie",
      "categories.update": "Mettre à Jour la Catégorie",
      "categories.cancel": "Annuler",
      "categories.loading": "Chargement des catégories...",
      "categories.noCategories": "Aucune catégorie trouvée. Créez votre première catégorie pour commencer.",
      
      // Support page translations
      "support.title": "Support Client",
      "support.subtitle": "Comment pouvons-nous vous aider aujourd'hui?",
      "support.contact": "Contactez-nous",
      "support.faq": "FAQ",
      "support.shipping": "Infos Livraison",
      "support.returns": "Retours",
      
      // FAQ translations
      "faq.title": "Questions Fréquemment Posées",
      "faq.subtitle": "Trouvez des réponses rapides aux questions les plus courantes sur ShopMate Algérie",
      "faq.general": "Questions Générales",
      "faq.orders": "Commandes et Paiement",
      "faq.products": "Produits et Garantie",
      
      "faq.whatIsShopmate": "Qu'est-ce que ShopMate Algérie?",
      "faq.whatIsShopmate.answer": "ShopMate Algérie est une plateforme e-commerce moderne spécialisée dans l'électronique de qualité, les accessoires et gadgets. Nous servons les clients dans les 58 wilayas d'Algérie avec une livraison rapide et un excellent service client.",
      
      "faq.deliveryWilayas": "Livrez-vous dans toutes les wilayas d'Algérie?",
      "faq.deliveryWilayas.answer": "Oui! Nous livrons dans les 58 wilayas d'Algérie. Les délais et coûts de livraison peuvent varier selon votre localisation, mais nous assurons une couverture nationale.",
      
      "faq.languages": "Quelles langues supportez-vous?",
      "faq.languages.answer": "Notre site web et support client sont disponibles en trois langues: Arabe, Français et Anglais. Vous pouvez changer de langue en utilisant le sélecteur de langue sur notre site.",
      
      "faq.paymentMethods": "Quels modes de paiement acceptez-vous?",
      "faq.paymentMethods.answer": "Nous acceptons divers modes de paiement incluant le paiement à la livraison (COD), virements bancaires et cartes de crédit principales. Tous les modes de paiement sont clairement affichés lors du checkout.",
      
      "faq.trackOrder": "Comment puis-je suivre ma commande?",
      "faq.trackOrder.answer": "Une fois votre commande expédiée, vous recevrez un numéro de suivi par e-mail ou SMS. Vous pouvez utiliser ce numéro pour suivre votre colis via nos partenaires de livraison ou contacter notre service client pour des mises à jour.",
      
      "faq.cancelOrder": "Puis-je annuler ou modifier ma commande?",
      "faq.cancelOrder.answer": "Vous pouvez annuler ou modifier votre commande dans les 2 heures suivant le placement. Après cela, si la commande n'a pas encore été expédiée, contactez immédiatement notre service client. Une fois expédiée, l'annulation peut ne pas être possible.",
      
      "faq.warranty": "Vos produits sont-ils garantis?",
      "faq.warranty.answer": "Oui! Tous nos produits viennent avec une garantie fabricant. La période de garantie varie selon le produit et est clairement indiquée sur chaque page produit. Nous fournissons aussi un support après-vente pour toutes les réclamations de garantie.",
      
      "faq.authentic": "Vos produits sont-ils authentiques?",
      "faq.authentic.answer": "Absolument! Nous vendons uniquement des produits authentiques de distributeurs et fabricants autorisés. Tous nos produits sont genuins et viennent avec une documentation et garantie appropriées.",
      
      // Shipping information
      "shipping.title": "Informations de Livraison",
      "shipping.subtitle": "Livraison Rapide Nationale",
      "shipping.coverage": "Couverture de Livraison",
      "shipping.coverageText": "Nous sommes fiers de servir les clients dans les 58 wilayas d'Algérie. Notre réseau de livraison assure que que vous soyez à Alger, Constantine, Oran, Sétif ou toute autre wilaya, votre commande vous parviendra en sécurité et à temps.",
      "shipping.deliveryTimes": "Délais et Coûts de Livraison",
      "shipping.wilayaType": "Type de Wilaya",
      "shipping.deliveryTime": "Délai de Livraison",
      "shipping.shippingCost": "Coût d'Expédition",
      "shipping.examples": "Exemples",
      "shipping.majorCities": "Grandes Villes",
      "shipping.regionalCenters": "Centres Régionaux",
      "shipping.remoteAreas": "Zones Éloignées",
      "shipping.freeShipping": "Livraison Gratuite",
      "shipping.orderProcessing": "Traitement de Commande",
      "shipping.partners": "Partenaires d'Expédition",
      "shipping.notes": "Notes Importantes sur l'Expédition",
      
      // Returns policy
      "returns.title": "Retours et Remboursements",
      "returns.subtitle": "Politique de Retour de 7 Jours",
      "returns.policy": "Nous voulons que vous soyez complètement satisfait de votre achat. Si vous n'êtes pas content, nous offrons des retours faciles dans les 7 jours.",
      "returns.eligibility": "Éligibilité au Retour",
      "returns.eligible": "Éligible au Retour",
      "returns.notEligible": "Non Éligible au Retour",
      "returns.process": "Comment Retourner un Article",
      "returns.contactUs": "Contactez-nous",
      "returns.authorization": "Obtenez l'Autorisation de Retour",
      "returns.packShip": "Emballez et Expédiez",
      "returns.refundProcessed": "Remboursement Traité",
      "returns.refundInfo": "Informations de Remboursement",
      "returns.defective": "Articles Défectueux ou Endommagés",
      "returns.exchange": "Politique d'Échange"
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
