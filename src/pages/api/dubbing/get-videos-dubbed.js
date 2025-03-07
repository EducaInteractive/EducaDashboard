import clientPromise from "@/lib/mongodb";

export default async function getvideosDubbed(req, res) {

    try {
        const client = await clientPromise;
        const db = client.db("proyecto_educa");
        const collect = db.collection("dubbing");

        const {email}=req.query;

        if(!email)return res.status(400).json({error:"email invalido"});

        const findVideoDubbed=await collect.find({email}).toArray();
        if(findVideoDubbed)return res.status(200).json({videosDubbed:findVideoDubbed})
    } catch (error) {
        console.error(error)
    }
}

