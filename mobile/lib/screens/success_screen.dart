import 'package:flutter/material.dart';
import '../utils/constants.dart';

class SuccessScreen extends StatelessWidget {
  const SuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.successGradient),
        child: SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Animated checkmark
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.check_rounded, size: 60, color: Colors.white),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Pembayaran Berhasil!',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Colors.white),
                ),
                const SizedBox(height: 8),
                Text(
                  'Transaksi telah disimpan',
                  style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.9)),
                ),
                const SizedBox(height: 48),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: Column(
                    children: [
                      SizedBox(
                        width: double.infinity,
                        height: 54,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppColors.successGreen,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            elevation: 0,
                          ),
                          child: const Text(
                            'Transaksi Baru',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        height: 54,
                        child: OutlinedButton.icon(
                          onPressed: () {
                            // TODO: Share/print receipt
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Fitur cetak struk segera hadir')),
                            );
                          },
                          icon: const Icon(Icons.share_rounded, size: 18),
                          label: const Text('Bagikan Struk', style: TextStyle(fontWeight: FontWeight.w600)),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: BorderSide(color: Colors.white.withOpacity(0.5)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
