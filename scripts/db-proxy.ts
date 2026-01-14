import postgres from 'postgres';

const databaseUrl = process.env.VITE_DATABASE_URL;

if (!databaseUrl) {
    console.error("❌ VITE_DATABASE_URL is not set in .env");
    process.exit(1);
}

// Create the TCP client for Local Postgres
const queryClient = postgres(databaseUrl);

console.log("🚀 Local DB Proxy starting on http://localhost:3000");
console.log("🔌 Connected to:", databaseUrl.replace(/:[^:]+@/, ':***@'));

// @ts-expect-error Bun global
Bun.serve({
    port: 3000,
    async fetch(req: Request) {
        const url = new URL(req.url);
        console.log(`\n📬 [${req.method}] ${url.pathname}`);

        // Common headers
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        // Handle CORS preflight
        if (req.method === "OPTIONS") {
            return new Response(null, { headers });
        }

        if (req.method === "POST") {
            try {
                const body = await req.json();
                const { query, params } = body;

                console.log("📝 Executing query:", query.substring(0, 100) + (query.length > 100 ? "..." : ""));

                // Execute the query on local postgres
                const result = await queryClient.unsafe(query, params);

                // Custom JSON replacer to ensure dates are in ISO format
                const jsonReplacer = (_key: string, value: any) => {
                    if (value instanceof Date) {
                        return value.toISOString();
                    }
                    return value;
                };

                return new Response(JSON.stringify(result, jsonReplacer), {
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                    },
                });
            } catch (err: any) {
                console.error("❌ Error executing query:", err.message);
                return new Response(JSON.stringify({ error: err.message }), {
                    status: 500,
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                    },
                });
            }
        }

        // Default response for GET or other methods
        return new Response(JSON.stringify({
            status: "running",
            message: "Local DB Proxy is running. Use POST to execute queries."
        }), {
            status: 200,
            headers: {
                ...headers,
                "Content-Type": "application/json",
            }
        });
    },
});
