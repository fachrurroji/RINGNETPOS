import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class ProductProvider extends ChangeNotifier {
  List<Product> _products = [];
  List<Product> _searchResults = [];
  bool _isLoading = false;

  List<Product> get products => _products;
  List<Product> get searchResults => _searchResults;
  bool get isLoading => _isLoading;

  final ApiService _api = ApiService();

  Future<void> fetchProducts() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.dio.get(ApiConfig.products);
      final data = response.data as List;
      _products = data.map((json) => Product.fromJson(json)).toList();
    } catch (e) {
      debugPrint('Error fetching products: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> searchProducts(String query) async {
    if (query.isEmpty) {
      _searchResults = [];
      notifyListeners();
      return;
    }

    try {
      final response = await _api.dio.get(
        ApiConfig.productSearch,
        queryParameters: {'q': query},
      );
      final data = response.data as List;
      _searchResults = data.map((json) => Product.fromJson(json)).toList();
    } catch (e) {
      debugPrint('Error searching products: $e');
    }

    notifyListeners();
  }

  Future<Product?> scanProduct(String sku) async {
    try {
      final response = await _api.dio.get('${ApiConfig.productScan}/$sku');
      return Product.fromJson(response.data);
    } catch (e) {
      debugPrint('Product not found for SKU: $sku');
      return null;
    }
  }
}
