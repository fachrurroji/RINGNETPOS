import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';
import '../models/product.dart';

class DraftListScreen extends StatefulWidget {
  const DraftListScreen({super.key});

  @override
  State<DraftListScreen> createState() => _DraftListScreenState();
}

class _DraftListScreenState extends State<DraftListScreen> {
  final ApiService _api = ApiService();
  List<dynamic> _drafts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchDrafts();
  }

  Future<void> _fetchDrafts() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.dio.get(ApiConfig.drafts);
      setState(() {
        _drafts = response.data is List ? response.data : [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal memuat draft: $e')),
        );
      }
    }
  }

  Future<void> _deleteDraft(String id) async {
    try {
      await _api.dio.delete('${ApiConfig.drafts}/$id');
      _fetchDrafts();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Draft dihapus')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal hapus: $e')),
        );
      }
    }
  }

  Future<void> _resumeDraft(Map<String, dynamic> draft) async {
    try {
      // Fetch full draft detail
      final response = await _api.dio.get('${ApiConfig.drafts}/${draft['id']}');
      final draftDetail = response.data;

      if (!mounted) return;

      final cart = context.read<CartProvider>();
      cart.clear();

      // Set customer plate
      cart.customerPlate = draftDetail['customerPlate'];

      // Load items into cart
      final items = draftDetail['items'] as List<dynamic>? ?? [];
      for (final item in items) {
        final product = Product(
          id: item['productId'] ?? '',
          name: item['product']?['name'] ?? item['productName'] ?? 'Unknown',
          sku: item['product']?['sku'] ?? '',
          type: item['product']?['type'] ?? 'GOODS',
          price: _toDouble(item['priceAtMoment'] ?? item['product']?['sellPrice'] ?? 0),
          stock: item['product']?['stock'] as int?,
        );
        cart.addProduct(product);
        // Set quantity
        final qty = item['qty'] as int? ?? 1;
        if (qty > 1) {
          final idx = cart.items.length - 1;
          cart.updateQty(idx, qty);
        }
        // Set mechanic if any
        if (item['mechanicId'] != null) {
          final idx = cart.items.length - 1;
          cart.setMechanic(
            idx,
            item['mechanicId'],
            item['mechanic']?['name'] ?? item['mechanicName'],
            _toDouble(item['mechanicFee'] ?? 0),
          );
        }
      }

      // Delete the draft after loading
      await _api.dio.delete('${ApiConfig.drafts}/${draft['id']}');

      if (mounted) {
        Navigator.pushNamed(context, '/pos');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal memuat draft: $e')),
        );
      }
    }
  }

  double _toDouble(dynamic value) {
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        title: const Text('Draft Transaksi', style: TextStyle(fontWeight: FontWeight.w600)),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _drafts.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.drafts_outlined, size: 64, color: AppColors.textMuted),
                      const SizedBox(height: 12),
                      const Text('Tidak ada draft', style: TextStyle(color: AppColors.textMuted)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _fetchDrafts,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _drafts.length,
                    itemBuilder: (context, index) {
                      final draft = _drafts[index];
                      return _DraftItem(
                        draft: draft,
                        onResume: () => _resumeDraft(draft),
                        onDelete: () => _deleteDraft(draft['id']),
                      );
                    },
                  ),
                ),
    );
  }
}

class _DraftItem extends StatelessWidget {
  final Map<String, dynamic> draft;
  final VoidCallback onResume;
  final VoidCallback onDelete;

  const _DraftItem({
    required this.draft,
    required this.onResume,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final plate = draft['customerPlate'] ?? '-';
    final total = draft['totalAmount'] ?? 0;
    final itemCount = (draft['items'] as List?)?.length ?? 0;
    final createdAt = draft['createdAt'] != null
        ? DateTime.tryParse(draft['createdAt'])
        : null;

    return Dismissible(
      key: Key(draft['id'] ?? '$hashCode'),
      direction: DismissDirection.endToStart,
      confirmDismiss: (_) async {
        return await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Hapus Draft?'),
            content: const Text('Draft ini akan dihapus permanen.'),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
              TextButton(
                onPressed: () => Navigator.pop(ctx, true),
                child: const Text('Hapus', style: TextStyle(color: Colors.red)),
              ),
            ],
          ),
        );
      },
      onDismissed: (_) => onDelete(),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppColors.dangerRed,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.delete_outline, color: Colors.white),
      ),
      child: GestureDetector(
        onTap: onResume,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
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
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFF06B6D4).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.save_outlined, color: Color(0xFF06B6D4)),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        if (plate != '-') ...[
                          const Icon(Icons.directions_car, size: 14, color: AppColors.successGreen),
                          const SizedBox(width: 4),
                          Text(
                            plate,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(width: 8),
                        ],
                        Text(
                          '$itemCount item',
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        if (createdAt != null)
                          Text(
                            formatDateTime(createdAt),
                            style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                          ),
                        Text(
                          formatCurrency(total),
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            color: AppColors.primaryBlue,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right, color: AppColors.textMuted),
            ],
          ),
        ),
      ),
    );
  }
}
