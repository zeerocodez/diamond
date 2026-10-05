import { Order, Product, ClothingSize } from '../types';
import { syncOrderToSupabase } from './supabase';

const PRODUCTS_STORAGE_KEY = 'sdb_products_v1';
const ORDERS_STORAGE_KEY = 'sdb_orders_v1';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sdb-blazer-victoria',
    name: 'The Victoria Double-Breasted Emerald Blazer',
    description: 'Impeccably tailored from Super 130s Italian worsted wool in Serena Diamond’s signature emerald green. Features hand-stitched peak lapels, contour darting for an executive silhouette, and bespoke brushed champagne-gold buttons cast in Italy.',
    price: 285000,
    category: 'Tailored Blazers',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 14,
    images: ['/images/product_emerald_blazer_1790771215550.jpg'],
    fabric: 'Super 130s Italian Worsted Wool, Pure Silk Cupro Lining',
    cut: 'Fitted Structured Hourglass Tailoring',
    care: 'Specialist Dry Clean Only. Warm iron with press cloth.',
    features: [
      'Dual-vented back for executive ease and seating posture',
      'Interior silk breast pocket for boardroom presentation pointers & cards',
      'Hand-finished pick-stitching along lapel roll',
      'Complimentary atelier bespoke alteration in Victoria Island, Lagos'
    ],
    inStock: true,
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'sdb-dress-ikoyi',
    name: 'The Ikoyi Crepe Sheath Dress',
    description: 'A masterpiece of understated corporate authority. Cut from heavy architectural Japanese bonded crepe with an asymmetric sculpted neckline and waist-defining obi-cinch belt. Engineered for all-day boardroom comfort under tropical air-conditioning.',
    price: 225000,
    category: 'Sheath Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 18,
    images: ['/images/product_sheath_dress_1790771226613.jpg'],
    fabric: 'Architectural Japanese Bonded Crepe with Micro-Stretch',
    cut: 'Midi-length Contoured Column Fit',
    care: 'Dry Clean Only. Steam gently.',
    features: [
      'Concealed back gold zipper with extended pull',
      'Bra-retaining discreet shoulder snaps',
      'Rear kick pleat with reinforced bar-tacks for fluid boardroom mobility',
      'Anti-wrinkle travel grade fabric for Lagos-to-London executive flights'
    ],
    inStock: true,
    createdAt: '2025-01-12T11:30:00Z',
  },
  {
    id: 'sdb-suit-eko',
    name: 'The Eko Executive Three-Piece Power Suit',
    description: 'Command the boardroom with undeniable presence. This three-piece tailored ensemble comprises a razor-sharp single-breasted jacket, high-coverage tailored waistcoat, and pleated high-rise trousers. Finished with discreet gold filament pinstripes.',
    price: 420000,
    category: 'Power Suits',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 8,
    images: ['/images/product_power_suit_1790771238788.jpg'],
    fabric: 'English Wool Serge with Subtle Gold Lurex Pinstripe',
    cut: 'Architectural Shoulders with Fluid Tapered Trouser',
    care: 'Specialist Dry Clean Only.',
    features: [
      'Includes jacket, tailored waistcoat, and pleated trouser',
      'Adjustable back cinch buckle on waistcoat for custom fit',
      'Deep functional trouser pockets designed to fit flagship smartphones',
      'Reinforced trouser hem tape to preserve immaculate break over stilettos'
    ],
    inStock: true,
    createdAt: '2025-01-15T09:15:00Z',
  },
  {
    id: 'sdb-trousers-marina',
    name: 'The Marina Wide-Leg Trousers & Silk Drape Set',
    description: 'Fluid luxury meets uncompromising tailoring. High-waisted wide-leg trousers in rich forest emerald paired with a lustrous champagne mulberry silk cowl blouse. Transitions seamlessly from quarterly earnings calls to private members club dinners.',
    price: 260000,
    category: 'Luxury Trousers & Silk',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 12,
    images: ['/images/product_luxury_trousers_1790771249867.jpg'],
    fabric: '22-Momme Pure Mulberry Silk Blouse & Tropical Wool Gabardine Trousers',
    cut: 'High-Waist Extended Waistband with Flowing Palazzo Cut',
    care: 'Silk: Hand Wash Cold or Dry Clean. Trousers: Dry Clean.',
    features: [
      'Curved waistband designed specifically for African hip-to-waist ratios',
      'Internal hook-and-bar extension with stay button',
      'Lustrous champagne silk with naturally breathable thermo-regulation',
      'Generous 2.5-inch inner hem allowance for custom heel height adaptation'
    ],
    inStock: true,
    createdAt: '2025-01-18T14:45:00Z',
  },
  {
    id: 'sdb-blazer-cape-banana',
    name: 'The Banana Island Asymmetric Cape Gown',
    description: 'Architectural evening and corporate gala gown. Features a tailored structured blazer bodice on one side cascading into an asymmetric floor-grazing cape with champagne satin lapel facing. Worn by Lagos business icons at prestigious award galas.',
    price: 360000,
    category: 'Sheath Dresses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 6,
    images: ['/images/product_sheath_dress_1790771226613.jpg'],
    fabric: 'Heavy Crepe de Chine with Champagne Duchess Satin Accents',
    cut: 'Sculptural Asymmetric Fit with Dramatic Cape Drapery',
    care: 'Haute Couture Specialist Dry Clean Only.',
    features: [
      'Hand-draped cape that glides during movement',
      'Built-in boning corset for flawless poise and structure',
      'Concealed invisible zip closure',
      'Limited production run: each garment numbered by our Master Tailor'
    ],
    inStock: true,
    createdAt: '2025-01-20T16:00:00Z',
  },
  {
    id: 'sdb-suit-ikoyi-monochrome',
    name: 'The Capital Executive Tuxedo Blazer in Ivory',
    description: 'Radiant champagne-ivory tuxedo jacket featuring silk satin shawl lapels and single horn button. Cut to skim the hips elegantly over tailored trousers or as a statement piece over corporate shift dresses.',
    price: 310000,
    category: 'Tailored Blazers',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 10,
    images: ['/images/product_emerald_blazer_1790771215550.jpg'],
    fabric: 'Italian Wool-Silk Blend with Silk Satin Shawl Facing',
    cut: 'Modern Tailored Tuxedo Silhouette',
    care: 'Dry Clean Only. Keep in breathable garment bag.',
    features: [
      'Silk satin-faced welt pockets',
      'Satin-covered fabric buttons',
      'Internal embroidered Serena Diamond gold label',
      'Includes Serena Diamond breathable garment carrier'
    ],
    inStock: true,
    createdAt: '2025-01-22T08:30:00Z',
  },
  {
    id: 'sdb-jacket-asooke-tuxedo',
    name: 'The Alara Hand-Woven Aso-Oke Peplum Tuxedo',
    description: 'An exquisite synthesis of Yoruba weaving heritage and sharp executive tailoring. Crafted from midnight black worsted wool sculpted with authentic hand-loomed metallic gold and deep navy Aso-Oke weaves along the architectural peak lapel, flared peplum waist, and cuff facing. Designed for high-stakes boardrooms, international trade delegations, and African state dinners.',
    price: 345000,
    category: 'African Heritage Tailoring',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 9,
    images: ['/images/asooke_tuxedo_jacket_1790773988544.jpg'],
    fabric: 'Hand-Loomed Yoruba Metallic Aso-Oke & Super 140s Worsted Wool with Silk Lining',
    cut: 'Sculpted Peplum Tuxedo with Architectural Peak Lapels',
    care: 'Specialist Dry Clean Only. Store on wooden wide-shoulder hanger.',
    features: [
      'Authentic artisanal hand-loomed Aso-Oke crafted by master weavers in Western Nigeria',
      'Hand-cast 24-karat gold-dipped geometric crested buttons',
      'Internal silk passport pocket and discreet fountain pen holster',
      'Hourglass peplum sculpting specifically engineered for commanding executive posture',
      'Complimentary bespoke shoulder and waist fitting at Victoria Island Atelier'
    ],
    inStock: true,
    createdAt: '2025-01-25T10:00:00Z',
  },
  {
    id: 'sdb-dress-adire-capelet',
    name: 'The Ile-Ife Artisan Adire Silk Capelet Sheath',
    description: 'Modern African corporate majesty. Pure Italian silk faille hand-dyed using ancestral Abeokuta Adire resist-dye techniques in minimalist obsidian indigo and terracotta geometric motifs. Features a floating architectural silk organza capelet that drapes effortlessly over the shoulders for seamless boardroom grace.',
    price: 295000,
    category: 'African Heritage Tailoring',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 11,
    images: ['/images/adire_capelet_dress_1790774002306.jpg'],
    fabric: 'Artisanal Hand-Resist Adire Pure Silk Faille with Silk Organza Capelet',
    cut: 'Contoured Column Silhouette with Floating Structured Shoulder Cape',
    care: 'Haute Couture Dry Clean Only. Steam gently from reverse side.',
    features: [
      'Each textile individually hand-dyed in Ogun State; no two motifs are identical',
      'Concealed center-back zipper with extended silk pull',
      'Floating silk organza capelet provides light coverage for air-conditioned executive suites',
      'Fully lined in breathable mulberry silk habotai'
    ],
    inStock: true,
    createdAt: '2025-01-26T12:30:00Z',
  },
  {
    id: 'sdb-robe-boubou-executive',
    name: 'The Sahel Executive Power Boubou & Leather Cinch',
    description: 'A contemporary corporate reimagining of the iconic West African Grand Boubou. Tailored from structured obsidian black damask and lightweight linen-crepe with intricate hand-embroidered bronze and champagne gold geometric threadwork adorning the mandarin collar and hidden-button placket. Includes a detachable emerald green Italian calfskin cinch belt.',
    price: 380000,
    category: 'African Heritage Tailoring',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 7,
    images: ['/images/executive_boubou_robe_1790774015050.jpg'],
    fabric: 'Heavyweight Jacquard Damask with High-Twist Crisp Linen-Crepe',
    cut: 'Majestic Column Cut with Tailored Leather Waist Definition',
    care: 'Specialist Dry Clean Only.',
    features: [
      'Hand-embroidered Hausa & Sahelian geometric bullion stitchwork on chest placket',
      'Includes detachable tailored emerald calfskin corset belt with gold brushed buckle',
      'Concealed deep side-seam pockets tailored for mobile devices and notebooks',
      'Designed for Pan-African corporate summits, diplomatic galas, and executive retreats'
    ],
    inStock: true,
    createdAt: '2025-01-28T14:15:00Z',
  },
  {
    id: 'sdb-trench-ankara-bisi',
    name: 'The Victoria Island Ankara-Inlaid Executive Trench',
    description: 'The quintessential global executive outerwear elevated with subtle African pride. Sandstone beige water-resistant Italian gabardine featuring concealed African wax geometric silk facing along the under-collar, storm flaps, and turn-back cuff tabs. The African design reveals itself subtly in stride and movement.',
    price: 350000,
    category: 'African Heritage Tailoring',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock_quantity: 10,
    images: ['/images/ankara_trench_coat_1790774027334.jpg'],
    fabric: 'Weather-Resistant Italian Cotton Gabardine with Pure Silk Ankara Inlays',
    cut: 'Double-Breasted Classic Fit with Defined Gold-Buckle Belt',
    care: 'Dry Clean Only.',
    features: [
      'Concealed African wax geometric motifs revealed when collar is popped or cuffs are cuffed',
      'Horn buttons etched with Serena Diamond Bespoke insignia',
      'Epaulettes, storm flap, and deep fleece-lined welt pockets',
      'Water-repellent finish suitable for Lagos coastal rains and international travel'
    ],
    inStock: true,
    createdAt: '2025-01-29T16:00:00Z',
  },
  {
    id: 'sdb-plus-dress-omolara',
    name: 'The Omolara Sculpted Silk-Crepe Column Gown',
    description: 'Masterfully engineered to celebrate voluptuous corporate elegance. Cut from heavyweight matte double-silk crepe with architectural vertical princess darts that elongate the silhouette, a draped surplice crossover bust that flatters without gaping, and a signature brushed 24k gold filigree waist cincher.',
    price: 320000,
    category: 'Curated Plus & Silhouette',
    sizes: ['L', 'XL', '1X', '2X', '3X', '4X'],
    stock_quantity: 12,
    images: ['/images/plussize_column_dress_1790774277671.jpg'],
    fabric: 'Heavyweight 4-Ply Italian Silk-Crepe & Stretch Cupro Lining',
    cut: 'Hourglass Sculpted Column Fit with Draped Surplice Neckline',
    care: 'Haute Couture Dry Clean Only.',
    features: [
      'Internal boned corset support engineered for full busts (cup sizes C through G)',
      'Signature brushed 24k gold filigree waist cincher included',
      'Reinforced side-zip with hook-and-eye safety latch',
      'Vertical French seams designed to lengthen the visual line',
      'Complimentary fitting adjustment at Victoria Island Atelier'
    ],
    inStock: true,
    isPlusCollection: true,
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'sdb-plus-suit-moremi',
    name: 'The Moremi Peplum Power Tuxedo & Palazzo Set',
    description: 'Executive grandeur tailored for curvy female directors. Midnight navy Super 130s English wool featuring a sculpted double-breasted peplum jacket that flares gracefully over the hips, paired with high-waisted pleated palazzo trousers. Accentuated with subtle hand-woven metallic gold Aso-Oke peak lapel borders.',
    price: 440000,
    category: 'Curated Plus & Silhouette',
    sizes: ['L', 'XL', '1X', '2X', '3X', '4X'],
    stock_quantity: 8,
    images: ['/images/plussize_peplum_suit_1790774290555.jpg'],
    fabric: 'Super 130s English Worsted Wool & Hand-Loomed Gold Aso-Oke Trim',
    cut: 'Structured Peplum Jacket with High-Rise Flowing Palazzo Trouser',
    care: 'Specialist Dry Clean Only.',
    features: [
      'Extended contoured peplum tailored to drape smoothly over hips with zero pull',
      'Curved contour waistband prevents gaping at the lower back',
      'Gold-dipped hammered buttons cast in Milan',
      'Pleated trouser legs create a fluid, statuesque stride'
    ],
    inStock: true,
    isPlusCollection: true,
    createdAt: '2025-02-02T11:30:00Z',
  },
  {
    id: 'sdb-plus-gown-kaftan-sapphire',
    name: 'The Cleopatra Draped Asymmetric Kaftan-Tuxedo',
    description: 'An authoritative blend of traditional African regal drapery and sharp British bespoke tailoring. Features a sharp peak lapel tuxedo on the right side melting into a floor-sweeping accordion-pleated pure silk cape on the left, finished with delicate gold bullion embroidery along the cuff and hem.',
    price: 395000,
    category: 'Curated Plus & Silhouette',
    sizes: ['XL', '1X', '2X', '3X', '4X'],
    stock_quantity: 6,
    images: ['/images/plussize_kaftan_tuxedo_1790774302051.jpg'],
    fabric: 'Imperial Sapphire Double Silk Georgette & Worsted Wool Serge',
    cut: 'Asymmetric Architectural Tuxedo with Fluid Cascade Cape',
    care: 'Dry Clean Only. Keep in breathable garment carrier.',
    features: [
      'Harmonizes structured formal authority with regal comfort',
      'Hand-embroidered gold wire bullion threadwork along the cuffs',
      'Breathable silk georgette ideal for tropical evening galas and diplomatic dinners',
      'Limited edition numbered series'
    ],
    inStock: true,
    isPlusCollection: true,
    createdAt: '2025-02-03T14:00:00Z',
  },
  {
    id: 'sdb-plus-trench-wrap-camel',
    name: 'The Ikoyi Executive Pleated Wrap Trench & Trouser',
    description: 'Effortless luxury designed to celebrate statuesque proportions. Tailored in camel Italian wool-twill with terracotta silk accents, featuring an elongated shawl collar, generous crossover front closure that eliminates bust strain, and a wide matching sash belt that sculpts the waist effortlessly.',
    price: 360000,
    category: 'Curated Plus & Silhouette',
    sizes: ['L', 'XL', '1X', '2X', '3X', '4X'],
    stock_quantity: 10,
    images: ['/images/plussize_wrap_trench_1790774312581.jpg'],
    fabric: 'Mid-Weight Italian Virgin Wool Twill with Pure Silk Lining',
    cut: 'Relaxed Wrap Tailoring with Wide-Leg Fluid Trouser',
    care: 'Dry Clean Only.',
    features: [
      'Deep crossover wrap accommodates varied bust measurements comfortably',
      'Double internal stay buttons keep the front securely closed when moving',
      'Includes extra-wide sash belt with topstitch detailing',
      'Silky lined deep slant pockets'
    ],
    inStock: true,
    isPlusCollection: true,
    createdAt: '2025-02-04T16:15:00Z',
  },
];

