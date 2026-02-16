import 'product.dart';

class CartItem {
  final Product product;
  int qty;
  double priceOverride;
  String? mechanicId;
  String? mechanicName;
  double mechanicFee;

  CartItem({
    required this.product,
    this.qty = 1,
    double? priceOverride,
    this.mechanicId,
    this.mechanicName,
    this.mechanicFee = 0,
  }) : priceOverride = priceOverride ?? product.price;

  double get subtotal => (priceOverride * qty) + mechanicFee;

  Map<String, dynamic> toJson() => {
        'productId': product.id,
        'mechanicId': mechanicId,
        'qty': qty,
        'priceAtMoment': priceOverride,
        'mechanicFee': mechanicFee > 0 ? mechanicFee : null,
        'subtotal': subtotal,
      };
}
