
const WebSocket = require('ws');

var map = new Map();
const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', function connection(ws,req) {


    const path = req.url; // 获取访问路径

    if (path !== '/65465465'){
        console.log('非法访问');
        ws.terminate();
    }


    let pathList = map.get(path);

    if (pathList== null || pathList.length===0){
        pathList = []
    }
    pathList.push(ws);

    map.set(path, pathList);
    console.log(`连接建立，访问路径为:${path}连接数量为${ pathList.length}`);



    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        pathList.forEach(item => {
            if (item !== ws){
                item.send(message.toString());
            }
        });


    });


    ws.on('close', function close() {

        let pathList = map.get(path);
        pathList.splice(ws);
        console.log(`连接关闭，访问路径为:${path}连接数量为${ pathList.length}`);
    });

});




console.log('WebSocket server is running on ws://localhost:8080');
