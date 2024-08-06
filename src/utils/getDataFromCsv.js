
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GOOGLE_SHEET_ID = '1hB_LjBT9ezZigXnC-MblT2PXZledkZqBnvV23ssfSuE';
const GOOGLE_API_KEY = 'AIzaSyABYgJvIfE2iKEkGSznbyjQaMUc74ZwCeE';
const SHEET_NAME = 'FMSCA_records (2)';
const PAGE_SIZE = 20;

export const GetCsvData = (page) => {
    const [totalPages, setTotalPages] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_API_KEY}`
                );
                const rows = response.data.values;

                if (rows.length > 0) {
                    const keys = rows[0];
                    const values = rows.slice(1);

                    // Calculate total pages
                    const totalItems = values.length;
                    setTotalPages(Math.ceil(totalItems / PAGE_SIZE));

                    // Get the subset of data for the current page
                    const paginatedData = values.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(row => {
                        const obj = {};
                        keys.forEach((key, index) => {
                            obj[key] = row[index] || ''; // Use an empty string if value is undefined
                        });
                        return obj;
                    });

                    return { paginatedData, totalPages };
                }
            } catch (error) {
                console.error('Error fetching data from Google Sheets:', error);
            }
        };

        fetchData();
    }, [page]);

    //   const handlePageChange = (newPage) => {
    //     if (newPage >= 0 && newPage < totalPages) {
    //       setPage(newPage);
    //     }
    //   };
}