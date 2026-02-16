import 'package:flutter/material.dart';
import '../models/transaction.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class TransactionProvider extends ChangeNotifier {
  List<Transaction> _transactions = [];
  bool _isLoading = false;
  Map<String, dynamic>? _dailyStats;

  List<Transaction> get transactions => _transactions;
  bool get isLoading => _isLoading;
  Map<String, dynamic>? get dailyStats => _dailyStats;

  final ApiService _api = ApiService();

  Future<void> fetchTransactions({String? status}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final params = <String, dynamic>{};
      if (status != null) params['status'] = status;

      final response = await _api.dio.get(
        ApiConfig.transactions,
        queryParameters: params,
      );
      final data = response.data as List;
      _transactions = data.map((json) => Transaction.fromJson(json)).toList();
    } catch (e) {
      debugPrint('Error fetching transactions: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<Transaction?> fetchTransactionDetail(String id) async {
    try {
      final response = await _api.dio.get('${ApiConfig.transactions}/$id');
      return Transaction.fromJson(response.data);
    } catch (e) {
      debugPrint('Error fetching transaction detail: $e');
      return null;
    }
  }

  Future<void> fetchDailyStats() async {
    try {
      final response = await _api.dio.get(ApiConfig.reportDaily);
      _dailyStats = response.data;
      notifyListeners();
    } catch (e) {
      debugPrint('Error fetching daily stats: $e');
    }
  }
}
