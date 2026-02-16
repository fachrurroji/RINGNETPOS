class Transaction {
  final String id;
  final String? customerPlate;
  final double totalAmount;
  final String status;
  final String createdAt;
  final String? branchName;
  final List<TransactionDetailItem> details;

  Transaction({
    required this.id,
    this.customerPlate,
    required this.totalAmount,
    required this.status,
    required this.createdAt,
    this.branchName,
    this.details = const [],
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? '',
      customerPlate: json['customerPlate'],
      totalAmount: (json['totalAmount'] is String)
          ? double.tryParse(json['totalAmount']) ?? 0
          : (json['totalAmount'] as num?)?.toDouble() ?? 0,
      status: json['status'] ?? '',
      createdAt: json['createdAt'] ?? '',
      branchName: json['branch']?['name'],
      details: json['details'] != null
          ? (json['details'] as List)
              .map((d) => TransactionDetailItem.fromJson(d))
              .toList()
          : [],
    );
  }
}

class TransactionDetailItem {
  final String id;
  final String productName;
  final String productSku;
  final int qty;
  final double priceAtMoment;
  final double? mechanicFee;
  final double subtotal;
  final String? mechanicName;

  TransactionDetailItem({
    required this.id,
    required this.productName,
    required this.productSku,
    required this.qty,
    required this.priceAtMoment,
    this.mechanicFee,
    required this.subtotal,
    this.mechanicName,
  });

  factory TransactionDetailItem.fromJson(Map<String, dynamic> json) {
    return TransactionDetailItem(
      id: json['id'] ?? '',
      productName: json['product']?['name'] ?? '',
      productSku: json['product']?['sku'] ?? '',
      qty: json['qty'] ?? 0,
      priceAtMoment: (json['priceAtMoment'] is String)
          ? double.tryParse(json['priceAtMoment']) ?? 0
          : (json['priceAtMoment'] as num?)?.toDouble() ?? 0,
      mechanicFee: json['mechanicFee'] != null
          ? (json['mechanicFee'] is String
              ? double.tryParse(json['mechanicFee'])
              : (json['mechanicFee'] as num?)?.toDouble())
          : null,
      subtotal: (json['subtotal'] is String)
          ? double.tryParse(json['subtotal']) ?? 0
          : (json['subtotal'] as num?)?.toDouble() ?? 0,
      mechanicName: json['mechanic']?['name'],
    );
  }
}
