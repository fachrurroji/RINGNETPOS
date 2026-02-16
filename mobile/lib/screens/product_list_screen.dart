import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';

class ProductListScreen extends StatefulWidget {
  const ProductListScreen({super.key});

  @override
  State<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  final _searchController = TextEditingController();
  String _filter = 'ALL';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProductProvider>().fetchProducts();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductProvider>();
    var products = _searchController.text.isNotEmpty
        ? productProvider.searchResults
        : productProvider.products;

    if (_filter != 'ALL') {
      products = products.where((p) => p.type == _filter).toList();
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        title: const Text('Produk', style: TextStyle(fontWeight: FontWeight.w600)),
      ),
      body: Column(
        children: [
          // Search
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 10),
            child: TextField(
              controller: _searchController,
              onChanged: (query) {
                if (query.isNotEmpty) {
                  context.read<ProductProvider>().searchProducts(query);
                }
                setState(() {});
              },
              decoration: InputDecoration(
                hintText: 'Cari produk...',
                hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // Filter chips
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                _FilterChip(label: 'Semua', active: _filter == 'ALL', onTap: () => setState(() => _filter = 'ALL')),
                const SizedBox(width: 8),
                _FilterChip(label: 'Barang', active: _filter == 'GOODS', onTap: () => setState(() => _filter = 'GOODS')),
                const SizedBox(width: 8),
                _FilterChip(label: 'Jasa', active: _filter == 'SERVICE', onTap: () => setState(() => _filter = 'SERVICE')),
              ],
            ),
          ),

          // Product list
          Expanded(
            child: productProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : products.isEmpty
                    ? const Center(child: Text('Tidak ada produk', style: TextStyle(color: AppColors.textMuted)))
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: products.length,
                        itemBuilder: (context, index) {
                          final product = products[index];
                          return Container(
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
                                    color: product.type == 'GOODS'
                                        ? AppColors.primaryBlue.withOpacity(0.1)
                                        : AppColors.warningAmber.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Icon(
                                    product.type == 'GOODS' ? Icons.inventory_2_rounded : Icons.build_rounded,
                                    size: 20,
                                    color: product.type == 'GOODS' ? AppColors.primaryBlue : AppColors.warningAmber,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        product.name,
                                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        'SKU: ${product.sku}',
                                        style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                                      ),
                                    ],
                                  ),
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      formatCurrency(product.price),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.primaryBlue,
                                        fontSize: 14,
                                      ),
                                    ),
                                    if (product.stock != null)
                                      Text(
                                        'Stok: ${product.stock}',
                                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                      ),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _FilterChip({required this.label, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: active ? AppColors.primaryBlue : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: active ? AppColors.primaryBlue : AppColors.border),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: active ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
