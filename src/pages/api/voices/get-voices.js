import clientPromise from "@/lib/mongodb";

export default async function getVoices(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("proyecto_educa");
        const collect = db.collection("voices");
        
        const {email}=req.query;
        if(!email)return res.status(400).json({error:"Falta email"});
        
        const findVoices=await collect.findOne({email:email});
        if(findVoices){
            return res.status(200).json({voices:findVoices.voices})
        }
        return res.status(200).json({voices:[]})

    } catch (error) {
        return res.status(500).json({error:"error de coneccion en db"});
    }
    
}