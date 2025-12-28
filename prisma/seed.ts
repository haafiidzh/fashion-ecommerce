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

    // ==========================================
    // PERBAIKAN 1: Seed Variant Types (Tipe Varian)
    // ==========================================
    // Sekarang kita hanya menyimpan nama TIPENYA (misal: "Warna", "Ukuran")
    const variantTypes = await prisma.variants.createMany({
        data: [
            { name: 'Ukuran' },
            { name: 'Warna' },
        ],
    });
    console.log('✓ Variant Types seeded');

    // Ambil ID tipe varian untuk dipakai di product_variants
    const variantsDb = await prisma.variants.findMany();
    const variantMap = Object.fromEntries(variantsDb.map(v => [v.name, v.id]));

    // Define two Cloudinary images
    const imageUrls = [
        'https://res.cloudinary.com/dr79rpzsv/image/upload/v1765980449/download_ibraug.jpg',
        'https://res.cloudinary.com/dr79rpzsv/image/upload/v1765980450/sample_dj0hkp.jpg'
    ];

    // Seed Products - Kaos
    await prisma.products.createMany({
        data: [
            {
                category_id: categoryMap['Kaos'],
                name: 'Kaos Polos Premium Cotton',
                slug: 'kaos-polos-premium-cotton',
                price: 85000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Kaos'],
                name: 'Kaos Oversize Streetwear',
                slug: 'kaos-oversize-streetwear',
                price: 120000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Kaos'],
                name: 'Kaos V-Neck Basic',
                slug: 'kaos-v-neck-basic',
                price: 75000,
                images: JSON.stringify(imageUrls),
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
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Kemeja'],
                name: 'Kemeja Formal Slim Fit',
                slug: 'kemeja-formal-slim-fit',
                price: 200000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Kemeja'],
                name: 'Kemeja Denim Casual',
                slug: 'kemeja-denim-casual',
                price: 180000,
                images: JSON.stringify(imageUrls),
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
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Celana'],
                name: 'Celana Chino Premium',
                slug: 'celana-chino-premium',
                price: 220000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Celana'],
                name: 'Celana Cargo Tactical',
                slug: 'celana-cargo-tactical',
                price: 280000,
                images: JSON.stringify(imageUrls),
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
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Jaket'],
                name: 'Jaket Hoodie Zipper',
                slug: 'jaket-hoodie-zipper',
                price: 200000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Jaket'],
                name: 'Jaket Jeans Denim',
                slug: 'jaket-jeans-denim',
                price: 300000,
                images: JSON.stringify(imageUrls),
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
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Dress'],
                name: 'Dress Midi Elegant',
                slug: 'dress-midi-elegant',
                price: 280000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Dress'],
                name: 'Dress Mini Party',
                slug: 'dress-mini-party',
                price: 250000,
                images: JSON.stringify(imageUrls),
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
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Rok'],
                name: 'Rok A-Line Casual',
                slug: 'rok-a-line-casual',
                price: 130000,
                images: JSON.stringify(imageUrls),
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
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Sepatu'],
                name: 'Sepatu Boots Kulit',
                slug: 'sepatu-boots-kulit',
                price: 450000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Sepatu'],
                name: 'Slip On Casual',
                slug: 'slip-on-casual',
                price: 200000,
                images: JSON.stringify(imageUrls),
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
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Aksesoris'],
                name: 'Tas Ransel Canvas',
                slug: 'tas-ransel-canvas',
                price: 180000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Aksesoris'],
                name: 'Ikat Pinggang Kulit',
                slug: 'ikat-pinggang-kulit',
                price: 120000,
                images: JSON.stringify(imageUrls),
            },
            {
                category_id: categoryMap['Aksesoris'],
                name: 'Dompet Pria Minimalis',
                slug: 'dompet-pria-minimalis',
                price: 150000,
                images: JSON.stringify(imageUrls),
            },
        ],
    });

    console.log('✓ Products seeded');

    // ==========================================
    // PERBAIKAN 2: Link Products with Variants (Values)
    // ==========================================
    const productList = await prisma.products.findMany();

    // Definisikan opsi nilai varian
    const sizeOptions = ['S', 'M', 'L', 'XL'];
    const colorOptions = ['Hitam', 'Putih', 'Merah', 'Biru'];

    const variantDataToInsert: { product_id: number; variant_id: number; name: string; stock: number; price: null; }[] = [];

    // Siapkan data mass insert
    productList.forEach((product) => {
        // 1. Tambahkan varian Ukuran
        sizeOptions.forEach(size => {
            variantDataToInsert.push({
                product_id: product.id,
                variant_id: variantMap['Ukuran'], // Link ke tipe "Ukuran"
                name: size,                       // Nilai: "S", "M", dst
                stock: 50,                        // Dummy stock
                price: null                       // Harga default produk
            });
        });

        // 2. Tambahkan varian Warna
        colorOptions.forEach(color => {
            variantDataToInsert.push({
                product_id: product.id,
                variant_id: variantMap['Warna'],  // Link ke tipe "Warna"
                name: color,                      // Nilai: "Hitam", "Putih", dst
                stock: 50,
                price: null
            });
        });
    });

    // Insert semua variants sekaligus (lebih cepat)
    await prisma.product_variants.createMany({
        data: variantDataToInsert,
        skipDuplicates: true,
    });

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