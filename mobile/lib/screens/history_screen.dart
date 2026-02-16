import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/transaction_provider.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TransactionProvider>().fetchTransactions();
    });
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'PAID':
        return AppColors.successGreen;
      case 'CANCELLED':
        return AppColors.dangerRed;
      default:
        return AppColors.warningAmber;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'PAID':
        return 'Lunas';
      case 'CANCELLED':
        return 'Batal';
      case 'PENDING':
        return 'Pending';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    final txProvider = context.watch<TransactionProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        title: const Text('Riwayat Transaksi', style: TextStyle(fontWeight: FontWeight.w600)),
      ),
      body: txProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : txProvider.transactions.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.receipt_long_outlined, size: 64, color: AppColors.textMuted),
                      const SizedBox(height: 12),
                      const Text('Belum ada transaksi', style: TextStyle(color: AppColors.textMuted)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: () => txProvider.fetchTransactions(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: txProvider.transactions.length,
                    itemBuilder: (context, index) {
                      final tx = txProvider.transactions[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  formatDateTime(tx.createdAt),
                                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _statusColor(tx.status).withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    _statusLabel(tx.status),
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: _statusColor(tx.status),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                if (tx.customerPlate != null)
                                  Row(
                                    children: [
                                      const Icon(Icons.directions_car, size: 16, color: AppColors.primaryBlue),
                                      const SizedBox(width: 6),
                                      Text(
                                        tx.customerPlate!,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.darkNavy,
                                        ),
                                      ),
                                    ],
                                  )
                                else
                                  Text(
                                    tx.id.substring(0, 8).toUpperCase(),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w500,
                                      color: AppColors.textSecondary,
                                      fontSize: 12,
                                    ),
                                  ),
                                Text(
                                  formatCurrency(tx.totalAmount),
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.successGreen,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
