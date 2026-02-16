import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/product.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  String? _customerPlate;
  final ApiService _api = ApiService();

  List<CartItem> get items => List.unmodifiable(_items);
  String? get customerPlate => _customerPlate;
  int get itemCount => _items.fold(0, (sum, item) => sum + item.qty);

  double get totalAmount =>
      _items.fold(0.0, (sum, item) => sum + item.subtotal);

  set customerPlate(String? plate) {
    _customerPlate = plate;
    notifyListeners();
  }

  void addProduct(Product product) {
    final existingIndex =
        _items.indexWhere((item) => item.product.id == product.id);
    if (existingIndex >= 0) {
      _items[existingIndex].qty++;
    } else {
      _items.add(CartItem(product: product));
    }
    notifyListeners();
  }

  void updateQty(int index, int qty) {
    if (index < 0 || index >= _items.length) return;
    if (qty <= 0) {
      _items.removeAt(index);
    } else {
      _items[index].qty = qty;
    }
    notifyListeners();
  }

  void removeItem(int index) {
    if (index < 0 || index >= _items.length) return;
    _items.removeAt(index);
    notifyListeners();
  }

  void setMechanic(int index, String? mechanicId, String? mechanicName, double fee) {
    if (index < 0 || index >= _items.length) return;
    _items[index].mechanicId = mechanicId;
    _items[index].mechanicName = mechanicName;
    _items[index].mechanicFee = fee;
    notifyListeners();
  }

  void clear() {
    _items.clear();
    _customerPlate = null;
    notifyListeners();
  }

  // Submit transaction to API
  Future<Map<String, dynamic>> submitTransaction() async {
    final response = await _api.dio.post(ApiConfig.transactions, data: {
      'customerPlate': _customerPlate,
      'items': _items.map((item) => item.toJson()).toList(),
    });
    clear();
    return response.data;
  }

  // Save as draft
  Future<void> saveDraft() async {
    await _api.dio.post(ApiConfig.drafts, data: {
      'customerPlate': _customerPlate,
      'totalAmount': totalAmount,
      'items': _items.map((item) => item.toJson()).toList(),
    });
  }

  // Load from draft
  void loadFromDraft(Map<String, dynamic> draftData) {
    // This will be called from the draft detail screen
    _customerPlate = draftData['customerPlate'];
    // Items would need product data - handled in the screen
    notifyListeners();
  }
}
