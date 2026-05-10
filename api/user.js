const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. Siteden gelen Discord ID'yi alıyoruz
    const { id } = req.query; 

    if (!id) {
        return res.status(400).json({ key: "HATA: Discord ID Bulunamadı!" });
    }

    // 2. Vercel ayarlarından MongoDB şifreni çekiyoruz
    const uri = process.env.MONGODB_URI; 
    
    if (!uri) {
        return res.status(500).json({ key: "SİSTEM HATASI: Veritabanı Linki (URI) Eksik!" });
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        
        // DİKKAT: Veritabanı ve Tablo (Collection) adını botuna göre düzenlersin
        // Genelde botlarda db adı 'test' veya 'Cluster0', tablo adı 'users' veya 'keys' olur.
        const database = client.db('test'); 
        const users = database.collection('users'); 

        // 3. Veritabanında senin ID'ni (345821033414262794) arıyoruz
        const user = await users.findOne({ discordId: id }); // Senin botunda bu 'id' veya 'userId' olabilir, uyarlarsın.

        if (user && user.key) {
            // Adamı buldu ve keyi var!
            res.status(200).json({ key: user.key });
        } else {
            // Adam giriş yaptı ama veritabanında ona atanmış bir key yok
            res.status(200).json({ key: "SİSTEMDE KAYITLI KEY YOK" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ key: "VERİTABANI BAĞLANTISI ÇÖKTÜ" });
    } finally {
        await client.close();
    }
};
