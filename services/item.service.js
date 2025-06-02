const { Barang, Kategori } = require("../models");
const { Op, literal } = require("sequelize");
const ExcelJS = require("exceljs");
const fs = require("fs");

exports.findAll = async (q, limit, offset) => {
  const isSearch = !!q;
  const isNumeric = !isNaN(q);

  let whereCondition = {};
  if (isSearch) {
    const orConditions = [
      { nama: { [Op.like]: `%${q}%` } },
    ];

    if (isNumeric) {
      orConditions.push({ stok: parseInt(q) });
    }

    orConditions.push(
      literal(`EXISTS (
        SELECT 1 FROM Kategoris AS kategori
        WHERE kategori.id = Barang.kategoriId
        AND kategori.nama LIKE '%${q}%'
      )`)
    );

    whereCondition = {
      [Op.or]: orConditions,
    };
  }

  const kategoriInclude = {
    model: Kategori,
    as: "kategori",
    required: false,
  };

  return await Barang.findAndCountAll({
    where: whereCondition,
    include: [kategoriInclude],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
};

exports.findById = async (id) => {
  return await Barang.findByPk(id, {
    include: { model: Kategori, as: "kategori" },
  });
};

exports.create = async (payload) => {
  return await Barang.create(payload);
};

exports.update = async (item, payload) => {
  return await item.update(payload);
};

exports.remove = async (item) => {
  return await item.destroy();
};

exports.exportItems = async (filters = {}) => {
  try {
    const { q, kategori, stok } = filters;

    const whereClause = {};
    const kategoriWhere = {};

    if (q) {
      whereClause.nama = { [Op.like]: `%${q}%` };
    }

    if (stok) {
      whereClause.stok = Number(stok);
    }

    if (kategori) {
      kategoriWhere.nama = { [Op.like]: `%${kategori}%` };
    }

    const items = await Barang.findAll({
      where: whereClause,
      include: [
        {
          model: Kategori,
          as: "kategori",
          attributes: ["nama"],
          where: Object.keys(kategoriWhere).length ? kategoriWhere : undefined,
        },
      ],
    });

    if (!items || items.length === 0) {
      throw new Error("Barang tidak ditemukan");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Daftar Barang");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama Barang", key: "nama", width: 30 },
      { header: "Stok", key: "stok", width: 10 },
      { header: "Kategori", key: "kategori", width: 20 },
      { header: "Tanggal Dibuat", key: "createdAt", width: 25 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDCE6F1" },
      };
      cell.border = { bottom: { style: "thin" } };
    });

    items.forEach((item, index) => {
      worksheet.addRow({
        no: index + 1,
        nama: item.nama,
        stok: item.stok,
        kategori: item.kategori?.nama || "-",
        createdAt: item.createdAt.toLocaleString(),
      });
    });

    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error("[Export Error]", error.message);
    throw error;
  }
};

exports.importItems = async (filePath) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet =
      workbook.getWorksheet("Daftar Barang") || workbook.worksheets[0];

    const rows = worksheet.getSheetValues().slice(2);

    let importedCount = 0;

    for (const row of rows) {
      if (!row || !row[2] || !row[3] || !row[4]) continue;

      const nama = row[2]?.toString().trim();
      const stok = parseInt(row[3]);
      const kategoriName = row[4]?.toString().trim();

      if (!nama || isNaN(stok) || !kategoriName) continue;

      const [kategori] = await Kategori.findOrCreate({
        where: { nama: kategoriName },
      });

      await Barang.create({
        nama,
        stok,
        kategoriId: kategori.id,
      });

      importedCount++;
    }

    fs.unlinkSync(filePath);

    return importedCount;
  } catch (error) {
    console.error("[Import Error]", error.message);
    throw error;
  }
};
