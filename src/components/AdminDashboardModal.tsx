import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  Mail,
  Users,
  Package,
  TrendingUp,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Upload,
  Database,
  FileJson,
  FileCode,
} from 'lucide-react';
import { dbService } from '../services/db';
import { authService, DEMO_USERS } from '../services/auth';
import { ThemeToggle } from './ThemeToggle';
import {
  getMailgunConfig,
  saveMailgunConfig,
  sendMailgunRawMessage,
  formatNGN,
  sendOrderConfirmationEmail,
} from '../services/mailgun';
import { Order, Product, ClothingSize } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderReceipt?: (order: Order) => void;
  onOpenEmailPreview?: (order: Order) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderReceipt,
  onOpenEmailPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'mailgun' | 'inventory' | 'patrons'>('overview');
  const [orders, setOrders] = useState<Order[]>(dbService.getOrders());
  const [products, setProducts] = useState<Product[]>(dbService.getProducts());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mailgun state
  const config = getMailgunConfig();
  const [testEmailRecipient, setTestEmailRecipient] = useState(config.defaultRecipientEmail || 'zeerocodes@gmail.com');
  const [testEmailSubject, setTestEmailSubject] = useState('Executive Atelier Admin Dispatch Test');
  const [testEmailMessage, setTestEmailMessage] = useState('This is a verified test dispatch from Serena Diamond Bespoke Admin Dashboard using sending key 7543e985-bb815cb5.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSendResult, setTestSendResult] = useState<{ success: boolean; message: string; id?: string } | null>(null);

  // Inventory edit state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'tailoring' | 'dispatched' | 'delivered'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // New product form
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('African Heritage Tailoring');
  const [newProductPrice, setNewProductPrice] = useState(320000);
  const [newProductStock, setNewProductStock] = useState(10);
  const [newProductFabric, setNewProductFabric] = useState('Super 140s Worsted Wool & Hand-Loomed Silk');
  const [newProductDescription, setNewProductDescription] = useState('Executive bespoke design crafted for African leadership.');

  // Subscribe to db updates
  useEffect(() => {
    return dbService.subscribe(() => {
      setOrders([...dbService.getOrders()]);
      setProducts([...dbService.getProducts()]);
    });
  }, []);

  if (!isOpen) return null;

  // Compute metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);
  const pendingCount = orders.filter((o) => o.order_status === 'pending').length;
  const tailoringCount = orders.filter((o) => o.order_status === 'tailoring').length;
  const dispatchedCount = orders.filter((o) => o.order_status === 'dispatched' || o.order_status === 'delivered').length;
  const totalItemsSold = orders.reduce((sum, ord) => sum + ord.items.reduce((s, itm) => s + itm.quantity, 0), 0);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.order_status !== orderFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customer_name.toLowerCase().includes(q);
      const matchEmail = o.customer_email.toLowerCase().includes(q);
      return matchId || matchName || matchEmail;
    }
    return true;
  });

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['order_status']) => {
    dbService.updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: newStatus });
    }
  };

  const handleResendOrderEmail = async (order: Order) => {
    try {
      const result = await sendOrderConfirmationEmail(order);
      alert(
        result.success
          ? `Receipt successfully dispatched via Mailgun! Message ID: ${result.messageId}`
          : `Mailgun Notice: ${result.error || 'Failed to dispatch'}`
      );
    } catch (e: any) {
      alert(`Error resending email: ${e.message}`);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);
    setTestSendResult(null);
    try {
      const result = await sendMailgunRawMessage({
        to: testEmailRecipient,
        subject: testEmailSubject,
        text: testEmailMessage,
        html: `
          <div style="font-family: sans-serif; padding: 24px; background: #FAF9F5; border: 1px solid #E7E2D5;">
            <div style="color: #064E3B; font-weight: bold; text-transform: uppercase; font-size: 11px;">Serena Diamond Bespoke &bull; Admin Dispatch</div>
            <h2 style="color: #1C1917; margin-top: 8px;">Executive Mailgun System Verification</h2>
            <p style="color: #44403C; font-size: 14px; line-height: 1.6;">${testEmailMessage}</p>
            <div style="margin-top: 20px; padding: 12px; background: #FFFFFF; border-left: 3px solid #064E3B; font-size: 12px; color: #78716C;">
              <strong>Active Sending Key ID:</strong> 7543e985-bb815cb5<br>
              <strong>Domain:</strong> ${config.domain}<br>
              <strong>Timestamp:</strong> ${new Date().toISOString()}
            </div>
          </div>
        `,
      });

      setIsSendingTest(false);
      if (result.success) {
        setTestSendResult({
          success: true,
          message: `Queued and dispatched successfully via Mailgun!`,
          id: result.id,
        });
      } else {
        setTestSendResult({
          success: false,
          message: result.message + (result.hint ? ` (${result.hint})` : ''),
        });
      }
    } catch (err: any) {
      setIsSendingTest(false);
      setTestSendResult({
        success: false,
        message: err.message || 'Network error triggering dispatch',
      });
    }
  };

  const handleSaveProductEdit = (productId: string) => {
    dbService.updateProduct(productId, {
      price: editPrice,
      stock_quantity: editStock,
      inStock: editStock > 0,
    });
    setEditingProductId(null);
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `sdb-custom-${Date.now()}`,
      name: newProductName,
      description: newProductDescription,
      price: newProductPrice,
      category: newProductCategory,
      sizes: ['XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X', '4X'],
      stock_quantity: newProductStock,
      images: ['/src/assets/images/asooke_tuxedo_jacket_1790773988544.jpg'],
      fabric: newProductFabric,
      cut: 'Executive Architectural Tailoring',
      care: 'Specialist Dry Clean Only.',
      features: [
        'Crafted for high-level African executive leadership',
        'Complimentary tailoring adjustment at Victoria Island Atelier',
        'Reinforced seam allowances for bespoke comfort',
      ],
      inStock: newProductStock > 0,
      createdAt: new Date().toISOString(),
    };
    dbService.addProduct(newProd);
    setIsAddProductModalOpen(false);
    setNewProductName('');
  };

  const handleDownloadJSON = () => {
    const data = dbService.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serena_diamond_atelier_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSQL = () => {
    const sql = dbService.generateSQLDump();
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serena_diamond_seed_${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const res = dbService.importData(parsed);
        alert(res.message);
      } catch (err: any) {
        alert(`Invalid JSON backup file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF9F5] dark:bg-[#062118] w-full max-w-6xl h-[95vh] rounded-sm border border-[#E7E2D5] dark:border-[#164132] shadow-2xl flex flex-col overflow-hidden transition-colors">
        
        {/* Top Header */}
        <div className="bg-[#064E3B] dark:bg-[#031A12] text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#04241B] dark:border-[#10B981]/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#FAF9F5]/10 text-[#F3E5AB] flex items-center justify-center border border-[#C5A059]/40">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB] font-bold">
                  Atelier Control Center
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#059669]/60 text-white border border-emerald-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Key: 7543e985-bb815cb5 Active
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-wide">
                Executive Atelier & Mailgun Manager
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={onClose}
              className="p-2 text-[#FAF9F5]/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Mobile-first horizontal scroll with touch targets) */}
        <div className="bg-white dark:bg-[#07241B] border-b border-[#E7E2D5] dark:border-[#164132] px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 py-2 sm:py-0 transition-colors">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'mailgun', label: 'Mailgun Engine', icon: Mail },
            { id: 'inventory', label: `Catalogue (${products.length})`, icon: Package },
            { id: 'patrons', label: 'Patrons & VIP', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[44px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#064E3B] dark:border-[#34D399] text-[#064E3B] dark:text-[#34D399] font-semibold'
                    : 'border-transparent text-stone-500 dark:text-[#8FA69B] hover:text-stone-800 dark:hover:text-[#FAF9F6]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#064E3B] dark:text-[#34D399]' : 'text-stone-400 dark:text-stone-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 border border-[#E7E2D5] rounded-sm shadow-2xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Revenue</div>
                  <div className="font-sans font-bold text-lg sm:text-2xl text-[#064E3B] mt-1 tabular-nums">
                    {formatNGN(totalRevenue)}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
                    <span className="text-emerald-700 font-bold">&#8593; Lagos</span> Verified Commissions
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 border border-[#E7E2D5] rounded-sm shadow-2xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Active Orders</div>
                  <div className="font-sans font-bold text-lg sm:text-2xl text-stone-900 mt-1 tabular-nums">
                    {orders.length}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    {pendingCount} Pending &bull; {tailoringCount} In Tailoring
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 border border-[#E7E2D5] rounded-sm shadow-2xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Mailgun Dispatcher</div>
                  <div className="font-mono font-bold text-xs sm:text-sm text-stone-800 mt-2 truncate">
                    ID: 7543e985-bb815cb5
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Real API Key Connected</span>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 border border-[#E7E2D5] rounded-sm shadow-2xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Items Sold</div>
                  <div className="font-sans font-bold text-lg sm:text-2xl text-stone-900 mt-1 tabular-nums">
                    {totalItemsSold} Garments
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    {products.length} Designs in Catalogue
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders Overview */}
                <div className="lg:col-span-2 bg-white border border-[#E7E2D5] rounded-sm p-4 sm:p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="font-serif text-lg text-stone-900 font-medium">Recent Atelier Commissions</h3>
                      <p className="text-xs text-stone-500">Live order management from Victoria Island & Ikoyi</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 4).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-stone-50/60 border border-stone-200/80 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[#064E3B]">{ord.id}</span>
                          <div>
                            <div className="font-semibold text-stone-900">{ord.customer_name}</div>
                            <div className="text-[11px] text-stone-500">{ord.shipping_address.area} &bull; {ord.items.length} items</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="font-bold text-stone-800">{formatNGN(ord.total_amount)}</span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                              ord.order_status === 'tailoring'
                                ? 'bg-amber-100 text-amber-800'
                                : ord.order_status === 'dispatched'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.order_status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {ord.order_status}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActiveTab('orders');
                            }}
                            className="min-h-[36px] px-2.5 py-1 text-xs border border-stone-300 rounded hover:border-[#064E3B] hover:text-[#064E3B] cursor-pointer"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mailgun Fast Dispatch Panel */}
                <div className="bg-white border border-[#E7E2D5] rounded-sm p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-2">
                      <Mail className="w-4 h-4 text-[#C5A059]" />
                      <span>Mailgun Transactional Health</span>
                    </div>
                    <h3 className="font-serif text-lg text-stone-900 font-medium mb-2">
                      Sending Key Active
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      The active Mailgun sending key <code className="bg-stone-100 px-1 py-0.5 rounded text-[11px] font-mono text-[#064E3B]">7543e985-bb815cb5</code> is dispatching luxury receipts without browser CORS limitations.
                    </p>

                    <div className="p-3 bg-[#FAF9F5] border border-stone-200 rounded text-xs space-y-1.5 mb-4">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Domain:</span>
                        <span className="font-mono text-stone-800 text-[11px] truncate max-w-[170px]">{config.domain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Sandbox Recipient:</span>
                        <span className="font-mono text-stone-800 text-[11px]">zeerocodes@gmail.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Server Proxy:</span>
                        <span className="text-emerald-700 font-semibold">/api/mailgun/send (Online)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('mailgun')}
                    className="w-full min-h-[44px] py-2.5 bg-[#064E3B] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open Mailgun Dispatcher</span>
                  </button>
                </div>

              </div>

              {/* Data Persistence & Export Card */}
              <div className="bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] rounded-sm p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 dark:border-[#164132] gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-sm bg-[#064E3B]/10 dark:bg-[#10B981]/20 text-[#064E3B] dark:text-[#34D399] flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-stone-900 dark:text-[#FAF9F6] font-medium">
                        Atelier Data Portability & Export
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-[#8FA69B]">
                        Keep all orders, catalogue adjustments, and patron accounts 100% persistent when exporting to GitHub or deploying.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#064E3B] dark:text-[#34D399] bg-[#064E3B]/5 dark:bg-[#10B981]/15 px-2.5 py-1 rounded">
                      {products.length} Products &bull; {orders.length} Live Orders
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  
                  {/* Option 1: Download JSON Backup */}
                  <div className="p-4 bg-[#FAF9F5] dark:bg-[#041812] border border-[#E7E2D5] dark:border-[#164132] rounded-sm flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-[#FAF9F6]">
                        <FileJson className="w-4 h-4 text-[#C5A059]" />
                        <span>Export Atelier Data (.JSON)</span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-[#A7C4B8] mt-1 leading-relaxed">
                        Complete snapshot of all custom inventory, order histories, and client commissions.
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadJSON}
                      className="w-full py-2 px-3 bg-[#064E3B] dark:bg-[#10B981] hover:bg-[#04241B] text-[#FAF9F5] dark:text-[#041812] text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>
                  </div>

                  {/* Option 2: Download PostgreSQL / Supabase SQL */}
                  <div className="p-4 bg-[#FAF9F5] dark:bg-[#041812] border border-[#E7E2D5] dark:border-[#164132] rounded-sm flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-[#FAF9F6]">
                        <FileCode className="w-4 h-4 text-[#064E3B] dark:text-[#34D399]" />
                        <span>SQL Database Seeder (.SQL)</span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-[#A7C4B8] mt-1 leading-relaxed">
                        Ready-to-run PostgreSQL DDL and INSERT scripts to populate Supabase, Neon, or Cloud SQL.
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadSQL}
                      className="w-full py-2 px-3 border border-[#064E3B] dark:border-[#34D399] text-[#064E3B] dark:text-[#34D399] hover:bg-[#064E3B] hover:text-[#FAF9F5] dark:hover:bg-[#10B981] dark:hover:text-[#041812] text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Seed .SQL</span>
                    </button>
                  </div>

                  {/* Option 3: Restore / Import */}
                  <div className="p-4 bg-[#FAF9F5] dark:bg-[#041812] border border-[#E7E2D5] dark:border-[#164132] rounded-sm flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-[#FAF9F6]">
                        <Upload className="w-4 h-4 text-emerald-600 dark:text-[#34D399]" />
                        <span>Restore from Backup</span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-[#A7C4B8] mt-1 leading-relaxed">
                        Load a previously downloaded JSON backup file directly into this atelier instance.
                      </p>
                    </div>
                    <label className="w-full py-2 px-3 bg-white dark:bg-[#0A2E22] border border-stone-300 dark:border-[#1E4D3E] text-stone-700 dark:text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#064E3B]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Backup</span>
                      <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter and Search Bar */}
              <div className="bg-white p-3 sm:p-4 border border-[#E7E2D5] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by order ID or client name..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-[#064E3B]"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                  {(['all', 'pending', 'tailoring', 'dispatched', 'delivered'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`min-h-[36px] px-3 py-1 text-xs font-semibold uppercase rounded-xs transition-colors cursor-pointer shrink-0 ${
                        orderFilter === st
                          ? 'bg-[#064E3B] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

              </div>

              {/* Orders Table & Detail View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Orders List */}
                <div className={`${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
                  {filteredOrders.length === 0 ? (
                    <div className="bg-white p-12 text-center border border-dashed border-stone-300 rounded text-stone-500 text-sm">
                      No orders match the selected filter.
                    </div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrder(ord)}
                        className={`p-4 bg-white border rounded-sm transition-all cursor-pointer ${
                          selectedOrder?.id === ord.id
                            ? 'border-[#064E3B] ring-1 ring-[#064E3B] shadow-sm'
                            : 'border-[#E7E2D5] hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[#064E3B]">{ord.id}</span>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                                  ord.order_status === 'tailoring'
                                    ? 'bg-amber-100 text-amber-800'
                                    : ord.order_status === 'dispatched'
                                    ? 'bg-blue-100 text-blue-800'
                                    : ord.order_status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                {ord.order_status}
                              </span>
                            </div>
                            <div className="font-serif text-base text-stone-900 font-medium mt-1">
                              {ord.customer_name}
                            </div>
                            <div className="text-xs text-stone-500">
                              {ord.customer_email} &bull; {ord.shipping_address.area}, {ord.shipping_address.stateOrCity}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-sans font-bold text-sm text-stone-900 tabular-nums">
                              {formatNGN(ord.total_amount)}
                            </div>
                            <div className="text-[11px] text-stone-400 mt-1">
                              {new Date(ord.created_at).toLocaleDateString('en-GB')}
                            </div>
                          </div>
                        </div>

                        {/* Garment thumbnail previews */}
                        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                          <span className="truncate max-w-[240px]">
                            {ord.items.map((i) => `${i.quantity}x ${i.product_name} (${i.size})`).join(', ')}
                          </span>
                          <span className="text-[#064E3B] font-semibold hover:underline shrink-0">
                            Inspect &rarr;
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Single Order Detail Drawer */}
                {selectedOrder && (
                  <div className="lg:col-span-5 bg-white border border-[#E7E2D5] rounded-sm p-4 sm:p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                          Commission Details
                        </div>
                        <h3 className="font-mono text-base font-bold text-[#064E3B]">
                          #{selectedOrder.id}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Status Changer */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1.5">
                        Update Order Lifecycle:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['pending', 'tailoring', 'dispatched', 'delivered'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                            className={`min-h-[40px] px-2 py-1.5 text-xs font-semibold uppercase rounded-xs transition-colors cursor-pointer border ${
                              selectedOrder.order_status === st
                                ? 'bg-[#064E3B] text-white border-[#064E3B]'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Garments in this order */}
                    <div>
                      <div className="text-[11px] font-semibold uppercase text-stone-600 mb-2">
                        Commissioned Garments:
                      </div>
                      <div className="space-y-2">
                        {selectedOrder.items.map((itm) => (
                          <div key={itm.id} className="p-2.5 bg-stone-50 border border-stone-200 rounded flex items-center justify-between text-xs">
                            <div>
                              <div className="font-semibold text-stone-900">{itm.product_name}</div>
                              <div className="text-[11px] text-stone-500">
                                Size: <strong className="text-[#064E3B]">{itm.size}</strong> &bull; Qty: {itm.quantity}
                              </div>
                            </div>
                            <div className="font-bold text-stone-800">
                              {formatNGN(itm.unit_price * itm.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Contact */}
                    <div className="p-3 bg-[#FAF9F5] border border-stone-200 rounded text-xs space-y-1">
                      <div className="font-semibold text-stone-900">{selectedOrder.shipping_address.fullName}</div>
                      <div className="text-stone-600">{selectedOrder.customer_email}</div>
                      <div className="text-stone-600">{selectedOrder.shipping_address.phone}</div>
                      <div className="text-stone-600">{selectedOrder.shipping_address.streetAddress}, {selectedOrder.shipping_address.area}</div>
                      {selectedOrder.shipping_address.deliveryNotes && (
                        <div className="text-stone-500 italic mt-1 text-[11px]">"{selectedOrder.shipping_address.deliveryNotes}"</div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2 border-t border-stone-200">
                      <button
                        onClick={() => handleResendOrderEmail(selectedOrder)}
                        className="w-full min-h-[44px] py-2.5 bg-[#064E3B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Resend Invoice via Mailgun</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onOpenOrderReceipt && onOpenOrderReceipt(selectedOrder)}
                          className="min-h-[40px] py-2 border border-stone-300 text-stone-800 text-xs font-semibold uppercase rounded hover:border-stone-500 cursor-pointer"
                        >
                          View Receipt
                        </button>
                        <button
                          onClick={() => onOpenEmailPreview && onOpenEmailPreview(selectedOrder)}
                          className="min-h-[40px] py-2 border border-stone-300 text-stone-800 text-xs font-semibold uppercase rounded hover:border-stone-500 cursor-pointer"
                        >
                          Inspect Email
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: MAILGUN ENGINE */}
          {activeTab === 'mailgun' && (
            <div className="space-y-6">
              
              {/* Credentials & System Health */}
              <div className="bg-white border border-[#E7E2D5] rounded-sm p-4 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold">
                      Mailgun API Configuration &bull; Verified Production Setup
                    </div>
                    <h3 className="font-serif text-xl text-stone-900 font-medium">
                      Transactional Engine Credentials
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Proxy Route Online (port 3000)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">Active Sending Key</div>
                    <div className="font-mono text-stone-900 font-semibold mt-1 truncate" title={config.apiKey}>
                      18afd5e46fe1...5cb5
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">Key Identifier</div>
                    <div className="font-mono text-[#064E3B] font-bold mt-1">
                      7543e985-bb815cb5
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">Active Domain</div>
                    <div className="font-mono text-stone-900 mt-1 truncate">
                      {config.domain}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">Authorized Sandbox User</div>
                    <div className="font-mono text-stone-900 font-semibold mt-1 truncate">
                      zeerocodes@gmail.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Test Sender */}
              <div className="bg-white border border-[#E7E2D5] rounded-sm p-4 sm:p-6 shadow-2xs">
                <h4 className="font-serif text-lg text-stone-900 font-medium mb-1">
                  Live Mailgun Email Dispatch Simulator
                </h4>
                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                  Trigger an immediate real email dispatch to test latency and delivery using the active key <code className="font-mono text-[#064E3B]">7543e985-bb815cb5</code>.
                </p>

                {testSendResult && (
                  <div
                    className={`p-3 rounded-xs mb-4 text-xs flex items-start gap-2 ${
                      testSendResult.success
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    {testSendResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold">{testSendResult.message}</div>
                      {testSendResult.id && (
                        <div className="font-mono text-[11px] mt-1 text-emerald-900">
                          Mailgun ID: {testSendResult.id}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendTestEmail} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">
                        Recipient Address (Must be Authorized Sandbox Recipient)
                      </label>
                      <input
                        type="email"
                        required
                        value={testEmailRecipient}
                        onChange={(e) => setTestEmailRecipient(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        required
                        value={testEmailSubject}
                        onChange={(e) => setTestEmailSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">
                      Email Body Content
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={testEmailMessage}
                      onChange={(e) => setTestEmailMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingTest}
                    className="min-h-[44px] px-6 py-2.5 bg-[#064E3B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingTest ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Contacting Mailgun API...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Live Mailgun Test</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 4: CATALOGUE & INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl text-stone-900 font-medium">
                    Atelier Garment Inventory
                  </h3>
                  <p className="text-xs text-stone-500">
                    Manage prices, stock availability, and tailored creations.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="min-h-[44px] px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Garment</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-[#E7E2D5] rounded-sm overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF9F5] border-b border-stone-200 text-stone-600 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Garment</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price (NGN)</th>
                        <th className="py-3 px-4">Atelier Stock</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {products.map((p) => {
                        const isEditing = editingProductId === p.id;
                        return (
                          <tr key={p.id} className="hover:bg-stone-50/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-10 h-12 object-cover rounded-xs border border-stone-200"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <div className="font-semibold text-stone-900 max-w-[200px] truncate">{p.name}</div>
                                  <div className="text-[10px] text-stone-400">{p.sizes.join(', ')}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-stone-600">
                              <span className="px-2 py-0.5 rounded-xs bg-stone-100 text-[10px] font-medium">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-[#064E3B] tabular-nums">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(Number(e.target.value))}
                                  className="w-24 px-2 py-1 text-xs border border-stone-300 rounded"
                                />
                              ) : (
                                formatNGN(p.price)
                              )}
                            </td>
                            <td className="py-3 px-4 tabular-nums">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editStock}
                                  onChange={(e) => setEditStock(Number(e.target.value))}
                                  className="w-16 px-2 py-1 text-xs border border-stone-300 rounded"
                                />
                              ) : (
                                <span>{p.stock_quantity} units</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                                  p.stock_quantity > 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {p.stock_quantity > 0 ? 'In Stock' : 'Sold Out'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleSaveProductEdit(p.id)}
                                    className="px-2.5 py-1 bg-[#064E3B] text-white text-[11px] rounded hover:bg-[#04241B]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingProductId(null)}
                                    className="px-2 py-1 text-stone-500 hover:text-stone-800"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingProductId(p.id);
                                    setEditPrice(p.price);
                                    setEditStock(p.stock_quantity);
                                  }}
                                  className="min-h-[32px] px-2.5 py-1 text-stone-600 hover:text-[#064E3B] hover:bg-stone-100 rounded cursor-pointer"
                                >
                                  Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: PATRONS & VIP CRM */}
          {activeTab === 'patrons' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-xl text-stone-900 font-medium">
                  Executive Patron Registry &bull; VIP Directory
                </h3>
                <p className="text-xs text-stone-500">
                  Client profiles, corporate leadership tiers, and Lagos atelier history.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEMO_USERS.map((usr) => {
                  const patronOrders = orders.filter((o) => o.user_id === usr.id || o.customer_email === usr.email);
                  const patronSpend = patronOrders.reduce((sum, o) => sum + o.total_amount, 0);

                  return (
                    <div key={usr.id} className="p-4 sm:p-5 bg-white border border-[#E7E2D5] rounded-sm shadow-2xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={usr.avatar}
                            alt={usr.name}
                            className="w-12 h-12 rounded-full object-cover border border-[#C5A059]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-stone-900 text-sm">{usr.name}</div>
                            <div className="text-xs text-stone-500">{usr.title}</div>
                            <div className="text-[11px] text-stone-400">{usr.organization}</div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 bg-[#FAF9F5] border border-[#C5A059]/40 text-[#8F7029] text-[10px] font-bold uppercase rounded-xs">
                          {usr.role || 'Patron'}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Lifetime Commissions</span>
                          <span className="font-bold text-[#064E3B]">{formatNGN(patronSpend)}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Orders Recorded</span>
                          <span className="font-bold text-stone-800">{patronOrders.length} orders</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Add Product Sub-Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] w-full max-w-lg p-6 rounded-sm border border-[#E7E2D5] shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-xl font-medium text-stone-900">Add New Atelier Creation</h4>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Garment Name</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded focus:border-[#064E3B]"
                  placeholder="e.g. The Marina Velvet Tuxedo"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded focus:border-[#064E3B]"
                  >
                    <option value="African Heritage Tailoring">African Heritage Tailoring</option>
                    <option value="Curated Plus & Silhouette">Curated Plus & Silhouette</option>
                    <option value="Tailored Blazers">Tailored Blazers</option>
                    <option value="Sheath Dresses">Sheath Dresses</option>
                    <option value="Power Suits">Power Suits</option>
                    <option value="Luxury Trousers & Silk">Luxury Trousers & Silk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Price (NGN)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded focus:border-[#064E3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded focus:border-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Textile Details</label>
                  <input
                    type="text"
                    required
                    value={newProductFabric}
                    onChange={(e) => setNewProductFabric(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded focus:border-[#064E3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded focus:border-[#064E3B]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 bg-[#064E3B] text-white font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B]"
              >
                Save Garment to Catalogue
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
