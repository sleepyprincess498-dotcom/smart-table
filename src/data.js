import {makeIndex} from "./lib/utils.js";

const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData(sourceData) {
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    const getIndexes = async () => {
        if (!sellers || !customers) {
            try {
                [sellers, customers] = await Promise.all([
                    fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                    fetch(`${BASE_URL}/customers`).then(res => res.json()),
                ]);
            } catch (e) {
                // fallback на локальные данные
                sellers = makeIndex(sourceData.sellers, 'id');
                customers = makeIndex(sourceData.customers, 'id');
            }
        }

        return { sellers, customers };
    }

    const getRecords = async (query, isUpdated = false) => {
        await getIndexes();

        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        if (lastQuery === nextQuery && !isUpdated) {
            return lastResult;
        }

        try {
            const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
            const records = await response.json();

            lastQuery = nextQuery;
            lastResult = {
                total: records.total,
                items: mapRecords(records.items)
            };
        } catch (e) {
            // fallback на локальные данные
            const page = query.page ?? 1;
            const limit = query.limit ?? 10;
            const skip = (page - 1) * limit;
            const items = sourceData.purchase_records.slice(skip, skip + limit);

            lastQuery = nextQuery;
            lastResult = {
                total: sourceData.purchase_records.length,
                items: mapRecords(items)
            };
        }

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}