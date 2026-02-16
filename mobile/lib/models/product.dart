class Product {
  final String id;
  final String name;
  final String sku;
  final String type; // GOODS or SERVICE
  final double price;
  final int? stock;

  Product({
    required this.id,
    required this.name,
    required this.sku,
    required this.type,
    required this.price,
    this.stock,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      sku: json['sku'] ?? '',
      type: json['type'] ?? 'GOODS',
      price: (json['price'] is String)
          ? double.tryParse(json['price']) ?? 0
          : (json['price'] as num?)?.toDouble() ?? 0,
      stock: json['inventory'] != null && (json['inventory'] as List).isNotEmpty
          ? json['inventory'][0]['qty'] as int?
          : null,
    );
  }
}
