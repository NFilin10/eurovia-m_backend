const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "eurovia-m",
    password: "9112",
    port: 5432,
});





app.post('api/price-management/add', async (req, res) => {
    const { category_name, services, price_ranges, prices } = req.body;
    console.log(req.body);
    try {
        await pool.query('BEGIN'); // Start transaction

        // Insert category and get its ID
        const categoryResult = await pool.query(
            'INSERT INTO Categories (name) VALUES ($1) RETURNING id',
            [category_name]
        );
        const categoryId = categoryResult.rows[0].id;

        // Insert table headers and store their IDs
        const headerIds = [];
        for (const header of price_ranges) {
            const headerResult = await pool.query(
                'INSERT INTO Table_headers (header_name, category_id) VALUES ($1, $2) RETURNING id',
                [header, categoryId]
            );
            headerIds.push(headerResult.rows[0].id);
        }

        // Insert services and store their IDs
        const serviceIds = [];
        for (const service of services) {
            const serviceResult = await pool.query(
                'INSERT INTO Services (name, category_id) VALUES ($1, $2) RETURNING id',
                [service.service_name, categoryId]
            );
            serviceIds.push(serviceResult.rows[0].id);
        }

        // Insert prices (attributes) linked to services and headers
        for (const priceEntry of prices) {
            await pool.query(
                'INSERT INTO Service_attributes (price, service_id, header_id) VALUES ($1, $2, $3)',
                [priceEntry.price, serviceIds[priceEntry.service_id - 1], headerIds[priceEntry.range_id - 1]]
            );
        }

        await pool.query('COMMIT'); // Commit transaction
        res.status(201).json({ message: 'Data stored successfully' });
    } catch (error) {
        await pool.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'Failed to store data' });
    }
});


app.get('api/price-management/get', async (req, res) => {
    try {
        const categoriesQuery = `
      SELECT c.id AS category_id, c.name AS category_name,
             h.id AS header_id, h.header_name,
             s.id AS service_id, s.name AS service_name,
             a.price
      FROM Categories c
      LEFT JOIN Table_headers h ON c.id = h.category_id
      LEFT JOIN Services s ON c.id = s.category_id
      LEFT JOIN Service_attributes a ON s.id = a.service_id AND h.id = a.header_id
      ORDER BY c.id, s.id, h.id;
    `;

        const result = await pool.query(categoriesQuery);
        const rows = result.rows;

        // Group data by categories
        const data = rows.reduce((acc, row) => {
            const { category_id, category_name, header_id, header_name, service_id, service_name, price } = row;

            if (!acc[category_id]) {
                acc[category_id] = {
                    category_name,
                    headers: [],
                    services: {},
                };
            }

            const category = acc[category_id];

            // Add header if not already present
            if (!category.headers.some(h => h.id === header_id)) {
                category.headers.push({ id: header_id, name: header_name });
            }

            // Add service with prices
            if (!category.services[service_id]) {
                category.services[service_id] = { name: service_name, prices: {} };
            }

            category.services[service_id].prices[header_id] = price;

            return acc;
        }, {});

        res.status(200).json(Object.values(data));
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
