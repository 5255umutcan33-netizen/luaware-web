const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const { id } = req.query; 
    const uri = process.env.MONGODB_URI; 
    const client = new MongoClient(uri);

    try {
        await client.connect();
        
        // --- KRİTİK AYAR BÖLGESİ ---
        // MongoDB Atlas'ta sol menüden 'Browse Collections'a tıkladığında 
        // yukarıda yazan Database ismini ve altındaki Tablo ismini kontrol et.
        
        const database = client.db('test'); // Eğer orada 'Ryphera' yazıyorsa burayı 'Ryphera' yap!
        
        // Botun 'KeyModel' dediği için Mongoose bunu 'keys' olarak kaydeder.
        const keysCollection = database.collection('keys'); 

        // Senin bot kodunda 'owner' olarak kaydediyor: { owner: "ID", key: "KEY" }
        const userKeyData = await keysCollection.findOne({ owner: id });

        if (userKeyData && userKeyData.key) {
            res.status(200).json({ key: userKeyData.key });
        } else {
            // Eğer hala bulamıyorsa, koleksiyondaki ilk veriyi konsola basalım (Vercel loglarından bakarız)
            console.log(`${id} için veri bulunamadı. Tablo ismi 'keys' mi kontrol et.`);
            res.status(200).json({ key: "SİSTEMDE KAYITLI KEY YOK" });
        }
    } catch (e) {
        res.status(500).json({ key: "BAĞLANTI HATASI: " + e.message });
    } finally {
        await client.close();
    }
};