const INITIAL_DEMO_ORDER: Order = {
  id: 'SDB-72419',
  user_id: 'usr_folashade_adeleke',
  customer_name: 'Dr. Folashade Adeleke',
  customer_email: 'folashade.adeleke@lagoscapital.ng',
  customer_phone: '+234 803 234 8901',
  subtotal: 510000,
  shipping_fee: 0,
  total_amount: 510000,
  payment_status: 'paid',
  order_status: 'tailoring',
  payment_method: 'Paystack Direct Bank Transfer (Stanbic IBTC)',
  mailgun_status: 'sent',
  mailgun_message_id: 'mg-msg-72419-ikoyi',
  created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  shipping_address: {
    fullName: 'Dr. Folashade Adeleke',
    email: 'folashade.adeleke@lagoscapital.ng',
    phone: '+234 803 234 8901',
    streetAddress: 'Penthouse 4, Kingsway Tower, Alfred Rewane Road',
    area: 'Ikoyi',
    stateOrCity: 'Lagos',
    deliveryNotes: 'Deliver to Executive Reception on 12th Floor.',
  },
  items: [
    {
      id: 'itm-1',
      order_id: 'SDB-72419',
      product_id: 'sdb-blazer-victoria',
      product_name: 'The Victoria Double-Breasted Emerald Blazer',
      product_image: '/images/product_emerald_blazer_1790771215550.jpg',
      size: 'M',
      quantity: 1,
      unit_price: 285000,
    },
    {
      id: 'itm-2',
      order_id: 'SDB-72419',
      product_id: 'sdb-dress-ikoyi',
      product_name: 'The Ikoyi Crepe Sheath Dress',
      product_image: '/images/product_sheath_dress_1790771226613.jpg',
      size: 'M',
      quantity: 1,
      unit_price: 225000,
    },
  ],
};

