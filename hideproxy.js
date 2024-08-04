const express = require('express');
const app = express();
var cors = require('cors');
const xlsx = require('xlsx');

app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

app.get('/hideproxy', async (req, res) => {
    try {
        console.log(req.query);
        let profile_uuid = req.query?.profile_uuid;
        if (!profile_uuid) {
            return res.json({message: 'ko co uuid'})
        }
        //tim thong tin proxy trong file exel có thể tích hợp thêm đoạn check bằng axios
        let data = getProxyByUuid(profile_uuid);
        if (data) {
            //trả về kết quả 
            return res.json({
                type: data[0],
                ip: data[1],
                host: data[1],
                port:  data[2],
                username:  data[3],
                password:  data[4],
                profile_uuid:  profile_uuid,
                full:  data.join('|')
            });
        }
        //đoạn này trả về nếu đéo tìm thấy
        return res.json({message: 'Ko tim thay proxy'}) 
    } catch(e) {
        return res.json({message: e.message})
    }
})

let server = app.listen(1000, function () {
    console.log('http://localhost:1000/hideproxy');
})
server.setTimeout(10000)

function getProxyByUuid(uuid){
    // Đọc file Excel
    const workbook = xlsx.readFile('proxys.xlsx');
    // Lấy sheet đầu tiên
    const sheet = workbook.Sheets['Sheet1'];
    // Lấy dữ liệu từ sheet
    const data = xlsx.utils.sheet_to_json(sheet);
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        // So sánh dữ liệu trong hàng hiện tại với cột A
        if (row['UUID'] == uuid) {
            return [...row['PROXY'].split('|')];
        }
    }
    return false;
}
