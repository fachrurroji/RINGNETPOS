import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'providers/cart_provider.dart';
import 'providers/product_provider.dart';
import 'providers/transaction_provider.dart';

import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/plate_input_screen.dart';
import 'screens/pos_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/success_screen.dart';
import 'screens/history_screen.dart';
import 'screens/product_list_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/draft_list_screen.dart';
import 'screens/warehouse/warehouse_home_screen.dart';
import 'screens/warehouse/warehouse_product_form_screen.dart';
import 'screens/warehouse/stock_opname_screen.dart';
import 'utils/constants.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  runApp(const RingPosApp());
}

class RingPosApp extends StatelessWidget {
  const RingPosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => TransactionProvider()),
      ],
      child: MaterialApp(
        title: 'RingPOS',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primaryBlue,
            brightness: Brightness.light,
          ),
          scaffoldBackgroundColor: AppColors.background,
          appBarTheme: const AppBarTheme(
            centerTitle: true,
            elevation: 0,
            surfaceTintColor: Colors.transparent,
          ),
        ),
        home: const AuthGate(),
        routes: {
          '/plate': (context) => const PlateInputScreen(),
          '/pos': (context) => const PosScreen(),
          '/cart': (context) => const CartScreen(),
          '/success': (context) => const SuccessScreen(),
          '/products': (context) => const ProductListScreen(),
          '/drafts': (context) => const DraftListScreen(),
          '/warehouse/add-product': (context) => const WarehouseProductFormScreen(),
          '/warehouse/stock-opname': (context) => const StockOpnameScreen(),
        },
      ),
    );
  }
}

/// Decides whether to show Login or MainShell based on auth state
class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    await context.read<AuthProvider>().tryAutoLogin();
    setState(() => _initialized = true);
  }

  @override
  Widget build(BuildContext context) {
    if (!_initialized) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (auth.isLoggedIn) {
          final role = auth.user?.role.toUpperCase() ?? '';
          if (role == 'WAREHOUSE') {
            return const WarehouseShell();
          }
          return const MainShell();
        }
        return const LoginScreen();
      },
    );
  }
}

/// Main app shell for CASHIER with bottom navigation
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  void _onTabChanged(int index) {
    if (index == 1) {
      Navigator.pushNamed(context, '/plate');
      return;
    }
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(onTabChanged: _onTabChanged),
      const SizedBox(),
      const HistoryScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(
                  icon: Icons.home_rounded,
                  label: 'Home',
                  active: _currentIndex == 0,
                  onTap: () => _onTabChanged(0),
                ),
                _NavItem(
                  icon: Icons.shopping_cart_rounded,
                  label: 'Kasir',
                  active: _currentIndex == 1,
                  onTap: () => _onTabChanged(1),
                ),
                _NavItem(
                  icon: Icons.receipt_long_rounded,
                  label: 'Riwayat',
                  active: _currentIndex == 2,
                  onTap: () => _onTabChanged(2),
                ),
                _NavItem(
                  icon: Icons.person_rounded,
                  label: 'Profil',
                  active: _currentIndex == 3,
                  onTap: () => _onTabChanged(3),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Warehouse shell with different bottom navigation
class WarehouseShell extends StatefulWidget {
  const WarehouseShell({super.key});

  @override
  State<WarehouseShell> createState() => _WarehouseShellState();
}

class _WarehouseShellState extends State<WarehouseShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      const WarehouseHomeScreen(),
      const ProductListScreen(),
      const StockOpnameScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(
                  icon: Icons.home_rounded,
                  label: 'Stok',
                  active: _currentIndex == 0,
                  onTap: () => setState(() => _currentIndex = 0),
                ),
                _NavItem(
                  icon: Icons.inventory_2_rounded,
                  label: 'Produk',
                  active: _currentIndex == 1,
                  onTap: () => setState(() => _currentIndex = 1),
                ),
                _NavItem(
                  icon: Icons.fact_check_rounded,
                  label: 'Opname',
                  active: _currentIndex == 2,
                  onTap: () => setState(() => _currentIndex = 2),
                ),
                _NavItem(
                  icon: Icons.person_rounded,
                  label: 'Profil',
                  active: _currentIndex == 3,
                  onTap: () => setState(() => _currentIndex = 3),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 26,
              color: active ? AppColors.primaryBlue : AppColors.textMuted,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                color: active ? AppColors.primaryBlue : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
