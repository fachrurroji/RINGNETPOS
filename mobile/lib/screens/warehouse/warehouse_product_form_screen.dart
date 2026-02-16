import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../config/api_config.dart';
import '../../utils/constants.dart';

class WarehouseProductFormScreen extends StatefulWidget {
  const WarehouseProductFormScreen({super.key});

  @override
  State<WarehouseProductFormScreen> createState() => _WarehouseProductFormScreenState();
}

class _WarehouseProductFormScreenState extends State<WarehouseProductFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _skuController = TextEditingController();
  final _basePriceController = TextEditingController();
  final _sellPriceController = TextEditingController();
  final _stockController = TextEditingController(text: '0');

  String _productType = 'GOODS';
  bool _isFlexiblePrice = false;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _nameController.dispose();
    _skuController.dispose();
    _basePriceController.dispose();
    _sellPriceController.dispose();
    _stockController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    try {
      final api = ApiService();

      // Create product
      final productRes = await api.dio.post(ApiConfig.products, data: {
        'name': _nameController.text.trim(),
        'sku': _skuController.text.trim(),
        'type': _productType,
        'basePrice': double.tryParse(_basePriceController.text) ?? 0,
        'sellPrice': _isFlexiblePrice ? null : (double.tryParse(_sellPriceController.text) ?? 0),
        'isFlexiblePrice': _isFlexiblePrice,
      });

      // Create initial inventory if stock > 0
      final stock = int.tryParse(_stockController.text) ?? 0;
      if (stock > 0 && _productType == 'GOODS') {
        final productId = productRes.data['id'];
        await api.dio.post(ApiConfig.inventory, data: {
          'productId': productId,
          'type': 'IN',
          'quantity': stock,
          'notes': 'Stok awal',
        });
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Produk berhasil ditambahkan!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal: $e'), backgroundColor: AppColors.dangerRed),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        title: const Text('Tambah Produk', style: TextStyle(fontWeight: FontWeight.w600)),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Product type toggle
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _productType = 'GOODS'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: _productType == 'GOODS' ? AppColors.primaryBlue : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Center(
                          child: Text(
                            'Barang',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: _productType == 'GOODS' ? Colors.white : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _productType = 'SERVICE'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: _productType == 'SERVICE' ? AppColors.warningAmber : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Center(
                          child: Text(
                            'Jasa',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: _productType == 'SERVICE' ? Colors.white : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            _buildField('Nama Produk', _nameController, 'Masukkan nama produk'),
            _buildField('SKU / Kode Barcode', _skuController, 'Contoh: BAN001'),
            _buildField('Harga Beli (Modal)', _basePriceController, '0', isNumber: true),

            // Flexible price toggle
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Harga Fleksibel', style: TextStyle(fontWeight: FontWeight.w500)),
                      Text('Harga bisa diubah saat transaksi', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                    ],
                  ),
                  Switch(
                    value: _isFlexiblePrice,
                    onChanged: (v) => setState(() => _isFlexiblePrice = v),
                    activeColor: AppColors.primaryBlue,
                  ),
                ],
              ),
            ),

            if (!_isFlexiblePrice)
              _buildField('Harga Jual', _sellPriceController, '0', isNumber: true),

            if (_productType == 'GOODS')
              _buildField('Stok Awal', _stockController, '0', isNumber: true),

            const SizedBox(height: 24),

            SizedBox(
              height: 54,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF7C3AED),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                child: _isSubmitting
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                    : const Text('Simpan Produk', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller, String hint, {bool isNumber = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        Container(
          margin: const EdgeInsets.only(bottom: 16),
          child: TextFormField(
            controller: controller,
            keyboardType: isNumber ? TextInputType.number : TextInputType.text,
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(color: AppColors.textMuted),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
            validator: isNumber
                ? null
                : (v) => (v == null || v.trim().isEmpty) ? 'Wajib diisi' : null,
          ),
        ),
      ],
    );
  }
}
