import clientPromise from "../../lib/mongodb";
const dbName = "myDb"
const collection = "myDataCollection"

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db(dbName);
        const resources = await db
            .collection(collection)
            .find({})
            .sort({ title: -1 })
            .limit(10)
            .toArray();
        return Response.json({ resources });
    } catch (e: any) {
        console.error(e);
        return Response.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db(dbName);
        const newResource = await request.json()
        const resources = await db
            .collection(collection)
            .insertOne(newResource)
        return Response.json({ resources, request });
    } catch (e: any) {
        console.error(e);
        return Response.json({ error: e.message }, { status: 500 });
    }
}