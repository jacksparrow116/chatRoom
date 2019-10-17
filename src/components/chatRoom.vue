<template>
    <div class="main">
<!--        <div>在线人数：{{userNum}}</div>-->
        <div id="left" ref="left">
            <div id="wrap" ref="wrap" @mousewheel="mouseWheel">
                <ul class="list" ref="scroll" :style="{top:top+'px'}">
                    <li v-for="item in chat" class="item-msg">
                        <span v-text="item.date" class="time"></span>
                        <div class="msg-con" :class="{selfCon:item.self}">
                            <span class="name" :class="{selfName:item.self}" v-text="item.userName"></span>
                            <p class="msg">{{item.msg}}</p>
                        </div>
                    </li>
                </ul>
                <div class="scroll-bar">
                    <span class="bar"></span>
                </div>
            </div>
            <div class="input" ref="input">
                <textarea name="" id="input_txt" v-model="msg"></textarea>
                <button class="btn" ref="btn" @click="clickButton">发送</button>
            </div>
        </div>
        <userList></userList>
<!--        <div class="right">-->
<!--            <div class="listWrap">-->
<!--                <ul>-->
<!--                    <li v-for="item in userList">{{item}}</li>-->
<!--                </ul>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>
    import userList from './userList'
    export default {
        name: 'chatRoom',
        data() {
            return {
                userName: '',
                msg: '',
                chat: [], // 聊天信息列表
                wrapH: 0, // scroll区域高度
                addH: 0, // 新添加的文本高度
                contentH: 0, // 显示区高度
                top: 0, // scroll区域定位
                distance: 40 // scroll一次滚动的距离
            }
        },
        components: {
            userList
        },
        created(){
            console.log('created');
        },
        sockets: {
            connect: function (data) {
                console.log(data);
            },
            // getMsg: function (data) {
            //     // 此方法由socket服务器触发  eg: io.emit("getMsg", data)
            //     console.log('socket发送的数据：' + data);
            // },
            users(data){
                console.log('users:'+data);
                data.self = false;
                this.chat.push(data)

                this.wrapH += data.addH;
                console.log('收到的addh：'+data.addH);
            },
        },
        methods: {
            clickButton() {
                if( this.msg == '' || this.msg == '\n' ) return;
                let data = {},
                    date = new Date(),
                    h = date.getHours(),
                    m = date.getMinutes(),
                    s = date.getSeconds();
                data.msg = this.msg;
                data.self = true;
                data.date = `${h}:${m}:${s}`;
                data.userName = this.userName;

                this.chat.push(data);

                // wrap高度
                this.$nextTick(()=>{
                    // 发送消息时添加的高度
                    this.addH = this.$refs.scroll.offsetHeight - this.wrapH;
                    console.log('点击时addh：'+this.addH);
                    // 本身的高度
                    this.wrapH = this.$refs.scroll.offsetHeight;
                    // console.log('wrap高度：'+this.wrapH);
                    data.addH = this.addH;
                    // $socket is socket.io-client instance
                    this.$socket.emit('send', data);
                })

                this.msg = '';
                this.$refs.input.focus();

            },
            mouseWheel(e){
                // console.log('滚动了');
                let bottom = -(this.wrapH-this.contentH+40);
                if( e.wheelDelta > 0 && this.top < 0 ){
                    // console.log('上');
                    this.top += this.distance;
                    if( this.top > 0 )this.top = 0;
                }else if( e.wheelDelta < 0 && this.top > bottom ){
                    // console.log('下');
                    this.top -= this.distance;
                    // this.$refs.scroll.style.top = this.top+'px';
                    if( this.top < bottom )this.top = bottom;
                }

            }
        },
        mounted(){
            console.log('现在mounted');
            // this.$socket.emit('userConnect', '我连接了')

            this.contentH = this.$refs.left.offsetHeight - this.$refs.input.offsetHeight;
            // console.log(this.contentH);
            document.addEventListener('keyup', (e)=>{ // 不在button上绑定@keyup.enter是因为要获取焦点才能触发
                if( e.keyCode === 13 ){
                    this.clickButton();
                }
            })
            this.wrapH = this.$refs.scroll.offsetHeight;
            console.log('mounted wrapH：'+this.wrapH);

            this.userName = this.$store.getters.userName;
        },
        watch: {
            wrapH(val, oldVal){
                console.log(val);
                console.log(oldVal);
                console.log('高度改变了！');
                if( val > this.contentH ){
                    console.log('高度超出了');
                    this.top = -(val-this.contentH + 40)
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main{
        overflow: hidden;
        width: 710px;
        margin: 50px auto 0;
        padding: 10px;
        border: 1px solid #000;
    }
    #left{
        overflow: hidden;
        position: relative;
        float: left;
        width: 510px;
        height: 600px;
        border: 1px solid #000;
    }
    .input{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 150px;
        outline: 1px solid #000;
    }
    #input_txt{
        width: 100%;
        height: 100%;
        padding: 5px;
        border: none;
        font-size: 16px;
        line-height: 22px;
        box-sizing: border-box;
        resize:none;
    }
    .btn{
        position: absolute;
        bottom: 5px;
        right: 5px;
        padding: 4px 12px;
        background-color: #fff;
        border: none;
    }
    .btn:hover{
        cursor: pointer;
    }
    .item-msg{
        /*position: relative;*/
        margin-top: 20px;
    }
    .item-msg::after{
        content: '';
        display: block;
        clear: both;
    }
    .time{
        display: block;
        margin-bottom: 5px;
        font-size: 12px;
        text-align: center;
        color: #8b8b8b;
    }
    #wrap{
        height: 450px;
    }
    .list{
        position: relative;
        padding: 20px 0 0;
    }
    .msg-con{
        float: left;
        max-width: 70%;
    }
    .selfCon{
        float: right;
        text-align: right;
    }
    .msg-con .name{
        padding-left: 5px;
        font-size: 12px;
        color: #707070;
    }
    .msg-con .msg{
        margin-top: 2px;
        padding: 7px 12px;
        background-color: #ccffee;
        border-radius: 10px;
        font-size: 14px;
        word-wrap: break-word; /* 字母数字自动换行 */
    }
    .selfCon>.msg{
        background-color: #fff3c6;
        text-align: left;
    }
    .selfCon>.name{
        padding-right: 5px;
    }
</style>
