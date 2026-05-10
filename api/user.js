const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. Siteden gelen Discord ID'yi alıyoruz
    const { id } = req.query; 

    if (!id) {
        return res.status(400).json({ key: "HATA: Discord ID Bulunamadı!" });
    }

    // 2. Vercel ayarlarından gelen MongoDB URI
    const uri = process.env.MONGODB_URI; 
    
    if (!uri) {
        return res.status(500).json({ key: "SİSTEM HATASI: Veritabanı Linki Eksik!" });
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        
        // SENİN BOTUNUN ÖZEL AYARLARI:
        // Botun 'KeyModel' kullandığına göre tablo adı büyük ihtimalle 'keys' (çoğul yapılır mongoose tarafından)
        const database = client.db('test'); // Eğer MongoDB'de veritabanı adını Ryphera yaptıysan burayı 'Ryphera' yap
        const keys = database.collection('keys'); 

        // 3. Veritabanında senin botun 'owner' ismini kullanıyor!
        const userKeyData = await keys.findOne({ owner: id });

        if (userKeyData && userKeyData.key) {
            // Key bulundu!
            res.status(200).json({ key: userKeyData.key });
        } else {
            // Kayıt yok
            res.status(200).json({ key: "SİSTEMDE KAYITLI KEY YOK" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ key: "VERİTABANI BAĞLANTISI ÇÖKTÜ" });
    } finally {
        await client.close();
    }
};
