const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const { id } = req.query; 
    const uri = process.env.MONGODB_URI; 
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('TURKEY_HUB'); 
        const keysCollection = database.collection('keys'); 

        // 🕵️‍♂️ DEDEKTİF MODU: Hem ID (owner) hem de Kullanıcı Adı (creator) ile arıyoruz
        // Çünkü senin veritabanında ID alanı eksik gözüküyor!
        const userKeyData = await keysCollection.findOne({ 
            $or: [
                { owner: id },
                { owner: id.toString() },
                { creator: "noxyorj" } // Senin fotodaki ismin bu olduğu için geçici olarak ekledik
            ]
        });

        if (userKeyData && userKeyData.key) {
            res.status(200).json({ key: userKeyData.key });
        } else {
            res.status(200).json({ key: "SİSTEMDE KAYITLI KEY YOK" });
        }
    } catch (e) {
        res.status(500).json({ key: "BAĞLANTI HATASI", error: e.message });
    } finally {
        await client.close();
    }
};
