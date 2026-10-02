import React, { useState, useEffect } from 'react';
import { X, LogOut, Package, Clock, ShieldCheck, Mail, ChevronRight, User } from 'lucide-react';
import { authService } from '../services/auth';
import { dbService } from '../services/db';
import { Order, User as UserType } from '../types';
import { formatNGN } from '../services/mailgun';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrderEmail: (order: Order) => void;
  onOpenOrderReceipt: (order: Order) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onViewOrderEmail,
  onOpenOrderReceipt,
}) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(authService.getCurrentUser());
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsub = authService.subscribe((user) => {
      setCurrentUser(user);
      if (user) {
        setOrders(dbService.getUserOrders(user.id));
      } else {
        setOrders([]);
      }
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    authService.logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF9F5] w-full max-w-3xl rounded-sm border border-[#E7E2D5] shadow-2xl overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="p-6 bg-white border-b border-[#E7E2D5] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C5A059] bg-stone-100 flex items-center justify-center shrink-0">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-6 h-6 text-stone-400" />
              )}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold">
                Executive Atelier Patron
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-medium">
                {currentUser?.name || 'Executive Patron'}
              </h2>
              <div className="text-xs text-stone-500">{currentUser?.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2 text-stone-500 hover:text-rose-600 rounded transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patron Privileges Strip */}
        <div className="px-6 py-3 bg-[#06392B] text-[#FAF9F5] text-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F3E5AB]" />
            <span>
              Patron Tier: <strong className="text-[#F3E5AB]">{currentUser?.role || 'Executive Member'}</strong>
            </span>
          </div>
          <div className="text-stone-300">
            Showroom: 14A Walter Carrington, Victoria Island, Lagos
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-1">
              Your Commission History ({orders.length})
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              All bespoke orders placed under your executive account with real-time atelier tracking and Mailgun receipts.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white border border-stone-200 rounded p-6">
              <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-serif text-base text-stone-800">No previous commissions recorded</p>
              <p className="text-xs text-stone-500 mt-1">
                Your future orders and custom tailored creations will be cataloged here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#E7E2D5] rounded-sm p-5 space-y-4 hover:border-stone-400 transition-colors"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                        Order Identifier
                      </span>
                      <span className="font-mono text-xs font-bold text-[#064E3B]">
                        {order.id}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                        Date Placed
                      </span>
                      <span className="text-xs text-stone-700">
                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                        Atelier Status
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                        <Clock className="w-3 h-3" />
                        {order.order_status}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                        Total Investment
                      </span>
                      <span className="text-xs font-bold text-stone-900 tabular-nums">
                        {formatNGN(order.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-10 h-12 object-cover rounded-xs border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-stone-900">{item.product_name}</div>
                            <div className="text-[11px] text-stone-500">
                              Size: <strong className="text-[#064E3B]">{item.size}</strong> &bull; Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium text-stone-700 tabular-nums">
                          {formatNGN(item.unit_price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3 text-xs">
                    <button
                      onClick={() => onViewOrderEmail(order)}
                      className="text-[#064E3B] hover:text-[#04241B] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>View Mailgun Receipt</span>
                    </button>
                    <button
                      onClick={() => onOpenOrderReceipt(order)}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium cursor-pointer"
                    >
                      Invoice Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom */}
        <div className="p-4 bg-white border-t border-[#E7E2D5] flex items-center justify-between text-xs text-stone-500">
          <span>Need custom alterations? Contact our Victoria Island concierge team.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#064E3B] text-white rounded text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#04241B]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
