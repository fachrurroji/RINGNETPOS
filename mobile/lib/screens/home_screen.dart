import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/transaction_provider.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';

class HomeScreen extends StatefulWidget {
  final Function(int)? onTabChanged;
  const HomeScreen({super.key, this.onTabChanged});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TransactionProvider>().fetchDailyStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final txProvider = context.watch<TransactionProvider>();
    final stats = txProvider.dailyStats;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // Header with gradient
          Container(
            decoration: const BoxDecoration(
              gradient: AppColors.headerGradient,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${getGreeting()} 👋',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      auth.user?.username ?? 'User',
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Stats cards
                    Row(
                      children: [
                        Expanded(
                          child: _StatCard(
                            value: stats != null
                                ? formatCurrency(stats['totalRevenue'] ?? 0)
                                : 'Rp 0',
                            label: 'Omzet Hari Ini',
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _StatCard(
                            value: '${stats?['totalTransactions'] ?? 0}',
                            label: 'Transaksi',
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Quick actions
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Menu Cepat',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 14),
                  GridView.count(
                    crossAxisCount: 3,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    children: [
                      _ActionButton(
                        icon: Icons.shopping_cart_rounded,
                        label: 'Kasir',
                        color: AppColors.primaryBlue,
                        highlighted: true,
                        onTap: () => widget.onTabChanged?.call(1),
                      ),
                      _ActionButton(
                        icon: Icons.directions_car_rounded,
                        label: 'Cari Plat',
                        color: AppColors.successGreen,
                        onTap: () => widget.onTabChanged?.call(1),
                      ),
                      _ActionButton(
                        icon: Icons.receipt_long_rounded,
                        label: 'Riwayat',
                        color: AppColors.warningAmber,
                        onTap: () => widget.onTabChanged?.call(2),
                      ),
                      _ActionButton(
                        icon: Icons.inventory_2_rounded,
                        label: 'Produk',
                        color: const Color(0xFF8B5CF6),
                        onTap: () {
                          Navigator.pushNamed(context, '/products');
                        },
                      ),
                      _ActionButton(
                        icon: Icons.save_rounded,
                        label: 'Draft',
                        color: const Color(0xFF06B6D4),
                        onTap: () {
                          Navigator.pushNamed(context, '/drafts');
                        },
                      ),
                      _ActionButton(
                        icon: Icons.settings_rounded,
                        label: 'Profil',
                        color: AppColors.textSecondary,
                        onTap: () => widget.onTabChanged?.call(3),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;

  const _StatCard({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.white.withOpacity(0.8),
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final bool highlighted;
  final VoidCallback? onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    this.highlighted = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: highlighted ? color.withOpacity(0.1) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 30, color: color),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: highlighted ? FontWeight.w600 : FontWeight.w500,
                color: highlighted ? color : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
