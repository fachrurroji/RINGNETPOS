class ApiConfig {
  // Development: Local network
  static const String baseUrl = 'http://192.168.89.157:3001';

  // Auth
  static const String login = '/api/auth/login';

  // Products
  static const String products = '/api/products';
  static const String productSearch = '/api/products/search';
  static const String productScan = '/api/products/scan';

  // Inventory
  static const String inventory = '/api/inventory';

  // Transactions
  static const String transactions = '/api/transactions';

  // Draft Transactions
  static const String drafts = '/api/draft-transactions';

  // Mechanics
  static const String mechanics = '/api/mechanics';

  // Branches
  static const String branches = '/api/branches';

  // Reports
  static const String reportDaily = '/api/reports/daily';

  // Returns
  static const String returns = '/api/returns';
}
