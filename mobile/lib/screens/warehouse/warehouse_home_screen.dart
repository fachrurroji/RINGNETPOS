import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../config/api_config.dart';
import '../../utils/constants.dart';
import '../../utils/helpers.dart';

class WarehouseHomeScreen extends StatefulWidget {
  const WarehouseHomeScreen({super.key});

  @override
  State<WarehouseHomeScreen> createState() => _WarehouseHomeScreenState();
}

class _WarehouseHomeScreenState extends State<WarehouseHomeScreen> {
  final ApiService _api = ApiService();
  Map<String, dynamic>? _stats;
  List<dynamic> _lowStockItems = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() => _isLoading = true);
    try {
      final productsRes = await _api.dio.get(ApiConfig.products);
      final lowStockRes = await _api.dio.get('${ApiConfig.inventory}/low-stock');

      final products = productsRes.data is List ? productsRes.data as List : [];
      final lowStock = lowStockRes.data is List ? lowStockRes.data as List : [];

      setState(() {
        _stats = {
          'totalProducts': products.length,
          'lowStockCount': lowStock.length,
        };
        _lowStockItems = lowStock.take(5).toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // Header
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF7C3AED), Color(0xFF6D28D9)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
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
                      style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.8)),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Warehouse',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: _StatCard(
                            value: '${_stats?['totalProducts'] ?? 0}',
                            label: 'Total Produk',
                            icon: Icons.inventory_2_rounded,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _StatCard(
                            value: '${_stats?['lowStockCount'] ?? 0}',
                            label: 'Stok Rendah',
                            icon: Icons.warning_amber_rounded,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Content
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _fetchData,
                    child: ListView(
                      padding: const EdgeInsets.all(20),
                      children: [
                        // Quick actions
                        const Text(
                          'Menu Cepat',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 14),
                        Row(
                          children: [
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.add_box_rounded,
                                label: 'Tambah\nProduk',
                                color: const Color(0xFF7C3AED),
                                onTap: () => Navigator.pushNamed(context, '/warehouse/add-product'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.fact_check_rounded,
                                label: 'Stock\nOpname',
                                color: const Color(0xFF059669),
                                onTap: () => Navigator.pushNamed(context, '/warehouse/stock-opname'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _ActionCard(
                                icon: Icons.qr_code_scanner,
                                label: 'Scan\nBarcode',
                                color: const Color(0xFF2563EB),
                                onTap: () => Navigator.pushNamed(context, '/warehouse/stock-opname'),
                              ),
                            ),
                          ],
                        ),

                        // Low stock alerts
                        if (_lowStockItems.isNotEmpty) ...[
                          const SizedBox(height: 24),
                          const Text(
                            'Stok Rendah ⚠️',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                          ),
                          const SizedBox(height: 12),
                          ..._lowStockItems.map((item) {
                            final product = item['product'] ?? item;
                            return Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.warningAmber.withOpacity(0.3)),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 40,
                                    height: 40,
                                    decoration: BoxDecoration(
                                      color: AppColors.warningAmber.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Icon(Icons.warning_amber, size: 20, color: AppColors.warningAmber),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          product['name'] ?? '-',
                                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                                        ),
                                        Text(
                                          'SKU: ${product['sku'] ?? '-'}',
                                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Text(
                                    'Stok: ${item['currentStock'] ?? item['stock'] ?? 0}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.dangerRed,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }),
                        ],
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
  final IconData icon;

  const _StatCard({required this.value, required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.white, size: 24),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Colors.white)),
              Text(label, style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.8))),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 100,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 30, color: color),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color),
            ),
          ],
        ),
      ),
    );
  }
}
