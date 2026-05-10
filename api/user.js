const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const { id } = req.query; 
    const uri = process.env.MONGODB_URI; 
    const client = new MongoClient(uri);

    try {
        await client.connect();
        
        // FOTOĞRAFDA GÖRDÜĞÜMÜZ DOĞRU İSİMLER:
        const database = client.db('TURKEY_HUB'); 
        const keysCollection = database.collection('keys'); 

        // Botun 'owner' olarak kaydediyor: { owner: "ID", key: "KEY" }
        const userKeyData = await keysCollection.findOne({ owner: id });

        if (userKeyData && userKeyData.key) {
            // VERİ BULUNDU!
            res.status(200).json({ key: userKeyData.key });
        } else {
            // VERİTABANINA GİRDİK AMA BU ID'YE AİT KAYIT YOK
            res.status(200).json({ key: "SİSTEMDE KAYITLI KEY YOK" });
        }
    } catch (e) {
        res.status(500).json({ key: "BAĞLANTI HATASI", error: e.message });
    } finally {
        await client.close();
    }
};
