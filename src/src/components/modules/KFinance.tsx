import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Search, Filter, TrendingUp, DollarSign, Users, Calendar, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';

type Tab = 'dashboard' | 'clients' | 'appointments' | 'invoices';

export default function KFinance() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { clients, appointments, invoices } = useStore();

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'invoices', label: 'Facturas', icon: FileText },
  ];

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingRevenue = invoices
    .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600 p-2 flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">
              <span className="gradient-text">KFinance</span>
            </h1>
            <p className="text-xs text-muted font-mono">Gestión financiera inteligente</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-primary border border-primary/20'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Ingresos Totales', value: `$${totalRevenue.toLocaleString('es-CO')}`, icon: DollarSign, change: '+12.5%', color: 'text-success' },
              { label: 'Pendiente', value: `$${pendingRevenue.toLocaleString('es-CO')}`, icon: Filter, change: '3 facturas', color: 'text-yellow-400' },
              { label: 'Clientes', value: clients.length.toString(), icon: Users, change: '+2 este mes', color: 'text-secondary' },
              { label: 'Citas Próximas', value: appointments.filter((a) => a.status !== 'cancelled').length.toString(), icon: Calendar, change: 'Próximos 7 días', color: 'text-primary' },
            ].map((metric, i) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  className="glass rounded-2xl p-4 border border-primary/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={16} className={metric.color} />
                    <span className="text-[10px] text-muted font-mono">{metric.change}</span>
                  </div>
                  <p className="text-xl font-heading font-bold text-foreground">{metric.value}</p>
                  <p className="text-[10px] text-muted font-mono mt-0.5">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Recent invoices */}
          <div className="glass rounded-2xl p-6 border border-primary/5">
            <h2 className="text-sm font-heading font-semibold text-foreground mb-4">
              Facturas Recientes
            </h2>
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={32} className="mx-auto mb-3 text-primary/20" />
                <p className="text-sm text-muted">No hay facturas generadas</p>
                <button className="btn-gradient text-xs mt-3 py-2 px-4 rounded-lg">
                  + Generar Primera Factura
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {invoices.slice(0, 4).map((inv, i) => (
                  <motion.div
                    key={inv.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-primary/5"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{inv.clientName}</p>
                      <p className="text-[10px] text-muted font-mono">{inv.id} · {inv.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-heading font-bold text-foreground">${inv.total.toLocaleString('es-CO')}</p>
                      <span className={`text-[10px] font-mono ${
                        inv.status === 'paid' ? 'text-success' :
                        inv.status === 'overdue' ? 'text-destructive' :
                        inv.status === 'sent' ? 'text-secondary' : 'text-muted'
                      }`}>
                        {inv.status === 'paid' ? 'Pagada' :
                         inv.status === 'overdue' ? 'Vencida' :
                         inv.status === 'sent' ? 'Enviada' : 'Borrador'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="glass rounded-2xl p-6 border border-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-foreground">Clientes</h2>
            <button className="btn-gradient text-xs py-2 px-4 rounded-lg flex items-center gap-1">
              <Plus size={14} /> Añadir
            </button>
          </div>

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="input-field pl-9 py-2 text-sm"
            />
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-8">
              <Users size={32} className="mx-auto mb-3 text-primary/20" />
              <p className="text-sm text-muted">No hay clientes registrados</p>
              <p className="text-xs text-muted/60 mt-1">Añade tu primer cliente para comenzar</p>
            </div>
          ) : (
            <div className="space-y-2">
              {clients.map((client, i) => (
                <motion.div
                  key={client.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-primary/5 hover:border-primary/20 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-heading font-bold text-xs">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{client.name}</p>
                      <p className="text-[10px] text-muted font-mono">{client.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-heading font-bold text-foreground">${client.totalSpent.toLocaleString('es-CO')}</p>
                    <p className="text-[10px] text-muted font-mono">Última: {client.lastAppointment}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="glass rounded-2xl p-6 border border-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-foreground">Citas</h2>
            <button className="btn-gradient text-xs py-2 px-4 rounded-lg flex items-center gap-1">
              <Plus size={14} /> Nueva Cita
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={32} className="mx-auto mb-3 text-primary/20" />
              <p className="text-sm text-muted">No hay citas programadas</p>
              <p className="text-xs text-muted/60 mt-1">Crea una nueva cita para comenzar</p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-primary/5 hover:border-primary/20 transition-all"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center border border-primary/10">
                      <span className="text-xs font-heading font-bold gradient-text">{apt.date.split('/')[0]}</span>
                      <span className="text-[8px] text-muted font-mono">{apt.date.split('/')[2]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{apt.clientName}</p>
                      <p className="text-[10px] text-muted font-mono">{apt.service} · {apt.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-heading font-bold text-foreground">${apt.amount.toLocaleString('es-CO')}</p>
                    <span className={`text-[10px] font-mono ${
                      apt.status === 'confirmed' ? 'text-secondary' :
                      apt.status === 'completed' ? 'text-success' :
                      apt.status === 'cancelled' ? 'text-destructive' : 'text-muted'
                    }`}>
                      {apt.status === 'confirmed' ? 'Confirmada' :
                       apt.status === 'completed' ? 'Completada' :
                       apt.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="glass rounded-2xl p-6 border border-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-heading font-semibold text-foreground">Facturas</h2>
            <button className="btn-gradient text-xs py-2 px-4 rounded-lg flex items-center gap-1">
              <Plus size={14} /> Nueva Factura
            </button>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={32} className="mx-auto mb-3 text-primary/20" />
              <p className="text-sm text-muted">No hay facturas generadas</p>
              <p className="text-xs text-muted/60 mt-1">Genera tu primera factura con IVA del 19%</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/10">
                    <th className="text-left py-3 px-2 text-[10px] text-muted font-mono uppercase tracking-wider">Factura</th>
                    <th className="text-left py-3 px-2 text-[10px] text-muted font-mono uppercase tracking-wider">Cliente</th>
                    <th className="text-left py-3 px-2 text-[10px] text-muted font-mono uppercase tracking-wider hidden md:table-cell">Fecha</th>
                    <th className="text-right py-3 px-2 text-[10px] text-muted font-mono uppercase tracking-wider">Total</th>
                    <th className="text-right py-3 px-2 text-[10px] text-muted font-mono uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => (
                    <motion.tr
                      key={inv.id}
                      className="border-b border-primary/5 hover:bg-white/5 transition-colors cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td className="py-3 px-2 text-[10px] text-muted font-mono">{inv.id}</td>
                      <td className="py-3 px-2 text-sm text-foreground">{inv.clientName}</td>
                      <td className="py-3 px-2 text-xs text-muted hidden md:table-cell">{inv.date}</td>
                      <td className="py-3 px-2 text-right text-sm font-heading font-bold">
                        ${inv.total.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-mono ${
                          inv.status === 'paid' ? 'bg-success/10 text-success' :
                          inv.status === 'overdue' ? 'bg-destructive/10 text-destructive' :
                          inv.status === 'sent' ? 'bg-secondary/10 text-secondary' :
                          'bg-white/10 text-muted'
                        }`}>
                          {inv.status === 'paid' ? 'Pagada' :
                           inv.status === 'overdue' ? 'Vencida' :
                           inv.status === 'sent' ? 'Enviada' : 'Borrador'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}