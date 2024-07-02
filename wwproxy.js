const { default: axios } = require('axios');
var http = require('http');
var url = require('url');
http.createServer(async function (req, res) {
    var key = url.parse(req?.url, true)?.query?.key?.trim();
    console.log('key:'+key);
    if (!key) {
        res.write('Key khong dc de trong');
        return res.end();
    }
    let proxy = await getProxy(key);
    if (proxy) {
        res.write(JSON.stringify(proxy));
    } else {
        res.write('Co loi xay ra check lai key');
    }
    res.end(); 
}).listen(8080); 

async function getProxy(key) {
    try {
        let {data} = await axios({
            url: 'https://wwproxy.com/api/client/proxy/available?key='+key+'&provinceId=-1',
        });
        if (data?.data?.status) {
            console.log('KEY: '+key+' => IP:'+data?.data?.ipAddress);
            return {
                type: 'HTTP',
                ip: data?.data?.ipAddress,
                host: data?.data?.ipAddress,
                port: data?.data?.port
            };
        }
    } catch (e) {
        try {
            let {data} = await axios({
                url: 'https://wwproxy.com/api/client/proxy/current?key='+key,
            });
            if (data?.data?.status) {
                console.log('KEY: '+key+' => IP:'+data?.data?.ipAddress);
                return {
                    type: 'HTTP',
                    ip: data?.data?.ipAddress,
                    host: data?.data?.ipAddress,
                    port: data?.data?.port
                };
            }
        } catch (e) {
            
        }
    }
    return false
}