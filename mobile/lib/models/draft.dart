class Draft {
  final String id;
  final String? customerPlate;
  final double totalAmount;
  final String createdAt;
  final String updatedAt;
  final String? branchName;
  final String? username;
  final List<dynamic> items;

  Draft({
    required this.id,
    this.customerPlate,
    required this.totalAmount,
    required this.createdAt,
    required this.updatedAt,
    this.branchName,
    this.username,
    this.items = const [],
  });

  factory Draft.fromJson(Map<String, dynamic> json) {
    return Draft(
      id: json['id'] ?? '',
      customerPlate: json['customerPlate'],
      totalAmount: (json['totalAmount'] is String)
          ? double.tryParse(json['totalAmount']) ?? 0
          : (json['totalAmount'] as num?)?.toDouble() ?? 0,
      createdAt: json['createdAt'] ?? '',
      updatedAt: json['updatedAt'] ?? '',
      branchName: json['branch']?['name'],
      username: json['user']?['username'],
      items: json['items'] ?? [],
    );
  }
}
