export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // 1. 메시지 불러오기 (GET)
    if (request.method === "GET") {
        const today = new Date().toISOString().split('T')[0];
        try {
            const { results } = await env.DB.prepare(
                "SELECT * FROM messages WHERE created_date = ? ORDER BY timestamp ASC"
            ).bind(today).all();
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            return new Response(e.message, { status: 500 });
        }
    }

    // 2. 메시지 저장하기 (POST)
    if (request.method === "POST") {
        const data = await request.json();
        const today = new Date().toISOString().split('T')[0];
        
        try {
            await env.DB.prepare(
                "INSERT INTO messages (nickname, nationality, ip, message, created_date) VALUES (?, ?, ?, ?, ?)"
            ).bind(data.nickname, data.nationality, data.ip, data.message, today).run();
            
            return new Response("Success", { status: 201 });
        } catch (e) {
            return new Response(e.message, { status: 500 });
        }
    }
}
