// client/src/utils/categoryPresets.js
// Preset attribute suggestions per kategori untuk membantu penjual elektronik
const categoryPresets = {
  Smartphone: [
    { name: 'Kapasitas', values: ['32GB', '64GB', '128GB', '256GB', '512GB'] },
    { name: 'Warna', values: ['Hitam', 'Putih', 'Biru', 'Merah', 'Gold', 'Silver'] },
    { name: 'Tipe', values: ['Standard', 'Pro', 'Pro Max', 'Ultra'] },
    { name: 'RAM', values: ['4GB', '6GB', '8GB', '12GB'] },
  ],
  Laptop: [
    { name: 'RAM', values: ['8GB', '16GB', '32GB', '64GB'] },
    { name: 'Storage', values: ['256GB', '512GB', '1TB', '2TB'] },
    { name: 'Warna', values: ['Silver', 'Space Gray', 'Hitam', 'Gold'] },
    { name: 'Tipe', values: ['Consumer', 'Gaming', 'Workstation', 'Ultrabook'] },
    { name: 'Processor', values: ['Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'] },
  ],
  Tablet: [
    { name: 'Kapasitas', values: ['64GB', '128GB', '256GB', '512GB'] },
    { name: 'Warna', values: ['Hitam', 'Putih', 'Silver', 'Gold'] },
    { name: 'Ukuran', values: ['8 inch', '10 inch', '12 inch', '13 inch'] },
  ],
  Headphone: [
    { name: 'Warna', values: ['Hitam', 'Putih', 'Merah', 'Biru', 'Silver', 'Gold'] },
    { name: 'Tipe', values: ['Wireless', 'Wired', 'Hybrid'] },
    { name: 'Noise Cancellation', values: ['Active', 'Passive', 'None'] },
  ],
  SSD: [
    { name: 'Kapasitas', values: ['256GB', '512GB', '1TB', '2TB', '4TB'] },
    { name: 'Form Factor', values: ['2.5"', 'M.2 NVMe', 'M.2 SATA'] },
    { name: 'Interface', values: ['SATA III', 'NVMe PCIe 3.0', 'NVMe PCIe 4.0', 'NVMe PCIe 5.0'] },
  ],
  Monitor: [
    { name: 'Ukuran', values: ['21.5"', '24"', '27"', '32"', '34"'] },
    { name: 'Resolusi', values: ['1080p', '1440p', '2160p (4K)', '5K'] },
    { name: 'Panel Type', values: ['IPS', 'TN', 'VA', 'OLED'] },
    { name: 'Refresh Rate', values: ['60Hz', '75Hz', '100Hz', '120Hz', '144Hz', '240Hz'] },
  ],
  Keyboard: [
    { name: 'Tipe Switch', values: ['Mechanical', 'Membrane', 'Scissor', 'Rubber Dome'] },
    { name: 'Koneksi', values: ['Wireless', 'Wired', 'Bluetooth'] },
    { name: 'Fitur Lighting', values: ['None', 'Single Color', 'RGB'] },
    { name: 'Layout', values: ['Full Size', 'TKL', '75%', '65%', '60%'] },
  ],
  Mouse: [
    { name: 'Tipe', values: ['Ergonomic', 'Gaming', 'Portable', 'Standard'] },
    { name: 'Koneksi', values: ['Wireless', 'Wired', 'Bluetooth'] },
    { name: 'DPI', values: ['3200', '6400', '8000', '12000', '16000'] },
    { name: 'Warna', values: ['Hitam', 'Putih', 'Abu-abu', 'RGB'] },
  ],
  Webcam: [
    { name: 'Resolusi', values: ['720p', '1080p', '2K', '4K'] },
    { name: 'Fokus', values: ['Fixed', 'Auto', 'Manual'] },
    { name: 'Fitur', values: ['Basic', 'With Microphone', 'With Auto-focus', 'Pro Features'] },
  ],
  RAM: [
    { name: 'Tipe', values: ['DDR4', 'DDR5'] },
    { name: 'Kapasitas', values: ['8GB', '16GB', '32GB', '64GB', '128GB'] },
    { name: 'Kecepatan', values: ['2666MHz', '3000MHz', '3200MHz', '3600MHz', '4000MHz', '5600MHz'] },
  ],
  Processor: [
    { name: 'Brand', values: ['Intel', 'AMD'] },
    { name: 'Generasi', values: ['10th Gen', '11th Gen', '12th Gen', '13th Gen', 'Ryzen 3000', 'Ryzen 5000', 'Ryzen 7000'] },
    { name: 'Cores', values: ['4 Cores', '6 Cores', '8 Cores', '12 Cores', '16 Cores'] },
    { name: 'TDP', values: ['35W', '45W', '65W', '95W', '105W', '125W'] },
  ],
  Handphone: [
    { name: 'Kapasitas', values: ['32GB', '64GB', '128GB', '256GB'] },
    { name: 'Warna', values: ['Hitam', 'Putih', 'Biru', 'Merah'] },
    { name: 'RAM', values: ['4GB', '6GB', '8GB'] },
  ],
};

export default categoryPresets;
