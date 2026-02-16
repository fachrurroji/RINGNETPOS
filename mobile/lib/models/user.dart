class User {
  final String id;
  final String username;
  final String role;
  final String tenantId;
  final String? branchId;
  final String? branchName;

  User({
    required this.id,
    required this.username,
    required this.role,
    required this.tenantId,
    this.branchId,
    this.branchName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['userId'] ?? json['id'] ?? '',
      username: json['username'] ?? '',
      role: json['role'] ?? '',
      tenantId: json['tenantId'] ?? '',
      branchId: json['branchId'],
      branchName: json['branchName'],
    );
  }
}
