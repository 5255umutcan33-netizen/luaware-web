const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const { id } = req.query; 
    const uri = process.env.MONGODB_URI; 
    const client = new MongoClient(uri);

    try {
        await client.connect();
        
        // --- BU KISMI DİKKATLİCE KONTROL ET ---
        // Botunun bağlandığı asıl veritabanı adı 'test' olmayabilir. 
        // MongoDB Atlas'ta Browse Collections kısmında en üstte ne yazıyor? (Örn: RypheraDB, Cluster0 vb.)
        const dbName = 'test'; 
        const database = client.db(dbName);
        
        // Botun 'KeyModel' dediği için Mongoose bunu otomatik 'keys' yapar.
        // Ama bazen 'keymodels' de yapabilir.
        const keysCollection = database.collection('keys'); 

        // Bot kodunda 'owner' ve 'key' kullanmışsın.
        const userKeyData = await keysCollection.findOne({ owner: id });

        if (userKeyData && userKeyData.key) {
            res.status(200).json({ key: userKeyData.key });
        } else {
            // Eğer bulamazsa, konsola mevcut tabloları yazdıralım (Hata tespiti için)
            const collections = await database.listCollections().toArray();
            const collectionNames = collections.map(c => c.name);
            console.log("Mevcut Tablolar:", collectionNames);
            
            res.status(200).json({ 
                key: "SİSTEMDE KAYITLI KEY YOK",
                debug: `Aranan ID: ${id}, Bakılan Tablo: keys, Mevcut Tablolar: ${collectionNames.join(', ')}`
            });
        }
    } catch (e) {
        res.status(500).json({ key: "BAĞLANTI HATASI", error: e.message });
    } finally {
        await client.close();
    }
};
