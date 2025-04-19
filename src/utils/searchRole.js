import clientPromise from "@/lib/mongodb";
export default async function searchRole(email) {
    try {
        const client = await clientPromise;
        const db = client.db("proyecto_educa");
        const authorizeUser = await db.collection("authorized_user").findOne({ email: email });
        if(!authorizeUser)return {};
        const role=await db.collection("rols").findOne({"_id":authorizeUser.role_id})
        if(role)return {role:role.role,cantVoices:role.cant_voices,cantRegenerations:role.cant_regenerate,cantRegenerationsClass:role.cant_regenerate_class}
    } catch (error) {    
        console.error("error: ",error)
        return {};
    }
}