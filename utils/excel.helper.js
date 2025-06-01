const ExcelJS = require("exceljs");

async function generateStyledExcel(items) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data Barang");

  // Define header columns
  worksheet.columns = [
    { header: "No", key: "no", width: 5 },
    { header: "Nama Barang", key: "nama", width: 30 },
    { header: "Stok", key: "stok", width: 10 },
    { header: "Kategori", key: "kategori", width: 25 },
    { header: "Tanggal Dibuat", key: "createdAt", width: 20 },
  ];

  // Header style
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E88E5" },
  };
  worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

  // Insert data
  items.forEach((item, index) => {
    worksheet.addRow({
      no: index + 1,
      nama: item.nama,
      stok: item.stok,
      kategori: item.kategori?.nama || "-",
      createdAt: item.createdAt.toLocaleDateString("id-ID"),
    });
  });

  // Auto style rows
  worksheet.eachRow((row, rowNumber) => {
    row.alignment = { vertical: "middle", horizontal: "left" };
    row.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    if (rowNumber !== 1) {
      row.height = 20;
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = { generateStyledExcel };
