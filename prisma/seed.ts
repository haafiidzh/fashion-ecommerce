import {PrismaClient} from "@/prisma/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Seed Roles
    const roles = await prisma.roles.createMany({
        data: [
            { name: 'admin', guard: 'web' },
            { name: 'customer', guard: 'web' },
            { name: 'staff', guard: 'web' },
        ],
    });
    console.log('✓ Roles seeded');

    // Seed Permissions
    const permissions = await prisma.permissions.createMany({
        data: [
            { name: 'manage_products', guard: 'web' },
            { name: 'manage_orders', guard: 'web' },
            { name: 'manage_users', guard: 'web' },
            { name: 'view_products', guard: 'web' },
            { name: 'create_order', guard: 'web' },
            { name: 'view_own_orders', guard: 'web' },
        ],
    });
    console.log('✓ Permissions seeded');

    // Seed Product Categories
    const categories = await prisma.product_category.createMany({
        data: [
            { name: 'Kaos' },
            { name: 'Kemeja' },
            { name: 'Celana' },
            { name: 'Jaket' },
            { name: 'Dress' },
            { name: 'Rok' },
            { name: 'Sepatu' },
            { name: 'Aksesoris' },
        ],
    });
    console.log('✓ Product Categories seeded');

    // Get category IDs
    const categoryList = await prisma.product_category.findMany();
    const categoryMap = Object.fromEntries(
        categoryList.map(c => [c.name, c.id])
    );

    // Seed Variants
    const variants = await prisma.variants.createMany({
        data: [
            { name: 'S' },
            { name: 'M' },
            { name: 'L' },
            { name: 'XL' },
            { name: 'XXL' },
            { name: 'Hitam' },
            { name: 'Putih' },
            { name: 'Merah' },
            { name: 'Biru' },
            { name: 'Hijau' },
        ],
    });
    console.log('✓ Variants seeded');

    const imageUrl = 'https://res.cloudinary.com/dr79rpzsv/image/upload/v1765980449/download_ibraug.jpg';

    // Seed Products - Kaos
    const kaosProducts = await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Kaos'],
                name: 'Kaos Polos Premium Cotton',
                slug: 'kaos-polos-premium-cotton',
                price: 85000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Kaos'],
                name: 'Kaos Oversize Streetwear',
                slug: 'kaos-oversize-streetwear',
                price: 120000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Kaos'],
                name: 'Kaos V-Neck Basic',
                slug: 'kaos-v-neck-basic',
                price: 75000,
                images: JSON.stringify([imageUrl]),
            },
        ],
    });

    // Seed Products - Kemeja
    await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Kemeja'],
                name: 'Kemeja Flanel Kotak-kotak',
                slug: 'kemeja-flanel-kotak-kotak',
                price: 150000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Kemeja'],
                name: 'Kemeja Formal Slim Fit',
                slug: 'kemeja-formal-slim-fit',
                price: 200000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Kemeja'],
                name: 'Kemeja Denim Casual',
                slug: 'kemeja-denim-casual',
                price: 180000,
                images: JSON.stringify([imageUrl]),
            },
        ],
    });

    // Seed Products - Celana
    await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Celana'],
                name: 'Celana Jeans Slim Fit',
                slug: 'celana-jeans-slim-fit',
                price: 250000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Celana'],
                name: 'Celana Chino Premium',
                slug: 'celana-chino-premium',
                price: 220000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Celana'],
                name: 'Celana Cargo Tactical',
                slug: 'celana-cargo-tactical',
                price: 280000,
                images: JSON.stringify([imageUrl]),
            },
        ],
    });

    // Seed Products - Jaket
    await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Jaket'],
                name: 'Jaket Bomber Pilot',
                slug: 'jaket-bomber-pilot',
                price: 350000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Jaket'],
                name: 'Jaket Hoodie Zipper',
                slug: 'jaket-hoodie-zipper',
                price: 200000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Jaket'],
                name: 'Jaket Jeans Denim',
                slug: 'jaket-jeans-denim',
                price: 300000,
                images: JSON.stringify([imageUrl]),
            },
        ],
    });

    // Seed Products - Dress
    await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Dress'],
                name: 'Dress Floral Maxi',
                slug: 'dress-floral-maxi',
                price: 320000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Dress'],
                name: 'Dress Midi Elegant',
                slug: 'dress-midi-elegant',
                price: 280000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Dress'],
                name: 'Dress Mini Party',
                slug: 'dress-mini-party',
                price: 250000,
                images: JSON.stringify([imageUrl]),
            },
        ],
    });

    // Seed Products - Rok
    await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Rok'],
                name: 'Rok Plisket Midi',
                slug: 'rok-plisket-midi',
                price: 150000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Rok'],
                name: 'Rok A-Line Casual',
                slug: 'rok-a-line-casual',
                price: 130000,
                images: JSON.stringify([imageUrl]),
            },
        ],
    });

    // Seed Products - Sepatu
    await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Sepatu'],
                name: 'Sneakers Canvas Classic',
                slug: 'sneakers-canvas-classic',
                price: 280000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Sepatu'],
                name: 'Sepatu Boots Kulit',
                slug: 'sepatu-boots-kulit',
                price: 450000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Sepatu'],
                name: 'Slip On Casual',
                slug: 'slip-on-casual',
                price: 200000,
                images: JSON.stringify([imageUrl]),
            },
        ],
    });

    // Seed Products - Aksesoris
    await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Aksesoris'],
                name: 'Topi Baseball Cap',
                slug: 'topi-baseball-cap',
                price: 75000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Aksesoris'],
                name: 'Tas Ransel Canvas',
                slug: 'tas-ransel-canvas',
                price: 180000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Aksesoris'],
                name: 'Ikat Pinggang Kulit',
                slug: 'ikat-pinggang-kulit',
                price: 120000,
                images: JSON.stringify([imageUrl]),
            },
            {
                category_id: categoryMap['Aksesoris'],
                name: 'Dompet Pria Minimalis',
                slug: 'dompet-pria-minimalis',
                price: 150000,
                images: JSON.stringify([imageUrl]),
            },
        ],
    });

    console.log('✓ Products seeded');

    // Link some products with variants
    const productList = await prisma.products.findMany({ take: 10 });
    const variantList = await prisma.variants.findMany();

    for (const product of productList) {
        // Add size variants (S, M, L, XL)
        for (let i = 0; i < 4; i++) {
            await prisma.product_variants.create({
                data: {
                    product_id: product.id,
                    variant_id: variantList[i].id,
                },
            });
        }
        // Add 2-3 color variants
        for (let i = 5; i < 8; i++) {
            await prisma.product_variants.create({
                data: {
                    product_id: product.id,
                    variant_id: variantList[i].id,
                },
            });
        }
    }

    console.log('✓ Product Variants seeded');
    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });