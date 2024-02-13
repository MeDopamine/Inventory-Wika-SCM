import { Request, Response } from "express";
import Inventory from "../db/models/inventory";
import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";
import xlsx from "xlsx";
import { Op, literal, fn, col } from "sequelize";
import { Sequelize } from "sequelize";
import databaseConfig from "../config/database";
import { en } from "@faker-js/faker";
import * as querystring from 'querystring';
import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

const inventoryContorller = {
    getTest: async (req: Request, res: Response) => {
        const indexPath = path.join(__dirname, "..", "index.html");
        return res.status(200).sendFile(indexPath);
    },
    // getDataExportExcel : async (req: Request, res: Response) => {
    //     try {
    //         // const customers = await inventoryContorller.getData();
            
    //         const rawData = await inventoryContorller.getData();
    //         const customers = JSON.stringify(rawData);
    //         console.log(customers);
            
            
    //         // Fetch your data to be exported (replace this with your actual data fetching logic)
    //         // const exportExcel = (data) => {
    //         //     const worksheet = XLSX.utils.json_to_sheet(data);
    //         //     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    //         //     return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //         // };
    //         const anykosong:any[] = ['']
    //         // Export data to Excel
    //         // const excelBuffer = exportExcel(customers);
    //         // const excelBuffer = exportExcel(customers?customers:anykosong);
    //         // Respond with the Excel file
    //         // res.setHeader('Content-Disposition', 'attachment; filename=products_export.xlsx');
    //         // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8');
    //         // res.end(Buffer.from(excelBuffer), 'binary');
    //     } catch (error) {
    //         console.error('Error exporting Excel:', error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // },
    getAllDataExportExcel: async (req: Request, res: Response) => {
        try {
            // const customers = await inventoryContorller.getData();
            
            // const rawlazyData = await inventoryContorller.getLazyData();
            const rawData = await inventoryContorller.getData();
            // const customers = JSON.stringify(rawData);
            const customers = JSON.parse(JSON.stringify(rawData));
            

            // const transformedResponse = customers.map((item:any) => {
            //     const transformedItem: { [key: string]: any } = {};
                
            //     // Iterate through the keys of each object and modify them
            //     for (const key in item) {
            //         if (Object.prototype.hasOwnProperty.call(item, key)) {
            //             // Transform key (e.g., 'kodeProjek' to 'kode Projek')
            //             const transformedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
            //             transformedItem[transformedKey] = item[key];
            //         }
            //     }
    
            //     return transformedItem;
            // });
            const transformedResponse = customers.map((item:any) => {
                const transformedItem: { [key: string]: any } = {};
    
                // Define key transformations
                const keyTransformations: { [key: string]: string } = {
                    id: 'Nomor',
                    kodeProjek: 'Kode Projek',
                    namaProjek: 'Nama Projek Aktif',
                    statusProjek: 'Status Projek',
                    koedDivisi: 'Koed Divisi',
                    namaDivisi: 'Nama Divisi',
                    kodeDepartemen: 'Kode Departemen',
                    namaDepartemen: 'Nama Departemen',
                    kodeMaterialGrup: 'Kode Material Grup',
                    namaMaterialGrup: 'Nama Material Grup',
                    kodeMaterial: 'Kode Material',
                    namaMaterial: 'Nama Material',
                    uom: 'UOM',
                    nomorPo: 'Nomor Po',
                    tanggalPo: 'Tanggal Po',
                    poQuantity: 'PO Quantity', // Mengganti koma dengan titik
                    poPrice: 'PO Price', // Mengganti koma dengan titik
                    poTotalValue: 'PO Total Value',
                    kodeVendor: 'Kode Vendor',
                    namaVendor: 'Nama Vendor',
                    kodeGr: 'Kode Gr',
                    tanggalGr: 'Tanggal Gr',
                    grQuantity: 'GR Quantity', // Mengganti koma dengan titik
                    grValue: 'GR Value', // Mengganti koma dengan titik
                    outstandingGr: 'Outstanding GR', // Mengganti koma dengan titik
                    kodeGi: 'Kode Gi',
                    tanggalGi: 'Tanggal Gi',
                    giQuantity: 'GI Quantity', // Mengganti koma dengan titik
                    giValue: 'GI Value', // Mengganti koma dengan titik
                    inventory: 'Inventory', // Mengganti koma dengan titik
                    inventorValue: 'Inventor Val'

                };
    
                // Iterate through the keys of each object and modify them
                for (const key in item) {
                    if (Object.prototype.hasOwnProperty.call(item, key)) {
                        const transformedKey = keyTransformations[key] || key;
                        transformedItem[transformedKey] = item[key];
                    }
                }
    
                return transformedItem;
            });
            // console.log(transformedResponse);
    
            // Fetch your data to be exported (replace this with your actual data fetching logic)
            const exportExcel = (data: { [key: string]: any }[]) => {
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
                return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            };
    
            // Export data to Excel
            const excelBuffer = exportExcel(transformedResponse);
            // const excelBuffer = exportExcel(customers);
            // const excelBuffer = exportExcel(customers ? customers : anykosong);
            // Respond with the Excel file
            res.setHeader('Content-Disposition', 'attachment; filename=products_export.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8');
            res.end(Buffer.from(excelBuffer), 'binary');
        } catch (error) {
            console.error('Error exporting Excel:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    
    getData: async (_req?: Request, _res?: Response): Promise<any[]> => {
        try {
            const response = await Inventory.findAll();
            // Return the JSON response directly
            // return _res?.json(response) as any[];
            return response;
        } catch (error) {
            console.error('Error fetching data:', error);
            // Return an error response in case of failure
            return [];
        }
    },

    getFilterDataExportExcel: async (req: Request, res: Response) => {
        try {
            const { lazyEvent } = req.query as { lazyEvent?: string };

            if (!lazyEvent) {
                res.status(400).json({ error: "Bad Request" });
                return;
            }
            const { first, rows, page, sortField, sortOrder, filters } = JSON.parse(lazyEvent);
            const offset = first ? parseInt(first) : 0; // Default offset ke 0 jika tidak ada nilai
            const limit = rows ? parseInt(rows) : 10; // Default limit ke 10 jika tidak ada nilai
            interface FilterStruct {
                value: string;
                matchMode: string;
            }
            const createLikeOperators = (arr: string[]) => arr.map(value => ({ [Op.like]: `%${value}%` }));

            const getFilter = (filter:any, key:any) => 
            filter.constraints[0].value ? { [key]: { [Op.or]: filter.constraints.map((f:any) => f.value) } } : undefined;

            const namaProjek = getFilter(filters.namaProjek, 'namaProjek');
            const namaVendor = getFilter(filters.namaVendor, 'namaVendor');
            const kodeMaterial = getFilter(filters.kodeMaterial, 'kodeMaterial');
            const namaMaterial = getFilter(filters.namaMaterial, 'namaMaterial');
            const nomorPo = getFilter(filters.nomorPo, 'nomorPo');

            const kodeMaterialGrupFilter: string[] =
                filters.kodeMaterialGrup.constraints.map(
                    (kodeMaterialGrup: FilterStruct) => kodeMaterialGrup.value ? kodeMaterialGrup.value.slice(0, 2) : undefined
                );
            const mappedOperators = createLikeOperators(kodeMaterialGrupFilter);
            const kodeMaterialGrup = 
                filters.kodeMaterialGrup.constraints[0].value? {
                    kodeMaterialGrup: {
                        [Op.or]: mappedOperators,
                    },
                }
                : undefined;

            const where = {
            ...namaProjek,
            ...namaVendor,
            ...kodeMaterial,
            ...namaMaterial,
            ...kodeMaterialGrup,
            ...nomorPo,
            } || undefined;
            const globalSearchTerm = filters.global.value;
            let tanggalPo = filters.tanggalPo.constraints;
            let startPoDate = filters.tanggalPo.constraints[0].value ? new Date(filters.tanggalPo.constraints[0].value) : undefined;
            let endPoDate = filters.tanggalPo.constraints[1]?.value;
            startPoDate?.setDate(startPoDate.getDate() + 1);
            const convertedStartDateString = startPoDate?.toISOString().split("T")[0];

            const convertedEndDateString = endPoDate?.split("T")[0];

            const dateCondition: any = endPoDate ? {
                    tanggalPo: {
                        [Op.between]: [fn("DATE", startPoDate), fn("DATE", endPoDate)],
                    },
            } : {
                    tanggalPo: {
                        [Op.eq]: fn("DATE", startPoDate),
                    },
            };

            const dateConditionCheck: any = startPoDate ? dateCondition : undefined;

            const dataFull: Inventory[] = await Inventory.findAll();

            const field = dataFull?.length > 0 ? Object.keys(dataFull[0].dataValues) : [];

            const conditions = field.map((column) => ({
                [column]: { [Op.like]: `%${globalSearchTerm}%` },
            }));

            const globalSearchCondition = globalSearchTerm ? { [Op.or]: conditions } : undefined;

            // const data: Inventory[] = await Inventory.findAll({
            //     offset,
            //     limit,
            //     order: [
            //         ["namaProjek", "ASC"],
            //         ["namaVendor", "ASC"],
            //         ["namaMaterial", "ASC"],
            //         ["kodeMaterial", "ASC"],
            //     ],
            //     where: {
            //         [Op.and]: [
            //             globalSearchCondition, 
            //             where, 
            //             dateConditionCheck
            //         ],
            //     } || undefined,
            // });
            // const customers = JSON.parse(JSON.stringify(data));
            const customers = await Inventory.findAll({
                offset,
                // limit,
                order: [
                    ["namaProjek", "ASC"],
                    ["namaVendor", "ASC"],
                    ["namaMaterial", "ASC"],
                    ["kodeMaterial", "ASC"],
                ],
                where: {
                    [Op.and]: [
                        globalSearchCondition,
                        where,
                        dateConditionCheck
                    ],
                } || undefined,
                raw: true, // Mengembalikan hasil dalam bentuk objek JSON langsung
            });
            
            // customers sekarang adalah array objek JSON yang langsung dapat digunakan
            
            

            const transformedResponse = customers.map((item:any) => {
                const transformedItem: { [key: string]: any } = {};
    
                // Define key transformations
                const keyTransformations: { [key: string]: string } = {
                    id: 'Nomor',
                    kodeProjek: 'Kode Projek',
                    namaProjek: 'Nama Projek Aktif',
                    statusProjek: 'Status Projek',
                    koedDivisi: 'Koed Divisi',
                    namaDivisi: 'Nama Divisi',
                    kodeDepartemen: 'Kode Departemen',
                    namaDepartemen: 'Nama Departemen',
                    kodeMaterialGrup: 'Kode Material Grup',
                    namaMaterialGrup: 'Nama Material Grup',
                    kodeMaterial: 'Kode Material',
                    namaMaterial: 'Nama Material',
                    uom: 'UOM',
                    nomorPo: 'Nomor Po',
                    tanggalPo: 'Tanggal Po',
                    poQuantity: 'PO Quantity', // Mengganti koma dengan titik
                    poPrice: 'PO Price', // Mengganti koma dengan titik
                    poTotalValue: 'PO Total Value',
                    kodeVendor: 'Kode Vendor',
                    namaVendor: 'Nama Vendor',
                    kodeGr: 'Kode Gr',
                    tanggalGr: 'Tanggal Gr',
                    grQuantity: 'GR Quantity', // Mengganti koma dengan titik
                    grValue: 'GR Value', // Mengganti koma dengan titik
                    outstandingGr: 'Outstanding GR', // Mengganti koma dengan titik
                    kodeGi: 'Kode Gi',
                    tanggalGi: 'Tanggal Gi',
                    giQuantity: 'GI Quantity', // Mengganti koma dengan titik
                    giValue: 'GI Value', // Mengganti koma dengan titik
                    inventory: 'Inventory', // Mengganti koma dengan titik
                    inventorValue: 'Inventor Val'

                };
    
                // Iterate through the keys of each object and modify them
                for (const key in item) {
                    if (Object.prototype.hasOwnProperty.call(item, key)) {
                        const transformedKey = keyTransformations[key] || key;
                        transformedItem[transformedKey] = item[key];
                    }
                }
    
                return transformedItem;
            });
            // console.log(transformedResponse);
    
            // Fetch your data to be exported (replace this with your actual data fetching logic)
            const exportExcel = (data: { [key: string]: any }[]) => {
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
                return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            };
    
            // Export data to Excel
            const excelBuffer = exportExcel(transformedResponse);
            // const excelBuffer = exportExcel(customers);
            // const excelBuffer = exportExcel(customers ? customers : anykosong);
            // Respond with the Excel file
            res.setHeader('Content-Disposition', 'attachment; filename=products_export.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8');
            res.end(Buffer.from(excelBuffer), 'binary');

            // res.json({
            //     data,
            // });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    // getData: async (req: Request, res: Response) => {
    // getData: async (_req?: Request, _res?: Response): Promise<any[]> => {
    //     try {
    //         const response = await Inventory.findAll();
    //         return _res?.json(response);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         return [];
    //     }
    // },
    // getData: async (req: Request, res: Response) => {
    //     try {
    //         const response = await Inventory.findAll()
    //         console.log(response);
    //         res.json(response);
    //         // res.json({
    //         //     data: response,
    //         //     totalRecords: 100
    //         // });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    
    // exportExcel : (data: any[]) => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    //     return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // };
    // passingData: 
    getLazyData: async (req: Request, res: Response) => {
        try {
            const { lazyEvent } = req.query as { lazyEvent?: string };

            if (!lazyEvent) {
                res.status(400).json({ error: "Bad Request" });
                return;
            }
            const { first, rows, page, sortField, sortOrder, filters } = JSON.parse(lazyEvent);
            console.log('lazy event: ',lazyEvent);
            console.log('first: ',first);
            console.log('row: ',rows);
            console.log('page: ',page);
            console.log('sortfield: ',sortField);
            console.log('sortorder: ',sortOrder);
            console.log('filter: ',filters.namaProjek.constraints);
            
            const offset = first ? parseInt(first) : 0; // Default offset ke 0 jika tidak ada nilai
            const limit = rows ? parseInt(rows) : 10; // Default limit ke 10 jika tidak ada nilai
            interface FilterStruct {
                value: string;
                matchMode: string;
            }
            const createLikeOperators = (arr: string[]) => arr.map(value => ({ [Op.like]: `%${value}%` }));

            const getFilter = (filter:any, key:any) => 
            filter.constraints[0].value ? { [key]: { [Op.or]: filter.constraints.map((f:any) => f.value) } } : undefined;

            const namaProjek = getFilter(filters.namaProjek, 'namaProjek');
            const namaVendor = getFilter(filters.namaVendor, 'namaVendor');
            const kodeMaterial = getFilter(filters.kodeMaterial, 'kodeMaterial');
            const namaMaterial = getFilter(filters.namaMaterial, 'namaMaterial');
            const nomorPo = getFilter(filters.nomorPo, 'nomorPo');

            const kodeMaterialGrupFilter: string[] =
                filters.kodeMaterialGrup.constraints.map(
                    (kodeMaterialGrup: FilterStruct) => kodeMaterialGrup.value ? kodeMaterialGrup.value.slice(0, 2) : undefined
                );
            const mappedOperators = createLikeOperators(kodeMaterialGrupFilter);
            const kodeMaterialGrup = 
                filters.kodeMaterialGrup.constraints[0].value? {
                    kodeMaterialGrup: {
                        [Op.or]: mappedOperators,
                    },
                }
                : undefined;

            const where = {
            ...namaProjek,
            ...namaVendor,
            ...kodeMaterial,
            ...namaMaterial,
            ...kodeMaterialGrup,
            ...nomorPo,
            } || undefined;
            const globalSearchTerm = filters.global.value;
            let tanggalPo = filters.tanggalPo.constraints;
            let startPoDate = filters.tanggalPo.constraints[0].value ? new Date(filters.tanggalPo.constraints[0].value) : undefined;
            let endPoDate = filters.tanggalPo.constraints[1]?.value;
            startPoDate?.setDate(startPoDate.getDate() + 1);
            const convertedStartDateString = startPoDate?.toISOString().split("T")[0];

            const convertedEndDateString = endPoDate?.split("T")[0];

            const dateCondition: any = endPoDate ? {
                    tanggalPo: {
                        [Op.between]: [fn("DATE", startPoDate), fn("DATE", endPoDate)],
                    },
            } : {
                    tanggalPo: {
                        [Op.eq]: fn("DATE", startPoDate),
                    },
            };

            const dateConditionCheck: any = startPoDate ? dateCondition : undefined;

            const dataFull: Inventory[] = await Inventory.findAll();

            const field = dataFull?.length > 0 ? Object.keys(dataFull[0].dataValues) : [];

            const conditions = field.map((column) => ({
                [column]: { [Op.like]: `%${globalSearchTerm}%` },
            }));

            const globalSearchCondition = globalSearchTerm ? { [Op.or]: conditions } : undefined;

            const data: Inventory[] = await Inventory.findAll({
                offset,
                limit,
                order: [
                    ["namaProjek", "ASC"],
                    ["namaVendor", "ASC"],
                    ["namaMaterial", "ASC"],
                    ["kodeMaterial", "ASC"],
                ],
                where: {
                    [Op.and]: [
                        globalSearchCondition, 
                        where, 
                        dateConditionCheck
                    ],
                } || undefined,
            });

            const [dataMaterial, dataProjek] = await Promise.all([
                Inventory.findAll({
                    attributes: [
                        "namaMaterial",
                        "uom",
                        [Sequelize.literal("SUM(inventorValue)"), "value"],
                        [Sequelize.literal("SUM(inventory)"), "quantity"],
                    ],
                    group: ["namaMaterial"],
                    order: [[Sequelize.literal("value"), "DESC"]],
                    limit: 10,
                }),
                Inventory.findAll({
                    attributes: [
                        "namaProjek",
                        [Sequelize.literal("SUM(inventorValue)"), "total_value"],
                        [
                            Sequelize.literal(
                                `CONCAT('[',GROUP_CONCAT(CONCAT('{"material": "', REPLACE(namaMaterial, '"', "'"), '", "value": ', inventorValue, '}') ORDER BY namaMaterial ASC), ']')`
                            ),
                            "pd", // Rename the alias to 'pd'
                        ],
                    ],
                    group: ["namaProjek"],
                    order: [[Sequelize.literal("total_value"), "DESC"]],
                    limit: 10,
                }),
            ]);

            const dataTopPerSumberDaya: any = {
                Data1: dataMaterial.map((item) => ({
                    namaMaterial: item.dataValues.namaMaterial,
                    uom: item.dataValues.uom,
                    value: item.dataValues.value,
                    quantity: item.dataValues.quantity,
                })),
                Data2: dataProjek.map((item) => ({
                    namaProjek: item.dataValues.namaProjek,
                    total_value: item.dataValues.total_value,
                    pd: item.dataValues.pd,
                })),
            };

            const dataFullSearch: Inventory[] = await Inventory.findAll({
                where: {
                    [Op.and]: [
                        globalSearchCondition,
                        where,
                        dateConditionCheck,
                    ],
                },
            });

            const totalRecords = await Inventory.count({
                where:
                    {
                        [Op.and]: [
                            globalSearchCondition,
                            where,
                            dateConditionCheck,
                        ],
                    } || undefined,
            });

            function getUniqueOptions(
                dataFull: any[],
                propertyName: string
            ): { [key: string]: any[] } {
                const uniqueValues = new Set(
                    dataFull.map((item) => item[propertyName])
                );
                const result = Array.from(uniqueValues).map((value) => ({
                    [propertyName]: value,
                }));
                return { [propertyName]: result };
            }

            const opsiMultiselect: { [key: string]: any[] } = {
                ...getUniqueOptions(dataFull, "namaProjek"),
                ...getUniqueOptions(dataFull, "namaVendor"),
                ...getUniqueOptions(dataFull, "kodeMaterial"),
                ...getUniqueOptions(dataFull, "nomorPo"),
                ...getUniqueOptions(dataFull, "kodeMaterialGrup"),
                ...getUniqueOptions(dataFull, "namaMaterial"),
            };

            const uniqueProjects = new Set(dataFull?.map((project) => project.namaProjek));

            const totalProjek = uniqueProjects.size;

            const calculateInventorValue = (item: { id: number; inventorValue?: String | null }) => {
                // Periksa apakah inventorValue tidak null atau undefined sebelum mengonversi
                const inventorValue =
                    typeof item.inventorValue === "string"
                        ? parseFloat(item.inventorValue)
                        : 0; // Nilai default jika inventorValue bukan tipe data string
            
                // Kembalikan objek baru yang hanya berisi id dan inventorValue dari item
                return {
                    id: item.id,
                    inventorValue,
                };
            };
            const calculateInventorQty = (item: { id: number; inventory?: String | null }) => {
                // Periksa apakah inventor tidak null atau undefined sebelum mengonversi
                const inventoryQty =
                    typeof item.inventory === "string"
                        ? parseFloat(item.inventory)
                        : 0; // Nilai default jika inventorValue bukan tipe data string
            
                // Kembalikan objek baru yang hanya berisi id dan inventorValue dari item
                return {
                    id: item.id,
                    inventoryQty,
                };
            };
            
            const hasil = dataFull.map(calculateInventorValue);
            const hasil2 = dataFullSearch.map(calculateInventorValue);
            const hasil3 = dataFullSearch.map(calculateInventorQty);
            
            const calculateTotalInventorValue = (accumulator: number, currentValue: { id: number; inventorValue: number }) => {
                return accumulator + currentValue.inventorValue;
            };
            const calculateTotalInventorQty = (accumulator: number, currentValue: { id: number; inventoryQty: number }) => {
                return accumulator + currentValue.inventoryQty;
            };
            
            const valueInventory = hasil.reduce(calculateTotalInventorValue, 0);
            const subValueInventory = hasil2.reduce(calculateTotalInventorValue, 0);
            const valueInventoryQty = hasil3.reduce(calculateTotalInventorQty, 0);

            const formatCurrency = (value: any) => {
                const floatValue = parseFloat(value);
                return floatValue.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                });
            };
            
            const entriesWhere = Object.entries(where); // [["a", 1], ["b", 2], ["c", 3]]
            const isEmpty = entriesWhere.length === 0 && globalSearchCondition === undefined && dateConditionCheck === undefined;
            const subTotalValueInventory = isEmpty ? 0 : formatCurrency(subValueInventory);
            const totalValueInventory = formatCurrency(valueInventory);
            const subTotalValueInventoryQty = isEmpty ? 0 : valueInventoryQty;
            // passingData = 
            res.json({
                data,
                totalRecords,
                opsiMultiselect,
                totalProjek,
                totalValueInventory,
                subTotalValueInventory,
                dataTopPerSumberDaya,
                subTotalValueInventoryQty
            });
            // return data
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    getTotalMaterialQty: async (req: Request, res: Response) => {
        try {
            const { lazyEvent } = req.query as { lazyEvent?: string };

            if (!lazyEvent) {
                res.status(400).json({ error: "Bad Request" });
                return;
            }
            const { first, rows, page, sortField, sortOrder, filters } = JSON.parse(lazyEvent);
            console.log('lazy event: ',lazyEvent);
            console.log('first: ',first);
            console.log('row: ',rows);
            console.log('page: ',page);
            console.log('sortfield: ',sortField);
            console.log('sortorder: ',sortOrder);
            console.log('filter: ',filters.namaProjek.constraints);
            
            const offset = first ? parseInt(first) : 0; // Default offset ke 0 jika tidak ada nilai
            const limit = rows ? parseInt(rows) : 10; // Default limit ke 10 jika tidak ada nilai
            interface FilterStruct {
                value: string;
                matchMode: string;
            }
            const createLikeOperators = (arr: string[]) => arr.map(value => ({ [Op.like]: `%${value}%` }));

            const getFilter = (filter:any, key:any) => 
            filter.constraints[0].value ? { [key]: { [Op.or]: filter.constraints.map((f:any) => f.value) } } : undefined;

            const namaProjek = getFilter(filters.namaProjek, 'namaProjek');
            const namaVendor = getFilter(filters.namaVendor, 'namaVendor');
            const kodeMaterial = getFilter(filters.kodeMaterial, 'kodeMaterial');
            const namaMaterial = getFilter(filters.namaMaterial, 'namaMaterial');
            const nomorPo = getFilter(filters.nomorPo, 'nomorPo');

            const kodeMaterialGrupFilter: string[] =
                filters.kodeMaterialGrup.constraints.map(
                    (kodeMaterialGrup: FilterStruct) => kodeMaterialGrup.value ? kodeMaterialGrup.value.slice(0, 2) : undefined
                );
            const mappedOperators = createLikeOperators(kodeMaterialGrupFilter);
            const kodeMaterialGrup = 
                filters.kodeMaterialGrup.constraints[0].value? {
                    kodeMaterialGrup: {
                        [Op.or]: mappedOperators,
                    },
                }
                : undefined;

            const where = {
            ...namaProjek,
            ...namaVendor,
            ...kodeMaterial,
            ...namaMaterial,
            ...kodeMaterialGrup,
            ...nomorPo,
            } || undefined;
            const globalSearchTerm = filters.global.value;
            let startPoDate = filters.tanggalPo.constraints[0].value ? new Date(filters.tanggalPo.constraints[0].value) : undefined;
            let endPoDate = filters.tanggalPo.constraints[1]?.value;
            startPoDate?.setDate(startPoDate.getDate() + 1);

            const dateCondition: any = endPoDate ? {
                    tanggalPo: {
                        [Op.between]: [fn("DATE", startPoDate), fn("DATE", endPoDate)],
                    },
            } : {
                    tanggalPo: {
                        [Op.eq]: fn("DATE", startPoDate),
                    },
            };

            const dateConditionCheck: any = startPoDate ? dateCondition : undefined;

            const dataFull: Inventory[] = await Inventory.findAll();

            const field = dataFull?.length > 0 ? Object.keys(dataFull[0].dataValues) : [];

            const conditions = field.map((column) => ({
                [column]: { [Op.like]: `%${globalSearchTerm}%` },
            }));

            const globalSearchCondition = globalSearchTerm ? { [Op.or]: conditions } : undefined;




            const dataFullSearch: Inventory[] = await Inventory.findAll({
                where: {
                    [Op.and]: [
                        globalSearchCondition,
                        where,
                        dateConditionCheck,
                    ],
                },
            });






            const calculateInventorQty = (item: { id: number; inventory?: String | null }) => {
                // Periksa apakah inventor tidak null atau undefined sebelum mengonversi
                const inventoryQty =
                    typeof item.inventory === "string"
                        ? parseFloat(item.inventory)
                        : 0; // Nilai default jika inventorValue bukan tipe data string
            
                // Kembalikan objek baru yang hanya berisi id dan inventorValue dari item
                return {
                    id: item.id,
                    inventoryQty,
                };
            };
            
            const hasil3 = dataFullSearch.map(calculateInventorQty);
            
            const calculateTotalInventorQty = (accumulator: number, currentValue: { id: number; inventoryQty: number }) => {
                return accumulator + currentValue.inventoryQty;
            };
            
            const valueInventoryQty = hasil3.reduce(calculateTotalInventorQty, 0);

            const formatCurrency = (value: any) => {
                const floatValue = parseFloat(value);
                return floatValue.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                });
            };
            
            const entriesWhere = Object.entries(where); // [["a", 1], ["b", 2], ["c", 3]]
            const isEmpty = entriesWhere.length === 0 && globalSearchCondition === undefined && dateConditionCheck === undefined;
            const subTotalValueInventoryQty = isEmpty ? 0 : valueInventoryQty;
            // passingData = 
            res.json({
                subTotalValueInventoryQty
            });
            // return data
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    

    geDataDashboard: async (req: Request, res: Response) => {
        try {
            const [dataMaterial, dataProjek, allAB, allAC, allAD, allAE, codeMaterialGroup, totalValue, totalMaterial] = await Promise.all([
                Inventory.findAll({
                    attributes: [
                        "namaMaterial",
                        "uom",
                        [Sequelize.literal("SUM(inventorValue)"), "value"],
                        [Sequelize.literal("SUM(inventory)"), "quantity"],
                    ],
                    group: ["namaMaterial"],
                    order: [[Sequelize.literal("value"), "DESC"]],
                    limit: 10,
                }),
                Inventory.findAll({
                    attributes: [
                        "namaProjek",
                        [Sequelize.literal("SUM(inventorValue)"), "total_value"],
                        [
                            Sequelize.literal(
                                `CONCAT('[',GROUP_CONCAT(CONCAT('{"material": "', REPLACE(namaMaterial, '"', "'"), '", "value": ', inventorValue, '}') ORDER BY namaMaterial ASC), ']')`
                            ),
                            "pd", // Rename the alias to 'pd'
                        ],
                    ],
                    group: ["namaProjek"],
                    order: [[Sequelize.literal("total_value"), "DESC"]],
                    limit: 10,
                }),
                Inventory.findAll({
                    attributes: ['tanggalGr', 'tanggalGi', 'inventorValue'],
                    where: {
                        koedDivisi: 'AB000',
                        [Op.or]: [
                            { [Op.and]: [Sequelize.literal('YEAR(tanggalGr) = 2023')] },
                            { [Op.and]: [Sequelize.literal('YEAR(tanggalGi) = 2023')] },
                        ],
                    },
                }),
                Inventory.findAll({
                    attributes: ['tanggalGr', 'tanggalGi', 'inventorValue'],
                    where: {
                        koedDivisi: 'AC000',
                        [Op.or]: [
                            { [Op.and]: [Sequelize.literal('YEAR(tanggalGr) = 2023')] },
                            { [Op.and]: [Sequelize.literal('YEAR(tanggalGi) = 2023')] },
                        ],
                    },
                }),
                Inventory.findAll({
                    attributes: ['tanggalGr', 'tanggalGi', 'inventorValue'],
                    where: {
                    koedDivisi: 'AD000',
                        [Op.or]: [
                            { [Op.and]: [Sequelize.literal('YEAR(tanggalGr) = 2023')] },
                            { [Op.and]: [Sequelize.literal('YEAR(tanggalGi) = 2023')] },
                        ],
                    },
                }),
                Inventory.findAll({
                    attributes: ['tanggalGr', 'tanggalGi', 'inventorValue'],
                    where: {
                        koedDivisi: 'AE000',
                        [Op.or]: [
                            { [Op.and]: [Sequelize.literal('YEAR(tanggalGr) = 2023')] },
                            { [Op.and]: [Sequelize.literal('YEAR(tanggalGi) = 2023')] },
                            // { [Op.and]: [Sequelize.literal('YEAR(tanggalGr) = YEAR(NOW())')] },
                            // { [Op.and]: [Sequelize.literal('YEAR(tanggalGi) = YEAR(NOW())')] },
                        ],
                    },
                }),
                Inventory.findAll({
                    attributes: [
                        [Sequelize.literal('DISTINCT kodeMaterialGrup'), 'kodeMaterialGrup']
                    ]
                }),
                Inventory.findAll({
                    attributes: [
                        [Sequelize.literal("SUM(inventorValue)"), "total"],
                    ]
                }),
                Inventory.findAll({
                    attributes: [
                        [Sequelize.literal('COUNT(DISTINCT namaMaterial)'), 'jumlah'],
                    ],
                }),
                
            ]);
            const uniqueMaterialGroups = codeMaterialGroup.map((group: any) => group.kodeMaterialGrup);
            
            // console.log("uniq code material group: ",uniqueMaterialGroups);
            
            const dataTopPerSumberDaya: any = {
                Data1: dataMaterial.map((item) => ({
                    namaMaterial: item.dataValues.namaMaterial,
                    uom: item.dataValues.uom,
                    value: item.dataValues.value,
                    quantity: item.dataValues.quantity,
                })),
                Data2: dataProjek.map((item) => ({
                    namaProjek: item.dataValues.namaProjek,
                    total_value: item.dataValues.total_value,
                    pd: item.dataValues.pd,
                })),
                allAB: allAB.map((item) => ({
                    tanggalGr: item.tanggalGr,
                    tanggalGi: item.tanggalGi,
                    inventorValue: item.inventorValue,
                })),
                allAC: allAC.map((item) => ({
                    tanggalGr: item.tanggalGr,
                    tanggalGi: item.tanggalGi,
                    inventorValue: item.inventorValue,
                })),
                allAD: allAD.map((item) => ({
                    tanggalGr: item.tanggalGr,
                    tanggalGi: item.tanggalGi,
                    inventorValue: item.inventorValue,
                })),
                allAE: allAE.map((item) => ({
                    tanggalGr: item.tanggalGr,
                    tanggalGi: item.tanggalGi,
                    inventorValue: item.inventorValue,
                })),
                codeMaterialGroup: uniqueMaterialGroups.map((item) => ({
                    name: item
                })),
                totalValue: totalValue,
                totalMaterial: totalMaterial,
            };

            res.json({
                dataTopPerSumberDaya,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    geDataDashboardTest: async (req: Request, res: Response) => {
        try {
            const filter = req.url.split('?')[1]; // Assuming the URL structure

            const dataMaterialGroup = await Inventory.findAll({
                attributes: [
                    'namaMaterial',
                    'uom',
                    [Sequelize.literal('SUM(inventorValue)'), 'value'],
                    [Sequelize.literal('SUM(inventory)'), 'quantity'],
                ],
                where: {
                    kodeMaterialGrup: {
                        [Op.eq]: filter
                    }
                },
                group: ['namaMaterial'],
                order: [[Sequelize.literal('value'), 'DESC']],
                limit: 10,
            });

            const dataTopPerMaterialGroup: any = {
                Data: dataMaterialGroup.map((item) => ({
                    namaMaterial: item.dataValues.namaMaterial,
                    uom: item.dataValues.uom,
                    value: item.dataValues.value,
                    quantity: item.dataValues.quantity,
                })),
            };

            res.json({
                dataTopPerMaterialGroup,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    
    saveData: async (req: Request, res: Response) => {
        const uploadedFile = req.files?.file as UploadedFile | undefined;

        if (!uploadedFile) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Dapatkan ekstensi file
        const ext = path.extname(uploadedFile.name);
        const fileName = path.basename(uploadedFile.name, ext);
        const currentTime = new Date();
        const hours = String(currentTime.getHours()).padStart(2, "0");
        const minutes = String(currentTime.getMinutes()).padStart(2, "0");
        const timeString = `${hours}-${minutes}`;

        // Buat nama unik untuk file dengan menggabungkan tanggal dan ekstensi
        const uniqueFileName = `${fileName}_${currentTime.toISOString().split("T")[0]
            }_${timeString}${ext}`;

        // Buat path lengkap untuk menyimpan file
        const filePath = `./public/files/${uniqueFileName}`;

        // Simpan file ke server menggunakan fs
        uploadedFile.mv(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            // console.log(`File saved as ${filePath}`);

            // Baca file Excel yang baru saja diunggah
            const workbook = xlsx.readFile(filePath);

            // Assuming that the first sheet in the Excel file contains the data
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert the sheet to JSON
            const jsonData: any[] = xlsx.utils.sheet_to_json(sheet);
            // console.log(`Convert the sheet to JSON: ${jsonData}`);
            // console.log('Convert the sheet to JSON: '+jsonData);
            

            // const sequelize = new Sequelize(databaseConfig);

            const propertiesToCheck = ["kodeProjek" /* tambahkan properti lainnya */];
            const isDataValid = jsonData.every((data) =>
                propertiesToCheck.every((prop) => data.hasOwnProperty(prop))
            );

            if (!isDataValid) {
                // console.log(`"Data is incomplete"`);
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    // console.log(`${filePath} was deleted`);
                });
                return res.status(400).json({ error: "Data is incomplete" });
            }
            // const truncatedKodeMaterialGrup = data.kodeMaterialGrup ? data.kodeMaterialGrup.slice(0, 2) : null;
            try {
                const inventoryPromises = jsonData.map((data) => ({
                    // const javascriptDate = new Date((excelSerialDate - 25569) * 86400 * 1000);

                    // // Get the date in 'YYYY-MM-DD' format
                    // const formattedDate = javascriptDate.toISOString().split('T')[0];
                    kodeProjek: data.kodeProjek,
                    namaProjek: data.namaProjek,
                    statusProjek: data.statusProjek,
                    koedDivisi: data.koedDivisi,
                    namaDivisi: data.namaDivisi,
                    kodeDepartemen: data.kodeDepartemen,
                    namaDepartemen: data.namaDepartemen,
                    kodeMaterialGrup: data.kodeMaterialGrup
                        ? data.kodeMaterialGrup.slice(0, 2)
                        : null,
                    // kodeMaterialGrup: data.kodeMaterialGrup,
                    namaMaterialGrup: data.namaMaterialGrup,
                    kodeMaterial: data.kodeMaterial,
                    namaMaterial: data.namaMaterial,
                    uom: data.uom,
                    nomorPo: data.nomorPo,
                    tanggalPo: data.tanggalPo,
                    poQuantity: data.poQuantity, // Mengganti koma dengan titik
                    poPrice: data.poPrice, // Mengganti koma dengan titik
                    poTotalValue: data.poTotalValue,
                    kodeVendor: data.kodeVendor,
                    namaVendor: data.namaVendor,
                    kodeGr: data.kodeGr,
                    tanggalGr: data.tanggalGr=='#'?'#': new Date((data.tanggalGr - 25569) * 86400 * 1000).toISOString().split('T')[0],
                    // tanggalGr: data.tanggalGr,
                    grQuantity: data.grQuantity, // Mengganti koma dengan titik
                    grValue: data.grValue, // Mengganti koma dengan titik
                    outstandingGr: data.outstandingGr, // Mengganti koma dengan titik
                    kodeGi: data.kodeGi,
                    tanggalGi: data.tanggalGi=='#'?'#': new Date((data.tanggalGi - 25569) * 86400 * 1000).toISOString().split('T')[0],
                    // tanggalGi: data.tanggalGi,
                    giQuantity: data.giQuantity, // Mengganti koma dengan titik
                    giValue: data.giValue, // Mengganti koma dengan titik
                    inventory: data.inventory, // Mengganti koma dengan titik
                    inventorValue: data.inventorValue, // Mengganti koma dengan titik
                }));

                // console.log(`'inventoryPromises: ' ${inventoryPromises}`);
                const batchSize = 1200;
                const totalBatches = Math.ceil(inventoryPromises.length / batchSize);
                for (let i = 0; i < totalBatches; i++) {
                    const startIndex = i * batchSize;
                    const endIndex = startIndex + batchSize;
                    const batch = inventoryPromises.slice(startIndex, endIndex);

                    try {
                        await Inventory.bulkCreate(batch);
                    } catch (error) {
                        // Handle error here (misalnya, Anda dapat melakukan rollback transaksi jika ada kesalahan)
                        // Anda juga dapat memberikan pesan error khusus dalam response jika Anda ingin
                        console.log("Error in batch data insertion:", error);
                    }
                }
                // const batch = inventoryPromises.slice(0, 2);
                // Masukkan data User dan Vendor dalam satu transaksi
                // await Inventory.bulkCreate(inventoryPromises);
                await Inventory.destroy({
                    where: {
                        namaMaterial: "Material Bantu",
                    },
                });

                res.status(200).json({
                    message:
                        "File uploaded and data inserted into the database successfully",
                    inventoryPromises: inventoryPromises,
                });
            } catch (error) {
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    // console.log(`${filePath} was deleted`);
                });
                console.log(error);
                // console.log("File failed to uploaded");

                return res.status(500).json({
                    message: "File failed to uploaded",
                });
            }
        });
    },
};

export default inventoryContorller;
