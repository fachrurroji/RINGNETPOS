import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../utils/constants.dart';

class PlateInputScreen extends StatefulWidget {
  const PlateInputScreen({super.key});

  @override
  State<PlateInputScreen> createState() => _PlateInputScreenState();
}

class _PlateInputScreenState extends State<PlateInputScreen> {
  final _plateController = TextEditingController();

  @override
  void dispose() {
    _plateController.dispose();
    super.dispose();
  }

  void _proceed() {
    final plate = _plateController.text.trim().toUpperCase();
    context.read<CartProvider>().customerPlate = plate.isNotEmpty ? plate : null;
    Navigator.pushNamed(context, '/pos');
  }

  void _skip() {
    context.read<CartProvider>().customerPlate = null;
    Navigator.pushNamed(context, '/pos');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // Gradient header
          Container(
            decoration: const BoxDecoration(gradient: AppColors.headerGradient),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                child: Column(
                  children: [
                    Row(
                      children: [
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
                        ),
                        const Spacer(),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Icon(Icons.directions_car_rounded, size: 48, color: Colors.white),
                    const SizedBox(height: 12),
                    const Text(
                      'Masukkan Plat Nomor',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: Colors.white),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Untuk mencatat riwayat servis kendaraan',
                      style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.7)),
                    ),
                    const SizedBox(height: 24),
                    TextField(
                      controller: _plateController,
                      textCapitalization: TextCapitalization.characters,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                        letterSpacing: 2,
                      ),
                      decoration: InputDecoration(
                        hintText: 'B 1234 ABC',
                        hintStyle: TextStyle(
                          color: Colors.white.withOpacity(0.4),
                          fontSize: 18,
                          letterSpacing: 0,
                          fontWeight: FontWeight.w400,
                        ),
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.1),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide(color: Colors.white.withOpacity(0.3), width: 2),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide(color: Colors.white.withOpacity(0.3), width: 2),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: Colors.white, width: 2),
                        ),
                        contentPadding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
                      ),
                      onSubmitted: (_) => _proceed(),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _proceed,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.successGreen,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: const Text('Lanjutkan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Skip option
          Padding(
            padding: const EdgeInsets.all(20),
            child: GestureDetector(
              onTap: _skip,
              child: Text.rich(
                TextSpan(
                  text: 'atau ',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 14),
                  children: [
                    TextSpan(
                      text: 'Lewati',
                      style: TextStyle(
                        color: AppColors.primaryBlue,
                        fontWeight: FontWeight.w600,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                    const TextSpan(text: ' tanpa plat'),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
