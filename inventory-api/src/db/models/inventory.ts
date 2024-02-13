import { Model, Optional, DataTypes } from "sequelize";
import connection from "../../config/connection";

interface InventoryAttributes {
    id?: number;
    kodeProjek?: string | null;
    namaProjek?: string | null;
    statusProjek?: string | null;
    koedDivisi?: string | null;
    namaDivisi?: string | null;
    kodeDepartemen?: string | null;
    namaDepartemen?: string | null;
    kodeMaterialGrup?: string | null;
    namaMaterialGrup?: string | null;
    kodeMaterial?: string | null;
    namaMaterial?: string | null;
    uom?: string | null;
    nomorPo?: string | null;
    tanggalPo?: String | null;
    poQuantity?: String | null;
    poPrice?: String | null;
    poTotalValue?: String | null;
    kodeVendor?: string | null;
    namaVendor?: string | null;
    kodeGr?: string | null;
    tanggalGr?: String | null;
    grQuantity?: String | null;
    grValue?: String | null;
    outstandingGr?: String | null;
    kodeGi?: string | null;
    tanggalGi?: String | null;
    giQuantity?: String | null;
    giValue?: String | null;
    inventory?: String | null;
    inventorValue?: String | null;
    createdAt?: String | null;
    updatedAt?: String | null;
    value?: String | null;
    quantity?: String | null;
    total_value?: String | null;
    pd?: String | null;
}


export interface UserInput extends Optional<InventoryAttributes, 'id'> { }
export interface UserOutput extends Required<InventoryAttributes> { }

class Inventory extends Model<InventoryAttributes> implements InventoryAttributes {
    public id!: number;
    public kodeProjek?: string | null;
    public namaProjek?: string | null;
    public statusProjek?: string | null;
    public koedDivisi?: string | null;
    public namaDivisi?: string | null;
    public kodeDepartemen?: string | null;
    public namaDepartemen?: string | null;
    public kodeMaterialGrup?: string | null;
    public namaMaterialGrup?: string | null;
    public kodeMaterial?: string | null;
    public namaMaterial?: string | null;
    public uom?: string | null;
    public nomorPo?: string | null;
    public tanggalPo?: String | null;
    public poQuantity?: String | null;
    public poPrice?: String | null;
    public poTotalValue?: String | null;
    public kodeVendor?: string | null;
    public namaVendor?: string | null;
    public kodeGr?: string | null;
    public tanggalGr?: String | null;
    public grQuantity?: String | null;
    public grValue?: String | null;
    public outstandingGr?: String | null;
    public kodeGi?: string | null;
    public tanggalGi?: String | null;
    public giQuantity?: String | null;
    public giValue?: String | null;
    public inventory?: String | null;
    public inventorValue?: String | null;
    public value?: String | null;
    public quantity?: String | null;
    public total_value?: String | null;
    public pd?: String | null;

    public readonly createdAt!: String;
    public readonly updatedAt!: String;
}

Inventory.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        kodeProjek: {
            type: DataTypes.STRING,
        },
        namaProjek: {
            type: DataTypes.STRING,
        },
        statusProjek: {
            type: DataTypes.STRING,
        },
        koedDivisi: {
            type: DataTypes.STRING,
        },
        namaDivisi: {
            type: DataTypes.STRING,
        },
        kodeDepartemen: {
            type: DataTypes.STRING,
        },
        namaDepartemen: {
            type: DataTypes.STRING,
        },
        kodeMaterialGrup: {
            type: DataTypes.STRING,
        },
        namaMaterialGrup: {
            type: DataTypes.STRING,
        },
        kodeMaterial: {
            type: DataTypes.STRING,
        },
        namaMaterial: {
            type: DataTypes.STRING,
        },
        uom: {
            type: DataTypes.STRING,
        },
        nomorPo: {
            type: DataTypes.STRING,
        },
        tanggalPo: {
            type: DataTypes.STRING,
        },
        poQuantity: {
            type: DataTypes.STRING,
        },
        poPrice: {
            type: DataTypes.STRING,
        },
        poTotalValue: {
            type: DataTypes.STRING,
        },
        kodeVendor: {
            type: DataTypes.STRING,
        },
        namaVendor: {
            type: DataTypes.STRING,
        },
        kodeGr: {
            type: DataTypes.STRING,
        },
        tanggalGr: {
            type: DataTypes.STRING,
        },
        grQuantity: {
            type: DataTypes.STRING,
        },
        grValue: {
            type: DataTypes.STRING,
        },
        outstandingGr: {
            type: DataTypes.STRING,
        },
        kodeGi: {
            type: DataTypes.STRING,
        },
        tanggalGi: {
            type: DataTypes.STRING,
        },
        giQuantity: {
            type: DataTypes.STRING,
        },
        giValue: {
            type: DataTypes.STRING,
        },
        inventory: {
            type: DataTypes.STRING,
        },
        inventorValue: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: true,
        sequelize: connection,
        underscored: false
    }
);

export default Inventory;
