const excel = require('exceljs');
const UserDemis = require('../Models/User');
const{redisClient}=require("../config/redis")
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csvtojson');
const client=require("../config/redis")


// Multer configuration

// Multer configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/uploads');
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});



exports.upload = multer({
    storage: storage
})




// Make a api for pagination with search and filter

exports.getUsers = async (req, res) => {
    try {
        // Extract search query
        const search = req.query.search || '';

        // Query the database for users
        const query = {
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { location: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        };
        
        // Create a unique cache key based on the query
        const cacheKey = `users:${search}`;

        
        // Check if the data is cached
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            // Return cached data if available
            return res.status(200).json(JSON.parse(cachedData));
        }

        // Fetch data from the database if not cached
        const users = await UserDemis.find(query);

        // Cache the data with an expiration time (e.g., 3600 seconds = 1 hour)
        await client.set(cacheKey, JSON.stringify(users), {
            EX: 3600
        });

        // Return the fetched data
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};




exports.createUser = async (req, res) => {
    try {
        const { name, lastname } = req.body;

        // Create a new user and save it to the database
        const newUser = new UserDemis({
            name,
            lastname
        });
        await newUser.save();

        // Invalidate the cache
        const  searchQuery = newUser || ''; // Invalidate cache based on the new user's name
        const cacheKey = `users:${searchQuery}`;
        await client.del(cacheKey); // Remove the cache entry associated with the search query

        console.log(cacheKey , "cacheKey")
      
        // Return the newly created user
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.exportExcel = async (req, res) => {
    try {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('User');
        worksheet.columns = [
            { header: 'S.No', key: 'sno' },
            { header: 'Name', key: 'name' },
            { header: 'Lastname', key: 'lastname' }
        ];

        let counter = 1;
        const users = await UserDemis.find();
        users.forEach(user => {
            user.sno = counter;
            worksheet.addRow(user);
            counter++;
        });

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFA07A' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            cell.alignment = { vertical: 'middle', horizontal: 'center' };
         
            
        });

        // worksheet.getCell('A1').dataValidation={
        //     type:'list',
        //     formula:['1','2','3','4','5','6','7','8','9','10']

        // }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error(err);
    }
};


// exports.uploadFile = async (req, res) => {
//     try {
//         const data = req.file;
//         console.log(data); // Check the file data
//         if (!req.file) {
//             return res.status(400).json({ message: 'Please upload a file' });
//         }

//         const workbook = new excel.Workbook();
//         await workbook.xlsx.load(req.file.path);
//         const worksheet = workbook.worksheets[0];

//         const users = [];
//         worksheet.eachRow((row, rowNumber) => {
//             if (rowNumber === 1) return; // Skip the header row
//             const [name, lastname] = row.values;
//             users.push({ name, lastname });
//         });

//         await UserDemis.insertMany(users);
//         fs.unlinkSync(req.file.path);
//         res.status(201).json({ message: 'File uploaded successfully' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//         console.error(err);
//     }
// }

// Upload a using csvtojson //

exports.uploadFile = async (req, res) => {
    try {
        const data = req.file;
        console.log(data); // Check the file data
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const jsonArray = await csv().fromFile(req.file.path);
        await UserDemis.insertMany(jsonArray);
        fs.unlinkSync(req.file.path);
        res.status(201).json({ message: 'File uploaded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error(err);
    }
}
