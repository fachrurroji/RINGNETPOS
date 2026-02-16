import 'package:flutter/material.dart';

class AppColors {
  static const primaryBlue = Color(0xFF3B82F6);
  static const darkNavy = Color(0xFF1E3A5F);
  static const darkNavy2 = Color(0xFF0D1B2A);
  static const successGreen = Color(0xFF22C55E);
  static const warningAmber = Color(0xFFF59E0B);
  static const dangerRed = Color(0xFFEF4444);
  static const background = Color(0xFFF5F5F5);
  static const cardBg = Colors.white;
  static const textPrimary = Color(0xFF1E293B);
  static const textSecondary = Color(0xFF64748B);
  static const textMuted = Color(0xFF94A3B8);
  static const border = Color(0xFFE2E8F0);

  static const headerGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [darkNavy, primaryBlue],
  );

  static const loginGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [darkNavy, darkNavy2],
  );

  static const successGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF22C55E), Color(0xFF16A34A)],
  );
}
