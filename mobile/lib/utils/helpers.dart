import 'package:intl/intl.dart';

String formatCurrency(dynamic amount) {
  final formatter = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );
  if (amount is String) {
    return formatter.format(double.tryParse(amount) ?? 0);
  }
  return formatter.format(amount);
}

String formatDate(String dateStr) {
  final date = DateTime.parse(dateStr);
  return DateFormat('dd MMM yyyy', 'id_ID').format(date);
}

String formatDateTime(dynamic dateInput) {
  DateTime date;
  if (dateInput is DateTime) {
    date = dateInput;
  } else {
    date = DateTime.parse(dateInput.toString());
  }
  return DateFormat('dd MMM yyyy, HH:mm', 'id_ID').format(date);
}

String getGreeting() {
  final hour = DateTime.now().hour;
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}
