import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';
import '../providers/cart_provider.dart';
import '../models/product.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';
import 'scanner_screen.dart';

class PosScreen extends StatefulWidget {
  const PosScreen({super.key});

  @override
  State<PosScreen> createState() => _PosScreenState();
}

class _PosScreenState extends State<PosScreen> {
  final _searchController = TextEditingController();
  bool _showSearch = false;

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

  void _addToCart(Product product) {
    context.read<CartProvider>().addProduct(product);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${product.name} ditambahkan'),
        duration: const Duration(milliseconds: 800),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final productProvider = context.watch<ProductProvider>();
    final products = _showSearch && _searchController.text.isNotEmpty
        ? productProvider.searchResults
        : productProvider.products;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        title: const Text('Kasir', style: TextStyle(fontWeight: FontWeight.w600)),
        actions: [
          if (cart.customerPlate != null)
            Container(
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.successGreen,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.directions_car, size: 14, color: Colors.white),
                  const SizedBox(width: 4),
                  Text(
                    cart.customerPlate!,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
                  ),
                ],
              ),
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
              onChanged: (query) {
                setState(() => _showSearch = query.isNotEmpty);
                if (query.isNotEmpty) {
                  context.read<ProductProvider>().searchProducts(query);
                }
              },
              decoration: InputDecoration(
                hintText: 'Cari produk atau scan barcode...',
                hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.qr_code_scanner_rounded, color: AppColors.primaryBlue),
                  onPressed: () => _openScanner(),
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
            child: productProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : products.isEmpty
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
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: products.length,
                        itemBuilder: (context, index) {
                          final product = products[index];
                          return _ProductItem(
                            product: product,
                            onAdd: () => _addToCart(product),
                          );
                        },
                      ),
          ),
        ],
      ),
      // Floating cart button
      floatingActionButton: cart.itemCount > 0
          ? FloatingActionButton.extended(
              onPressed: () => Navigator.pushNamed(context, '/cart'),
              backgroundColor: AppColors.primaryBlue,
              icon: Badge(
                label: Text('${cart.itemCount}'),
                child: const Icon(Icons.shopping_cart_rounded, color: Colors.white),
              ),
              label: Text(
                formatCurrency(cart.totalAmount),
                style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.white),
              ),
            )
          : null,
    );
  }

  void _openScanner() async {
    final sku = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (_) => const ScannerScreen()),
    );

    if (sku != null && sku.isNotEmpty && mounted) {
      final product = await context.read<ProductProvider>().scanProduct(sku);
      if (product != null && mounted) {
        _addToCart(product);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Produk tidak ditemukan')),
        );
      }
    }
  }
}

class _ProductItem extends StatelessWidget {
  final Product product;
  final VoidCallback onAdd;

  const _ProductItem({required this.product, required this.onAdd});

  @override
  Widget build(BuildContext context) {
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
          // Product icon
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
          // Product info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                ),
                const SizedBox(height: 2),
                Text(
                  '${formatCurrency(product.price)}${product.stock != null ? '  •  Stok: ${product.stock}' : ''}',
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          // Add button
          GestureDetector(
            onTap: onAdd,
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.primaryBlue,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.add, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }
}