class DatabaseService {
  private products: Product[] = [];
  private orders: Order[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        const parsed: Product[] = JSON.parse(storedProducts);
        // Normalize image paths to ensure production public compatibility
        const normalized = parsed.map((p) => ({
          ...p,
          images: p.images.map((img) =>
            img.startsWith('/src/assets/images/') ? img.replace('/src/assets/images/', '/images/') : img
          ),
        }));
        // Merge any new products from INITIAL_PRODUCTS that aren't in localStorage yet
        const existingIds = new Set(normalized.map((p) => p.id));
        const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
        this.products = [...normalized, ...missing];
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
      } else {
        this.products = INITIAL_PRODUCTS;
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      }

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        this.orders = JSON.parse(storedOrders);
      } else {
        this.orders = [INITIAL_DEMO_ORDER];
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
      }
    } catch {
      this.products = INITIAL_PRODUCTS;
      this.orders = [INITIAL_DEMO_ORDER];
    }
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  public getUserOrders(userId: string): Order[] {
    return this.orders.filter((o) => o.user_id === userId);
  }

  public createOrder(order: Order): Order {
    this.orders.unshift(order);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
      
      // Decrement stock for ordered items
      for (const item of order.items) {
        const prod = this.products.find((p) => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
        }
      }
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
    } catch (e) {
      console.error('Error saving order to persistent store', e);
    }

    // Mirror to Supabase if project credentials are saved
    syncOrderToSupabase(order).catch((err) => {
      console.warn('Background Supabase order sync note:', err);
    });

    this.notify();
    return order;
  }

  private listeners: (() => void)[] = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public updateOrderStatus(orderId: string, status: Order['order_status']): boolean {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;
    order.order_status = status;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
      this.notify();
      return true;
    } catch (e) {
      console.error('Error updating order status', e);
      return false;
    }
  }

  public updateProduct(productId: string, updates: Partial<Product>): boolean {
    const idx = this.products.findIndex((p) => p.id === productId);
    if (idx === -1) return false;
    this.products[idx] = { ...this.products[idx], ...updates };
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
      this.notify();
      return true;
    } catch (e) {
      console.error('Error updating product', e);
      return false;
    }
  }

  public addProduct(product: Product): Product {
    this.products.unshift(product);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
      this.notify();
    } catch (e) {
      console.error('Error adding product', e);
    }
    return product;
  }

  public deleteProduct(productId: string): boolean {
    this.products = this.products.filter((p) => p.id !== productId);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
      this.notify();
      return true;
    } catch (e) {
      console.error('Error deleting product', e);
      return false;
    }
  }

  public exportAllData(): { products: Product[]; orders: Order[]; exportedAt: string } {
    return {
      products: this.products,
      orders: this.orders,
      exportedAt: new Date().toISOString(),
    };
  }

  public importData(payload: { products?: Product[]; orders?: Order[] }): { success: boolean; message: string } {
    try {
      if (Array.isArray(payload.products) && payload.products.length > 0) {
        this.products = payload.products;
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
      }
      if (Array.isArray(payload.orders)) {
        this.orders = payload.orders;
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
      }
      this.notify();
      return { success: true, message: 'Data imported successfully' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Import failed' };
    }
  }

  public generateSQLDump(): string {
    const lines: string[] = [
      '-- Serena Diamond Bespoke PostgreSQL / Supabase Seed Script',
      `-- Generated on ${new Date().toISOString()}`,
      'BEGIN;',
      '',
    ];

    for (const p of this.products) {
      const escape = (str: string) => str.replace(/'/g, "''");
      const imagesArr = `ARRAY[${p.images.map((img) => `'${escape(img)}'`).join(',')}]`;
      const sizesArr = `ARRAY[${p.sizes.map((s) => `'${escape(s)}'`).join(',')}]`;
      const featuresArr = `ARRAY[${p.features.map((f) => `'${escape(f)}'`).join(',')}]`;

      lines.push(
        `INSERT INTO products (id, name, description, price, category, sizes, stock_quantity, images, fabric, cut, care, features, in_stock, is_plus_collection, created_at)` +
          ` VALUES ('${escape(p.id)}', '${escape(p.name)}', '${escape(p.description)}', ${p.price}, '${escape(p.category)}', ${sizesArr}, ${p.stock_quantity}, ${imagesArr}, '${escape(p.fabric)}', '${escape(p.cut)}', '${escape(p.care)}', ${featuresArr}, ${p.inStock}, ${p.isPlusCollection ? 'TRUE' : 'FALSE'}, '${p.createdAt}')` +
          ` ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock_quantity = EXCLUDED.stock_quantity, in_stock = EXCLUDED.in_stock;`
      );
    }

    lines.push('');
    lines.push('COMMIT;');
    return lines.join('\n');
  }
}

export const dbService = new DatabaseService();
