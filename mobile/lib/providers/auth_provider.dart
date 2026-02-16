import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;
  String? get error => _error;

  final ApiService _api = ApiService();

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.dio.post(ApiConfig.login, data: {
        'username': username,
        'password': password,
      });

      final data = response.data;
      final token = data['access_token'];
      await _api.setToken(token);

      // Decode JWT payload to get user info
      final parts = token.split('.');
      if (parts.length == 3) {
        final payload = utf8.decode(
          base64Url.decode(base64Url.normalize(parts[1])),
        );
        final payloadMap = json.decode(payload) as Map<String, dynamic>;
        _user = User.fromJson(payloadMap);
      }

      _isLoading = false;
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _isLoading = false;
      if (e.response?.statusCode == 401) {
        _error = 'Username atau password salah';
      } else {
        _error = 'Gagal terhubung ke server';
      }
      notifyListeners();
      return false;
    } catch (e) {
      _isLoading = false;
      _error = 'Gagal terhubung ke server';
      notifyListeners();
      return false;
    }
  }

  Future<void> tryAutoLogin() async {
    final token = await _api.getToken();
    if (token == null) return;

    try {
      final parts = token.split('.');
      if (parts.length == 3) {
        final payload = utf8.decode(
          base64Url.decode(base64Url.normalize(parts[1])),
        );
        final payloadMap = json.decode(payload) as Map<String, dynamic>;

        // Check expiry
        final exp = payloadMap['exp'] as int?;
        if (exp != null) {
          final expDate = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
          if (expDate.isBefore(DateTime.now())) {
            await logout();
            return;
          }
        }

        _user = User.fromJson(payloadMap);
        notifyListeners();
      }
    } catch (_) {
      await logout();
    }
  }

  Future<void> logout() async {
    await _api.clearToken();
    _user = null;
    notifyListeners();
  }
}
