export const CustomerService = {

    getDataInventory(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';
        return fetch('http://localhost:4001/api/v1/inventory/lazyData?' + queryParams).then((res) => res.json());
    },

    getTotalMaterialQty(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';
        return fetch('http://localhost:4001/api/v1/inventory/materialyQty?' + queryParams).then((res) => res.json());
    },

    getFilterDataExportExcel(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';
        return fetch('http://localhost:4001/api/v1/inventory/exportFilter?' + queryParams);
    },
    
    getDataDashboard() {
        return fetch('http://localhost:4001/api/v1/inventory/dashboardData').then((res) => res.json());
    },

    getDataDashboardTest(params) {
        const queryParams = params;
        return fetch('http://localhost:4001/api/v1/inventory/dashboardDataTest?' + queryParams).then((res) => res.json());
    },

    getDataExport() {
        return fetch('http://localhost:4001/api/v1/inventory/export');
    }
};
