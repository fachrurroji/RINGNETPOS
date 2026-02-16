import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../utils/constants.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final MobileScannerController _controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
  );
  bool _hasScanned = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_hasScanned) return;
    final barcode = capture.barcodes.firstOrNull;
    if (barcode?.rawValue != null) {
      setState(() => _hasScanned = true);
      Navigator.pop(context, barcode!.rawValue);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: const Text('Scan Barcode'),
        actions: [
          IconButton(
            icon: ValueListenableBuilder(
              valueListenable: _controller,
              builder: (ctx, state, _) {
                return Icon(
                  state.torchState == TorchState.on
                      ? Icons.flash_on
                      : Icons.flash_off,
                  color: state.torchState == TorchState.on
                      ? Colors.amber
                      : Colors.white,
                );
              },
            ),
            onPressed: () => _controller.toggleTorch(),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Camera view
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
          ),

          // Overlay with scan area
          Center(
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.successGreen, width: 3),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),

          // Instructions
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Text(
                    'Arahkan kamera ke barcode produk',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                ),
                const SizedBox(height: 16),
                // Manual input button
                TextButton.icon(
                  onPressed: () => _manualInput(),
                  icon: const Icon(Icons.keyboard, color: Colors.white70),
                  label: const Text(
                    'Input manual',
                    style: TextStyle(color: Colors.white70),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _manualInput() async {
    final controller = TextEditingController();
    final sku = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Input Manual'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Masukkan SKU / barcode',
            border: OutlineInputBorder(),
          ),
          onSubmitted: (v) => Navigator.pop(ctx, v),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, controller.text),
            child: const Text('Cari'),
          ),
        ],
      ),
    );
    if (sku != null && sku.isNotEmpty && mounted) {
      Navigator.pop(context, sku);
    }
  }
}
