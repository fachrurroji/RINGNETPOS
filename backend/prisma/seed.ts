import { PrismaClient, UserRole, ProductType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create SUPERADMIN user
    const passwordHash = await bcrypt.hash('SuperAdmin123!', 10);

    const superadmin = await prisma.user.upsert({
        where: { username: 'superadmin' },
        update: {},
        create: {
            username: 'superadmin',
            passwordHash,
            role: UserRole.SUPERADMIN,
            tenantId: null,
            branchId: null,
        },
    });

    console.log('✅ Created SUPERADMIN user:', superadmin.username);

    // Create a demo tenant
    const demoTenant = await prisma.tenant.upsert({
        where: { id: 'demo-tenant-id' },
        update: {},
        create: {
            id: 'demo-tenant-id',
            businessName: 'Bengkel Demo',
            subscriptionPlan: 'PRO',
            isActive: true,
        },
    });

    console.log('✅ Created demo tenant:', demoTenant.businessName);

    // Create a demo branch
    const demoBranch = await prisma.branch.upsert({
        where: { id: 'demo-branch-id' },
        update: {},
        create: {
            id: 'demo-branch-id',
            tenantId: demoTenant.id,
            name: 'Cabang Pusat',
            address: 'Jl. Raya Demo No. 1',
            phone: '08123456789',
            isActive: true,
        },
    });

    console.log('✅ Created demo branch:', demoBranch.name);

    // Create a demo owner
    const ownerPasswordHash = await bcrypt.hash('Owner123!', 10);
    const demoOwner = await prisma.user.upsert({
        where: { username: 'owner_demo' },
        update: {},
        create: {
            username: 'owner_demo',
            passwordHash: ownerPasswordHash,
            role: UserRole.OWNER,
            tenantId: demoTenant.id,
            branchId: null,
        },
    });

    console.log('✅ Created demo OWNER:', demoOwner.username);

    // Create a demo cashier
    const cashierPasswordHash = await bcrypt.hash('Cashier123!', 10);
    const demoCashier = await prisma.user.upsert({
        where: { username: 'cashier_demo' },
        update: {},
        create: {
            username: 'cashier_demo',
            passwordHash: cashierPasswordHash,
            role: UserRole.CASHIER,
            tenantId: demoTenant.id,
            branchId: demoBranch.id,
        },
    });

    console.log('✅ Created demo CASHIER:', demoCashier.username);

    // Create some demo products using create with check for existing
    const products = [
        { sku: 'OLI001', name: 'Oli Motor 1L', type: ProductType.GOODS, basePrice: 45000, sellPrice: 65000, isFlexiblePrice: false },
        { sku: 'BAN001', name: 'Ban Motor 70/90-17', type: ProductType.GOODS, basePrice: 150000, sellPrice: 220000, isFlexiblePrice: false },
        { sku: 'AKI001', name: 'Aki Motor 5Ah', type: ProductType.GOODS, basePrice: 200000, sellPrice: 280000, isFlexiblePrice: false },
        { sku: 'SVC001', name: 'Servis Ringan', type: ProductType.SERVICE, basePrice: 0, sellPrice: null, isFlexiblePrice: true },
        { sku: 'SVC002', name: 'Ganti Oli', type: ProductType.SERVICE, basePrice: 0, sellPrice: 25000, isFlexiblePrice: false },
    ];

    for (const product of products) {
        // Check if product exists
        const existing = await prisma.product.findFirst({
            where: { tenantId: demoTenant.id, sku: product.sku },
        });

        if (!existing) {
            await prisma.product.create({
                data: {
                    tenantId: demoTenant.id,
                    sku: product.sku,
                    name: product.name,
                    type: product.type,
                    basePrice: product.basePrice,
                    sellPrice: product.sellPrice,
                    isFlexiblePrice: product.isFlexiblePrice,
                },
            });
            console.log(`✅ Created product: ${product.name}`);
        } else {
            console.log(`⏩ Product already exists: ${product.name}`);
        }
    }

    // Create a demo mechanic
    const demoMechanic = await prisma.mechanic.upsert({
        where: { id: 'demo-mechanic-id' },
        update: {},
        create: {
            id: 'demo-mechanic-id',
            tenantId: demoTenant.id,
            branchId: demoBranch.id,
            name: 'Budi Mekanik',
            phone: '08123456780',
            isActive: true,
        },
    });

    console.log('✅ Created demo mechanic:', demoMechanic.name);

    console.log('\n🎉 Seeding completed!');
    console.log('\n📋 Test Credentials:');
    console.log('   SUPERADMIN: superadmin / SuperAdmin123!');
    console.log('   OWNER: owner_demo / Owner123!');
    console.log('   CASHIER: cashier_demo / Cashier123!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
