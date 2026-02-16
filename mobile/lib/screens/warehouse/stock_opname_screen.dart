import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../config/api_config.dart';
import '../../utils/constants.dart';
import '../scanner_screen.dart';

class StockOpnameScreen extends StatefulWidget {
  const StockOpnameScreen({super.key});

  @override
  State<StockOpnameScreen> createState() => _StockOpnameScreenState();
}

class _StockOpnameScreenState extends State<StockOpnameScreen> {
  final ApiService _api = ApiService();
  final _searchController = TextEditingController();
  List<dynamic> _products = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchProducts() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.dio.get(ApiConfig.products);
      setState(() {
        _products = response.data is List ? response.data : [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _searchProducts(String query) async {
    if (query.isEmpty) {
      _fetchProducts();
      return;
    }
    try {
      final response = await _api.dio.get('${ApiConfig.productSearch}?q=$query');
      setState(() => _products = response.data is List ? response.data : []);
    } catch (_) {}
  }

  Future<void> _scanBarcode() async {
    final sku = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (_) => const ScannerScreen()),
    );
    if (sku != null && sku.isNotEmpty) {
      _searchController.text = sku;
      _searchProducts(sku);
    }
  }

  void _showAdjustDialog(Map<String, dynamic> product) {
    final currentStock = product['stock'] ?? product['inventory']?[0]?['currentStock'] ?? 0;
    final controller = TextEditingController(text: '$currentStock');
    final notesController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              product['name'] ?? '-',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 4),
            Text(
              'SKU: ${product['sku'] ?? '-'}  •  Stok saat ini: $currentStock',
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 20),

            const Text('Stok Aktual', style: TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 6),
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              autofocus: true,
              decoration: InputDecoration(
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 14),

            const Text('Catatan', style: TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 6),
            TextField(
              controller: notesController,
              decoration: InputDecoration(
                hintText: 'Stock opname ...',
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () async {
                  final newStock = int.tryParse(controller.text) ?? 0;
                  final diff = newStock - (currentStock as int);
                  if (diff == 0) {
                    Navigator.pop(ctx);
                    return;
                  }

                  try {
                    await _api.dio.post(ApiConfig.inventory, data: {
                      'productId': product['id'],
                      'type': diff > 0 ? 'IN' : 'OUT',
                      'quantity': diff.abs(),
                      'notes': notesController.text.isNotEmpty
                          ? notesController.text
                          : 'Stock opname adjustment',
                    });

                    if (mounted) {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('✅ Stok ${product['name']} diubah: $currentStock → $newStock'),
                          backgroundColor: Colors.green,
                        ),
                      );
                      _fetchProducts();
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Gagal: $e'), backgroundColor: AppColors.dangerRed),
                      );
                    }
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Simpan Perubahan', style: TextStyle(fontWeight: FontWeight.w600)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        title: const Text('Stock Opname', style: TextStyle(fontWeight: FontWeight.w600)),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner),
            onPressed: _scanBarcode,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 14),
            child: TextField(
              controller: _searchController,
              onChanged: _searchProducts,
              decoration: InputDecoration(
                hintText: 'Cari produk...',
                hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.qr_code_scanner_rounded, color: Color(0xFF7C3AED)),
                  onPressed: _scanBarcode,
                ),
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),

          // Product list
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _products.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.inventory_2_outlined, size: 64, color: AppColors.textMuted),
                            const SizedBox(height: 12),
                            const Text('Tidak ada produk', style: TextStyle(color: AppColors.textMuted)),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _fetchProducts,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _products.length,
                          itemBuilder: (context, index) {
                            final product = _products[index];
                            final stock = product['stock'] ?? product['inventory']?[0]?['currentStock'] ?? 0;

                            return GestureDetector(
                              onTap: () => _showAdjustDialog(product),
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 10),
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
                                child: Row(
                                  children: [
                                    Container(
                                      width: 42,
                                      height: 42,
                                      decoration: BoxDecoration(
                                        color: product['type'] == 'GOODS'
                                            ? const Color(0xFF7C3AED).withOpacity(0.1)
                                            : AppColors.warningAmber.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Icon(
                                        product['type'] == 'GOODS' ? Icons.inventory_2_rounded : Icons.build_rounded,
                                        size: 20,
                                        color: product['type'] == 'GOODS' ? const Color(0xFF7C3AED) : AppColors.warningAmber,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            product['name'] ?? '-',
                                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            'SKU: ${product['sku'] ?? '-'}',
                                            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.end,
                                      children: [
                                        Text(
                                          '$stock',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.w700,
                                            color: (stock as int) <= 5 ? AppColors.dangerRed : AppColors.textPrimary,
                                          ),
                                        ),
                                        const Text('stok', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                      ],
                                    ),
                                    const SizedBox(width: 8),
                                    const Icon(Icons.edit_outlined, color: AppColors.textMuted, size: 20),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
