import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  bool _isSubmitting = false;
  List<dynamic> _mechanics = [];

  @override
  void initState() {
    super.initState();
    _fetchMechanics();
  }

  Future<void> _fetchMechanics() async {
    try {
      final response = await ApiService().dio.get(ApiConfig.mechanics);
      setState(() => _mechanics = response.data);
    } catch (_) {}
  }

  Future<void> _submitTransaction() async {
    setState(() => _isSubmitting = true);
    try {
      await context.read<CartProvider>().submitTransaction();
      if (mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/success', (route) => false);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Gagal: $e'),
            backgroundColor: AppColors.dangerRed,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  Future<void> _saveDraft() async {
    try {
      await context.read<CartProvider>().saveDraft();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Draft tersimpan!')),
        );
        Navigator.popUntil(context, (route) => route.isFirst);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal simpan draft: $e')),
        );
      }
    }
  }

  void _showMechanicPicker(int index) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Pilih Mekanik', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 16),
            // No mechanic option
            ListTile(
              leading: const Icon(Icons.close, color: AppColors.textMuted),
              title: const Text('Tanpa Mekanik'),
              onTap: () {
                context.read<CartProvider>().setMechanic(index, null, null, 0);
                Navigator.pop(ctx);
              },
            ),
            ..._mechanics.map((m) => ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: AppColors.primaryBlue,
                    child: Icon(Icons.person, color: Colors.white, size: 20),
                  ),
                  title: Text(m['name']),
                  subtitle: Text(formatCurrency(m['fee'] ?? 0)),
                  onTap: () {
                    final fee = (m['fee'] is String)
                        ? double.tryParse(m['fee']) ?? 0
                        : (m['fee'] as num?)?.toDouble() ?? 0;
                    context.read<CartProvider>().setMechanic(
                          index,
                          m['id'],
                          m['name'],
                          fee.toDouble(),
                        );
                    Navigator.pop(ctx);
                  },
                )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        title: Text('Keranjang (${cart.itemCount})', style: const TextStyle(fontWeight: FontWeight.w600)),
        actions: [
          if (cart.items.isNotEmpty)
            TextButton.icon(
              onPressed: _saveDraft,
              icon: const Icon(Icons.save_outlined, size: 18),
              label: const Text('Draft'),
            ),
        ],
      ),
      body: cart.items.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shopping_cart_outlined, size: 64, color: AppColors.textMuted),
                  const SizedBox(height: 12),
                  const Text('Keranjang kosong', style: TextStyle(color: AppColors.textMuted)),
                ],
              ),
            )
          : Column(
              children: [
                // Plate info
                if (cart.customerPlate != null)
                  Container(
                    margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.directions_car, color: AppColors.successGreen),
                        const SizedBox(width: 10),
                        Text(
                          cart.customerPlate!,
                          style: const TextStyle(
                            fontWeight: FontWeight.w700,
                            color: AppColors.darkNavy,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),

                // Items
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: cart.items.length,
                    itemBuilder: (context, index) {
                      final item = cart.items[index];
                      return Dismissible(
                        key: Key(item.product.id),
                        direction: DismissDirection.endToStart,
                        onDismissed: (_) => cart.removeItem(index),
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          decoration: BoxDecoration(
                            color: AppColors.dangerRed,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.delete_outline, color: Colors.white),
                        ),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.04),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.product.name,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 14,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          formatCurrency(item.priceOverride),
                                          style: const TextStyle(
                                            color: AppColors.primaryBlue,
                                            fontWeight: FontWeight.w600,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  // Qty controls
                                  Row(
                                    children: [
                                      _QtyBtn(
                                        icon: Icons.remove,
                                        onTap: () => cart.updateQty(index, item.qty - 1),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.symmetric(horizontal: 12),
                                        child: Text(
                                          '${item.qty}',
                                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                                        ),
                                      ),
                                      _QtyBtn(
                                        icon: Icons.add,
                                        onTap: () => cart.updateQty(index, item.qty + 1),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              // Mechanic
                              const SizedBox(height: 8),
                              GestureDetector(
                                onTap: () => _showMechanicPicker(index),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: item.mechanicName != null
                                        ? AppColors.successGreen.withOpacity(0.1)
                                        : AppColors.background,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.engineering_rounded,
                                        size: 14,
                                        color: item.mechanicName != null
                                            ? AppColors.successGreen
                                            : AppColors.textMuted,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        item.mechanicName ?? 'Pilih Mekanik',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: item.mechanicName != null
                                              ? AppColors.successGreen
                                              : AppColors.textMuted,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Bottom checkout
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 20,
                        offset: const Offset(0, -4),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    top: false,
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Total', style: TextStyle(color: AppColors.textSecondary, fontSize: 16)),
                            Text(
                              formatCurrency(cart.totalAmount),
                              style: const TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w700,
                                color: AppColors.darkNavy,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          height: 54,
                          child: ElevatedButton(
                            onPressed: _isSubmitting ? null : _submitTransaction,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.successGreen,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              elevation: 0,
                            ),
                            child: _isSubmitting
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                                  )
                                : const Text('Bayar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                          ),
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

class _QtyBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _QtyBtn({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 16, color: AppColors.textPrimary),
      ),
    );
  }
}
