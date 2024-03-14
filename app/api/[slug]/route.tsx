import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
const dbName = "myDb"
const collection = "myDataCollection"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    const id = params && params.slug;
    if (id) {
        return await getSingle(id)
    }
    else {
        return Response.json("no id found")
    }
}
const getSingle = async (id: any) => {
    try {
        const client = await clientPromise;
        const db = client.db(dbName);
        const doc = await db
            .collection(collection)
            .findOne({ _id: ObjectId.createFromHexString(id) });;
        return Response.json(doc);
    } catch (e) {
        console.error(e);
        return Response.json({ e });
    }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
    try {
        const id = params && params.slug;
        const client = await clientPromise;
        const db = client.db(dbName);
        const response = await db
            .collection(collection)
            .deleteOne({ _id: ObjectId.createFromHexString(id) });
        return Response.json({ response });
    } catch (e) {
        console.error(e);
        return Response.json({ e });
    }
}