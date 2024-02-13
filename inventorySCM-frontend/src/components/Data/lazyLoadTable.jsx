import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from "primereact/calendar";
import { Panel } from "primereact/panel";
import { Text } from "@chakra-ui/react";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";

import { ToggleButton } from 'primereact/togglebutton';


import { CustomerService } from '../../service/CustomerService';
import { ProgressBar } from "primereact/progressbar";
import { Toast } from 'primereact/toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function LazyLoadDemo() {
    const dt = useRef(null);
    const toast = useRef(null);
    const [isRefresh, setIsRefresh] = useState(false);
    const [inventoryValueFrozen, setInventoryValueFrozen] = useState(false);
    const [customers, setCustomers] = useState(null);
    const [field, setField] = useState(null);
    const [columnMinWidths, setColumnMinWidths] = useState({}); // State untuk menyimpan lebar minimum kolom
    const [headerMinWidths, setHeaderMinWidths] = useState({}); // State untuk menyimpan lebar minimum kolom
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [opsiMultiselectNamaProjek, setOpsiMultiselectNamaProjek] = useState();
    const [opsiMultiselectNamaVendor, setOpsiMultiselectNamaVendor] = useState();
    const [opsiMultiselectKodeMaterial, setOpsiMultiselectKodeMaterial] = useState();
    const [opsiMultiselectNamaMaterial, setOpsiMultiselectNamaMaterial] = useState();
    const [opsiMultiselectKodeMaterialGrup, setOpsiMultiselectKodeMaterialGrup] = useState();
    const [opsiMultiselectNomorPo, setOpsiMultiselectNomorPo] = useState();
    const [subTotalValue, setSubTotalValue] = useState([]);
    const [subTotal, setSubTotal] = useState([...subTotalValue]);
    const [dates, setDates] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalProjek, setTotalProjek] = useState(0);
    const [totalvalueInventory, setTotalValueInventory] = useState(0);
    const [dataTotalInventoryQty, setDataTotalInventoryQty] = useState(0);
    const [totalInventoryQty, setTotalInventoryQty] = useState(0);
    const statusesName = [...new Set(customers?.map((item) => item.statusProjek))];
    const divisiName = [...new Set(customers?.map((item) => item.namaDivisi))];
    let networkTimeout = null;
    const showMessage = (title, detail, severity) => {

        toast.current.show({ severity: severity, summary: title, detail: detail, life: 5000 });
    };

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        kodeProjek: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaProjek: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        statusProjek: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        namaDivisi: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaDepartemen: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeMaterialGrup: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaMaterialGrup: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeMaterial: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaMaterial: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        uom: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        nomorPo: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        tanggalPo: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        poQuantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        poPrice: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        poTotalValue: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeVendor: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaVendor: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeGr: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        tanggalGr: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        grQuantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        grValue: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        outstandingGr: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeGi: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        tanggalGi: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        giQuantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        giValue: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        inventory: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        inventorValue: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        DOI: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
    });

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: filters
    });

    const columns = [
        { field: "kodeProjek", header: "Kode Projek" },
        { field: "namaProjek", header: "Nama Projek" },
        { field: "statusProjek", header: "Status Projek" },
        { field: "namaDivisi", header: "Nama Divisi" },
        { field: "namaDepartemen", header: "Nama Departemen" },
        { field: "namaMaterialGrup", header: "Nama Material Group" },
        { field: "kodeMaterial", header: "Kode Material" },
        { field: "namaMaterial", header: "Nama Material" },
        { field: "poQuantity", header: "Po Quantity" },
        { field: "uom", header: "UOM" },
        { field: "nomorPo", header: "Nomor Po" },
        { field: "tanggalPo", header: "Tanggal Po" },
        { field: "poPrice", header: "Po Price" },
        { field: "poTotalValue", header: "Po Total Value" },
        { field: "kodeVendor", header: "Kode Vendor" },
        { field: "DOI", header: "DOI" },
        { field: "namaVendor", header: "Nama Vendor" },
        { field: "kodeGr", header: "Kode Gr" },
        { field: "tanggalGr", header: "Tanggal Gr" },
        { field: "grQuantity", header: "Gr Quantity" },
        { field: "grValue", header: "Gr value" },
        { field: "outstandingGr", header: "Outstanding Gr" },
        { field: "kodeGi", header: "Kode Gi" },
        { field: "tanggalGi", header: "Tanggal Gi" },
        { field: "giQuantity", header: "Gi Quantity" },
        { field: "giValue", header: "Gi Value" },
        { field: "inventory", header: "Inventory" },
        { field: "inventorValue", header: "Inventory Value" },
    ];

    const [defaultColumns] = useState([
        { field: "namaProjek", header: "Nama Projek" },
        { field: "namaVendor", header: "Nama Vendor" },
        { field: "kodeMaterial", header: "Kode Material" },
        { field: "namaMaterial", header: "Nama Material" },
        { field: "poQuantity", header: "Po Quantity" },
        { field: "uom", header: "UOM" },
        { field: "tanggalPo", header: "Tanggal Po" },
        { field: "inventory", header: "Inventory" },
        { field: "poPrice", header: "Po Price" },
        { field: "DOI", header: "DOI" },
        { field: "inventorValue", header: "Inventory Value" },
    ]);

    const [visibleColumns, setVisibleColumns] = useState([...defaultColumns]);
    const [visibleLabelMultiselectNamaProjek, setvisibleLabelMultiselectNamaProjek] = useState([]);
    const [visibleLabelMultiselectNamaVendor, setvisibleLabelMultiselectNamaVendor] = useState([]);
    const [visibleLabelMultiselectKodeMaterial, setvisibleLabelMultiselectKodeMaterial] = useState([]);
    const [visibleLabelMultiselectNamaMaterial, setvisibleLabelMultiselectNamaMaterial] = useState([]);
    const [visibleLabelMultiselectKodeMaterialGrup, setvisibleLabelMultiselectKodeMaterialGrup] = useState([]);
    const [visibleLabelMultiselectNomorPo, setvisibleLabelMultiselectNomorPo] = useState([]);
    const [subTotalInventoryValue, setSubTotalInventoryValue] = useState(0);

    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () => {
        const keysArray = Object.keys(filters);
        const newFilters = {};
        field.length == 0 ?
            keysArray.forEach((field) => {
                if (
                    field === "tanggalPo" ||
                    field === "tanggalGr" ||
                    field === "tanggalGi"
                ) {
                    newFilters[field] = {
                        operator: FilterOperator.AND,
                        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
                    };
                } else {
                    newFilters[field] = {
                        operator: FilterOperator.OR,
                        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
                    };
                }
            }) : field.forEach((field) => {
                if (
                    field === "tanggalPo" ||
                    field === "tanggalGr" ||
                    field === "tanggalGi"
                ) {
                    newFilters[field] = {
                        operator: FilterOperator.AND,
                        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
                    };
                } else {
                    newFilters[field] = {
                        operator: FilterOperator.OR,
                        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
                    };
                }
            })

        newFilters.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        setFilters(newFilters);
        setGlobalFilterValue("");
        setDates(null);
        setvisibleLabelMultiselectNamaProjek([]);
        setvisibleLabelMultiselectNamaVendor([]);
        setvisibleLabelMultiselectNamaMaterial([]);
        setvisibleLabelMultiselectKodeMaterial([]);
        setvisibleLabelMultiselectKodeMaterialGrup([]);
        setvisibleLabelMultiselectNomorPo([]);
        setlazyState({ ...lazyState, filters: newFilters, first: 0 });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        let _filterslazy = { lazyState };
        _filters["global"].value = value;
        setGlobalFilterValue(value);
        setFilters(_filters);
        setlazyState({ ...lazyState, filters: _filters });
        if (visibleLabelMultiselectNamaMaterial.length !== 0) {
            const duplicatedArray = visibleLabelMultiselectNamaMaterial.map(item => ({
                namaMaterial: item.namaMaterial
            }));
            setvisibleLabelMultiselectNamaMaterial(duplicatedArray);
        } else {

        }
    };

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) =>
            selectedColumns.some((sCol) => sCol.field === col.field)
        );
        setVisibleColumns(orderedSelectedColumns);
    };

    const onColumnToggleDate = (event) => {
        let selectedColumns = event.value;
        if (visibleLabelMultiselectNamaMaterial.length !== 0) {
            const duplicatedArray = visibleLabelMultiselectNamaMaterial.map(item => ({
                namaMaterial: item.namaMaterial
            }));
            setvisibleLabelMultiselectNamaMaterial(duplicatedArray);
        } else {

        }

        setDates(selectedColumns);

        let constraintValues = null;
        let filter = null;
        let _filters = { ...filters };
        if (selectedColumns[0] && selectedColumns[1]) {
            const startDate = selectedColumns[0].toLocaleDateString();
            const endDate = selectedColumns[1].toLocaleDateString();
            const endDateTest = new Date(endDate); // Konversi ke objek Date
            endDateTest.setDate(endDateTest.getDate() + 1); // Tambah 1 hari
            const newEndDateString = endDateTest.toLocaleDateString(); // Konversi kembali ke string dalam format yang Anda inginkan

            constraintValues = [
                {
                    value: new Date(startDate),
                    matchMode: FilterMatchMode.DATE_AFTER,
                },
                {
                    value: new Date(newEndDateString),
                    matchMode: FilterMatchMode.DATE_BEFORE,
                },
            ];
        } else if (selectedColumns[0] !== null) {
            const startDate = selectedColumns[0].toLocaleDateString();
            constraintValues = [
                {
                    value: new Date(startDate),
                    matchMode: FilterMatchMode.DATE_IS,
                },
            ];
            // subTotalInventory();
        } else {
            constraintValues = [{ value: null, matchMode: FilterMatchMode.DATE_IS }];
        }

        filter = {
            operator: FilterOperator.AND,
            constraints: constraintValues,
        };

        _filters["tanggalPo"] = filter;
        setFilters(_filters);
        setlazyState({ ...lazyState, filters: _filters, first: 0 });
    };

    const handleNamaProjekToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;

        setvisibleLabelMultiselectNamaProjek(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.namaProjek);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["namaProjek"] = filter;
        setFilters(updatedFilters);
        setlazyState({ ...lazyState, filters: updatedFilters, first: 0 });
    };

    const handleNamaVendorToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;
        setvisibleLabelMultiselectNamaVendor(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.namaVendor);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["namaVendor"] = filter;
        setFilters(updatedFilters);
        setlazyState({ ...lazyState, filters: updatedFilters, first: 0 });
    };

    const handleKodeMaterialToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;
        setvisibleLabelMultiselectKodeMaterial(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.kodeMaterial);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["kodeMaterial"] = filter;
        setFilters(updatedFilters);
        setlazyState({ ...lazyState, filters: updatedFilters, first: 0 });
    };

    const handleKodeMaterialGrupToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;
        setvisibleLabelMultiselectKodeMaterialGrup(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.kodeMaterialGrup);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["kodeMaterialGrup"] = filter;
        setFilters(updatedFilters);
        setlazyState({ ...lazyState, filters: updatedFilters, first: 0 });
    };

    const handleNamaMaterialToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;
        setvisibleLabelMultiselectNamaMaterial(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.namaMaterial);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["namaMaterial"] = filter;
        setFilters(updatedFilters);
        setlazyState({ ...lazyState, filters: updatedFilters, first: 0 });
    };

    const handleNomorPoToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;
        setvisibleLabelMultiselectNomorPo(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.nomorPo);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["nomorPo"] = filter;
        setFilters(updatedFilters);
        setlazyState({ ...lazyState, filters: updatedFilters, first: 0 });
    };

    const calculateColumnMinWidth = (field) => {
        let minWidth = 10; // Lebar minimum default
        if (customers) {
            customers.map((rowData) => {
                const cellContent = rowData[field];
                if (cellContent && cellContent.length * 10 > minWidth) {
                    // Hitung lebar minimum berdasarkan panjang konten
                    minWidth = cellContent.length * 10;
                }
            });
        }
        return minWidth;
    };

    const calculateHeaderMinWidth = (header) => {
        let minWidth = 10; // Lebar minimum default
        if (columns) {
            columns.map((col) => {
                if (col.header === header) {
                    const cellContent = col.header;
                    if (cellContent && cellContent.length * 10 > minWidth) {
                        // Hitung lebar minimum berdasarkan panjang konten
                        minWidth = cellContent.length * 12;
                    }
                }
            });
        }
        return minWidth;
    };

    const formatDate = (value) => {
        // console.log(value);
        return value.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const dateBodyTemplate = (rowData, field) => {
        let value = null;
        field.field === "tanggalPo"
            ? (value = formatDate(rowData.tanggalPo))
            : field.field === "tanggalGr"
                ? (value = formatDate(rowData.tanggalGr))
                : field.field === "tanggalGi"
                    ? (value = formatDate(rowData.tanggalGi))
                    : null;

        return value;
    };

    const statusBodyTemplate = (rowData) => {
        return <Text>{rowData.statusProjek}</Text>;
    };

    const divisiBodyTemplate = (rowData) => {
        return <Text>{rowData.namaDivisi}</Text>;
    };

    const formatCurrency = (value) => {
        const floatValue = parseFloat(value);
        return floatValue.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });
    };

    const chooseOptions = { label: 'Upload', icon: 'pi pi-upload', className: 'p-button-info' };
    const customBase64Uploader = async (event) => {
        try {
            console.log(event);
            const file = event.files[0];
            sendBase64DataToBackend(file);
        } catch (error) {
            return error
        }


        return Promise.resolve(null);
    };

    const sendBase64DataToBackend = async (base64data) => {
        try {
            const formData = new FormData();
            formData.append("file", base64data);

            setIsRefresh(!isRefresh);
            console.log('Sending data to backend...');

            const response = await fetch("http://localhost:4001/api/v1/inventory/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log('File successfully uploaded to backend');
                setIsRefresh(!isRefresh);
                showMessage("Sucess", 'Data Uploaded', 'success')
            } else {
                showMessage("Error", 'Error Upload Data', 'error')
                console.error('Error uploading file to backend:', response.statusText);
                // Handle error if needed
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle error if needed
            setIsRefresh(!isRefresh);
            showMessage("Error", 'Error Upload Data', 'error')
        }
    };

    const exportColumns = columns.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(customers);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, 'products');
    };

    const exportExcelTest = async () => {
        CustomerService.getDataExport()
        const data = await fetch('http://localhost:4001/api/v1/inventory/export')
    };

    const downloadfile = async () => {
        try {
            const response = await fetch('http://localhost:4001/api/v1/inventory/export', {
                method: 'GET',
            });

            if (!response.ok) {
                // Handle error 
                console.error('Error downloading file. Status:', response.status);
                return;
            }

            // Extract filename from the Content-Disposition header
            const contentDisposition = response.headers.get('content-disposition');
            const filenameMatch = contentDisposition && contentDisposition.match('products_export.xlsx');
            const filename = filenameMatch ? filenameMatch[1] : 'download';

            // Create a Blob from the response data
            const blob = await response.blob();

            // Create a URL for the Blob
            const blobUrl = URL.createObjectURL(blob);

            // Create an 'a' link element
            const link = document.createElement('a');

            // Set download attribute and href attribute with Blob URL
            link.download = filename;
            link.href = blobUrl;

            // Add link to the document body
            document.body.appendChild(link);

            // Trigger download
            link.click();

            // Remove link from the document body
            document.body.removeChild(link);

            // Revoke the Blob URL
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            // Handle error 
            console.error('Error:', err);
        }
    };

    const downloadfileFilter = async () => {
        try {
            const response = await CustomerService.getFilterDataExportExcel({ lazyEvent: JSON.stringify(lazyState) })
            // console.log(response);
            if (!response.ok) {
                // Handle error 
                console.error('Error downloading file. Status:', response.status);
                return;
            }

            // Extract filename from the Content-Disposition header
            const contentDisposition = response.headers.get('content-disposition');
            const filenameMatch = contentDisposition && contentDisposition.match('products_export.xlsx');
            const filename = filenameMatch ? filenameMatch[1] : 'download';

            // Create a Blob from the response data
            const blob = await response.blob();

            // Create a URL for the Blob
            const blobUrl = URL.createObjectURL(blob);

            // Create an 'a' link element
            const link = document.createElement('a');

            // Set download attribute and href attribute with Blob URL
            link.download = filename;
            link.href = blobUrl;

            // Add link to the document body
            document.body.appendChild(link);

            // Trigger download
            link.click();

            // Remove link from the document body
            document.body.removeChild(link);

            // Revoke the Blob URL
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            // Handle error 
            console.error('Error:', err);
        }
    };

    const saveAsExcelFile = (buffer, fileName) => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
            type: EXCEL_TYPE
        });

        saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    };

    const [selectedDownload, setSelectedDownload] = useState(null);

    const handleDownload = (e) => {
        setSelectedDownload(e ? e : null)
        switch (e?.code) {
            case 'Full':
                console.log('ini full');
                downloadfile()
                break;
            case 'Table':
                console.log('ini table');
                exportExcel()
                break;
            case 'Filter':
                console.log('ini filter');
                downloadfileFilter()
                break;

            default:
                break;
        }
    };

    const donwloadType = [
        { name: 'Full Data', code: 'Full' },
        { name: 'Table Data', code: 'Table' },
        { name: 'Filter Data', code: 'Filter' },
    ];

    const header = (
        <div className="flex justify-around items-center py-5">
            <div className="p-float-label grow max-w-[15rem] min-w-max">
                <Calendar
                    showIcon
                    inputId="date"
                    className="w-full"
                    value={dates}
                    onChange={onColumnToggleDate}
                    selectionMode="range"
                    readOnlyInput
                />
                <label htmlFor="date">Tanggal Po</label>
            </div>
            <div className="p-float-label flex align-items-center justify-center justify-content-between gap-3 grow max-w-[10rem]  min-w-max">
                <FileUpload key={isRefresh} severity="help" chooseOptions={chooseOptions} mode="basic" name="demo" url="http://localhost:4001/api/v1/inventory/upload" accept="*csv" customUpload uploadHandler={customBase64Uploader} auto />
            </div>

            <div className="grow flex max-w-[45rem] align-items-center justify-center items-center">
                <span className="p-input-icon-left mr-3 w-3/4">
                    <i className="pi pi-search" />
                    <InputText
                        className="w-full"
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                    />
                </span>
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    // outlined
                    onClick={clearFilter}
                    severity="info"
                />
            </div>

            <div className="grow flex max-w-[11rem] align-items-center justify-center items-center">
                <span className="p-float-label w-full md:w-14rem">
                    <Dropdown inputId="download" dropdownIcon='pi pi-download' showClear value={selectedDownload} onChange={(e) => handleDownload(e.value)} options={donwloadType} optionLabel="name" className="w-full" />
                    <label htmlFor="download">Download</label>
                </span>
            </div>
            <div className="flex">
                <ToggleButton checked={inventoryValueFrozen} onChange={(e) => setInventoryValueFrozen(e.value)} onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Inventory Value" offLabel="Inventory Value" />
            </div>
        </div>
    );

    const footer = (
        <div className="flex justify-between items-center">
            <div>
                <Text>Total Projek: {totalProjek} </Text>
            </div>

            <div>
                <Text>Sub Total Inventory Quantity: {totalInventoryQty} </Text>
            </div>

            <div>
                <Text>Sub Total Inventory Value: {subTotalInventoryValue} </Text>
            </div>

            <div>
                <Text>Total Inventory Value: {totalvalueInventory} </Text>
            </div>
        </div>
    );



    useEffect(() => {
        loadLazyData();
    }, [lazyState, isRefresh]);


    useEffect(() => {
        if (customers) {
            const newColumnMinWidths = {};
            const newHeaderMinWidths = {};
            visibleColumns.map((col) => {
                // console.log(col.header);
                newColumnMinWidths[col.field] = calculateColumnMinWidth(col.field);
                newHeaderMinWidths[col.header] = calculateHeaderMinWidth(col.header);
            });
            setColumnMinWidths(newColumnMinWidths);
        }
    }, [customers, visibleColumns]);

    useEffect(() => {
        if (customers) {
            const newHeaderMinWidths = {};
            columns.map((col) => {
                newHeaderMinWidths[col.header] = calculateHeaderMinWidth(col.header);
            });
            setHeaderMinWidths(newHeaderMinWidths);
        }
    }, [customers]);

    useEffect(() => {
        CustomerService.getTotalMaterialQty({ lazyEvent: JSON.stringify(lazyState) }).then((data) => {
            const formatDecimal = parseFloat(data.subTotalValueInventoryQty).toFixed(3);
            const formattedValue = parseFloat(
                formatDecimal
            ).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
            });
            const value = formattedValue.replace("Rp", "");
            setTotalInventoryQty(value)
        })
    }, [visibleLabelMultiselectNamaMaterial]);


    const loadLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        try {
            //imitate delay of a backend call
            networkTimeout = setTimeout(() => {
                CustomerService.getDataInventory({ lazyEvent: JSON.stringify(lazyState) }).then((data) => {
                    setTotalRecords(data.totalRecords);
                    data.totalRecords ? true : showMessage('Warning', 'Data Not Found', 'warn')
                    setTotalProjek(data.totalProjek)
                    setTotalValueInventory(data.totalValueInventory)
                    setSubTotalInventoryValue(data.subTotalValueInventory)
                    let inventoryData = data.data
                    setOpsiMultiselectNamaProjek(data.opsiMultiselect.namaProjek);
                    setOpsiMultiselectNamaVendor(data.opsiMultiselect.namaVendor);
                    setOpsiMultiselectNomorPo(data.opsiMultiselect.nomorPo);
                    setOpsiMultiselectKodeMaterial(data.opsiMultiselect.kodeMaterial);
                    setOpsiMultiselectNamaMaterial(data.opsiMultiselect.namaMaterial);

                    // Gunakan metode map untuk membuat array baru yang berisi value nya yang sudah ditambahkan '000'
                    const materialGroup = data.opsiMultiselect.kodeMaterialGrup.map(item => {
                        // Tambahkan '000' pada value nya dengan menggunakan operator +
                        const value = item.kodeMaterialGrup + '000';
                        // Kembalikan objek baru yang berisi value nya yang sudah ditambahkan '000'
                        return {
                            kodeMaterialGrup: value
                        };
                    });
                    setOpsiMultiselectKodeMaterialGrup(materialGroup);

                    const formatDate = (value) => {
                        const date = new Date(value);
                        const options = {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            timeZoneName: "short",
                        };
                        return date.toLocaleString("en-US", options);
                    };
                    const dataWithAdditionalFormattedData = inventoryData.map((item) => {
                        const tanggalGr = new Date(item.tanggalGr);
                        const tanggalGi = new Date(item.tanggalGi);
                        const selisihTanggal =
                            Math.abs(tanggalGr - tanggalGi) / (1000 * 60 * 60 * 24);
                        const DOI = `${selisihTanggal} Hari`;
                        return {
                            ...item,
                            DOI,
                            tanggalPo: new Date(formatDate(item.tanggalPo)),
                            tanggalGr: new Date(formatDate(item.tanggalGr)),
                            tanggalGi: new Date(formatDate(item.tanggalGi)),
                            inventory: parseFloat(item.inventory).toFixed(3),
                        };
                    });
                    setCustomers(dataWithAdditionalFormattedData);

                    const field =
                        dataWithAdditionalFormattedData?.length > 0
                            ? Object.keys(dataWithAdditionalFormattedData[0])
                            : [];
                    setField(field);
                    setLoading(false);
                });
            }, Math.random() * 1000 + 250); onFilter
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    const onPage = (event) => {
        setlazyState(event);
        // console.log('test');
    };

    const onSort = (event) => {
        setlazyState(event);
    };

    const onFilter = (event) => {
        event['first'] = 0;
        setlazyState(event);
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <Panel header="All Data" className="m-9" toggleable>
                <div className="card">
                    <Fieldset legend="Filter" className="px-7 pb-7" toggleable>
                        <div className="card">
                            <div className="flex justify-between items-center w-full pt-4 space-x-5">
                                <div className="p-float-label grow">
                                    <MultiSelect
                                        filter
                                        resetFilterOnHide
                                        maxSelectedLabels={9}
                                        value={visibleColumns}
                                        options={columns}
                                        optionLabel="header"
                                        onChange={onColumnToggle}
                                        className="w-full sm:w-20rem"
                                        display="chip"
                                    />
                                    <label htmlFor="ms-cities">Column</label>
                                </div>
                            </div>
                            <div className="flex justify-between items-center w-full pt-8 space-x-5">
                                <div className="p-float-label grow max-w-1/2">
                                    <MultiSelect
                                        filter
                                        resetFilterOnHide
                                        maxSelectedLabels={6}
                                        value={visibleLabelMultiselectKodeMaterialGrup}
                                        options={opsiMultiselectKodeMaterialGrup}
                                        optionLabel="kodeMaterialGrup"
                                        onChange={handleKodeMaterialGrupToggle}
                                        className="w-full sm:w-20rem overflow-y-auto"
                                        display="chip"
                                    />
                                    <label htmlFor="ms-cities">Kode Material Group</label>
                                </div>
                                <div className="p-float-label grow max-w-1/2 ">
                                    <MultiSelect
                                        filter
                                        resetFilterOnHide
                                        maxSelectedLabels={3}
                                        value={visibleLabelMultiselectNamaVendor}
                                        options={opsiMultiselectNamaVendor}
                                        optionLabel="namaVendor"
                                        onChange={handleNamaVendorToggle}
                                        className="w-full sm:w-20rem"
                                        display="chip"
                                    />
                                    <label htmlFor="ms-cities">Nama Vendor</label>
                                </div>
                            </div>
                            <div className="flex justify-between items-center w-full pt-8 space-x-5">
                                <div className="p-float-label grow max-w-1/2">
                                    <MultiSelect
                                        filter
                                        resetFilterOnHide
                                        maxSelectedLabels={6}
                                        value={visibleLabelMultiselectKodeMaterial}
                                        options={opsiMultiselectKodeMaterial}
                                        optionLabel="kodeMaterial"
                                        onChange={handleKodeMaterialToggle}
                                        className="w-full sm:w-20rem overflow-y-auto"
                                        display="chip"
                                    />
                                    <label htmlFor="ms-cities">Kode Material</label>
                                </div>
                                <div className="p-float-label grow max-w-1/2">
                                    <MultiSelect
                                        filter
                                        resetFilterOnHide
                                        maxSelectedLabels={6}
                                        value={visibleLabelMultiselectNomorPo}
                                        options={opsiMultiselectNomorPo}
                                        optionLabel="nomorPo"
                                        onChange={handleNomorPoToggle}
                                        className="w-full sm:w-20rem"
                                        display="chip"
                                    />
                                    <label htmlFor="ms-cities">Nomor PO</label>
                                </div>
                            </div>
                            <div className="flex justify-between items-center w-full  pt-8 space-x-5">
                                <div className="p-float-label grow max-w-1/2">
                                    <MultiSelect
                                        filter
                                        resetFilterOnHide
                                        maxSelectedLabels={3}
                                        value={visibleLabelMultiselectNamaProjek}
                                        options={opsiMultiselectNamaProjek}
                                        optionLabel="namaProjek"
                                        onChange={handleNamaProjekToggle}
                                        className="w-full sm:w-20rem"
                                        display="chip"
                                    />
                                    <label htmlFor="ms-cities">Nama Projek</label>
                                </div>
                                <div className="p-float-label grow max-w-1/2">
                                    <MultiSelect
                                        filter
                                        resetFilterOnHide
                                        maxSelectedLabels={3}
                                        value={visibleLabelMultiselectNamaMaterial}
                                        options={opsiMultiselectNamaMaterial}
                                        optionLabel="namaMaterial"
                                        onChange={handleNamaMaterialToggle}
                                        className="w-full sm:w-20rem"
                                        display="chip"
                                    />
                                    <label htmlFor="ms-cities">Nama Material</label>
                                </div>
                            </div>
                        </div>
                    </Fieldset>
                </div>
                <DataTable
                    value={customers}
                    lazy
                    filters={filters}
                    dataKey="id"
                    paginator
                    first={lazyState.first}
                    rows={lazyState.rows}
                    totalRecords={totalRecords}
                    onPage={onPage}
                    onSort={onSort}
                    sortField={lazyState.sortField}
                    sortOrder={lazyState.sortOrder}
                    onFilter={onFilter}
                    scrollable
                    columnResizeMode="expand"
                    resizableColumns
                    showGridlines
                    removableSort
                    sortMode="multiple"
                    scrollHeight="1000px"
                    size={"small"}
                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
                    header={header}
                    footer={footer}
                    loading={loading}
                    emptyMessage="No data found."
                    globalFilterFields={field}
                    stripedRows
                    ref={dt}
                >
                    {visibleColumns.map((col) =>
                        col.field === "namaProjek" || col.field === "namaVendor" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                style={{ minWidth: `${columnMinWidths[col.field]}px` }}
                            />
                        ) : col.field === "uom" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                style={{ minWidth: `${columnMinWidths[col.field]}px` }}
                            />
                        ) : col.field === "poQuantity" ||
                            col.field === "grQuantity" ||
                            col.field === "giQuantity" ||
                            col.field === "inventory" ||
                            col.field === "outstandingGr" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                style={{
                                    minWidth: `${columnMinWidths[col.field]}px`,
                                    textAlign: "right",
                                }}
                                body={(rowData) => {
                                    const formatDecimal = parseFloat(rowData[col.field]).toFixed(
                                        3
                                    );
                                    const formattedValue = parseFloat(
                                        formatDecimal
                                    ).toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 3,
                                        maximumFractionDigits: 3,
                                    });
                                    const value = formattedValue.replace("Rp", "");
                                    return value;
                                }}
                            />
                        ) : col.field === "tanggalPo" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                filterField="tanggalPo"
                                dataType="date"
                                style={{ minWidth: `${columnMinWidths[col.field]}px` }}
                                body={dateBodyTemplate}
                            />
                        ) : col.field === "tanggalGi" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                filterField="tanggalGi"
                                dataType="date"
                                style={{ minWidth: `${columnMinWidths[col.field]}px` }}
                                body={dateBodyTemplate}
                            />
                        ) : col.field === "tanggalGr" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                filterField="tanggalGr"
                                dataType="date"
                                style={{ minWidth: `${columnMinWidths[col.field]}px` }}
                                body={dateBodyTemplate}
                            />
                        ) : col.field === "statusProjek" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                filterMenuStyle={{ width: "14rem" }}
                                style={{ minWidth: "12rem" }}
                                body={statusBodyTemplate}
                            />
                        ) : col.field === "namaDivisi" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                filterMenuStyle={{ width: "14rem" }}
                                style={{ minWidth: "12rem" }}
                                body={divisiBodyTemplate}
                            />
                        ) : col.field === "poPrice" ||
                            col.field === "grValue" ||
                            col.field === "giValue" ||
                            col.field === "poTotalValue" ? (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                style={{
                                    minWidth: `${columnMinWidths[col.field]}px`,
                                    textAlign: "right",
                                }}
                                body={(rowData) =>
                                    formatCurrency(Math.floor(parseFloat(rowData[col.field])))
                                }
                            />
                        ) : col.field === "inventorValue" ? (
                            <Column
                                alignFrozen="right"
                                frozen={inventoryValueFrozen}
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                style={{
                                    minWidth: `${columnMinWidths[col.field]}px`,
                                    textAlign: "right",
                                }}
                                body={(rowData) =>
                                    formatCurrency(Math.floor(parseFloat(rowData[col.field])))
                                }
                            />
                        ) : (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                showFilterMenu={true}
                                filterPlaceholder="Search"
                                style={{ minWidth: `${headerMinWidths[col.header]}px` }}
                            />
                        )
                    )}
                </DataTable>
            </Panel>

        </div>
    );
}
