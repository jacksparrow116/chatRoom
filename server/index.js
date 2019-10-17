

const Koa = require('koa');

const app = new Koa();

const server = require('http').Server(app.callback());
const io = require('socket.io')(server);

// let userNum = 0; // 用户在线人数
let userList = []; // 用户列表

io.on('connection', socket => { // socket 当前用户对象
    console.log('初始化成功！下面可以用socket绑定事件和触发事件了');

    socket.on('userConnect', data=>{
        for (let item of userList) {
            if( data == item ){
                socket.emit('res', false);
                return;
            }
        }
        socket.emit('res', true);

        socket.name = data
        console.log(socket.name + '连接了');
        // userNum ++;
        userList.push(data)
        io.emit('userMsg', userList);
    })

    socket.on('send', data => {
        console.log('客户端发送的内容：', data);
        socket.emit('getMsg', '我是socket返回的消息');
        socket.broadcast.emit('users', data);
    });
    socket.on('disconnect', ()=>{
        console.log('用户断开连接');
        // userNum --;
        let index = userList.indexOf(socket.name);
        userList.splice(index,1);
        socket.broadcast.emit('offline', userList)
        console.log(socket.name + '下线了');
    })
})

server.listen(3000, ()=>{
    console.log('成功在3000端口监听');
});












