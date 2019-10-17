<template>
    <div id="login">
        <div class="login-con">
            <p>Name：<input type="text" v-model="userName" ref="name_input"></p>
            <button @click="start" @keyup.enter="aaa" id="start">开始</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return {
                userName: ''
            }
        },
        methods: {
            start(){
                if( this.userName == '' )return;
                this.$socket.emit('userConnect', this.userName)
            },
            aaa(){
                console.log(123123123123);
            }
        },
        sockets: {
            res(data){
                if( data ){
                    this.$store.dispatch('newName', this.userName);
                    this.userName = '';
                    this.$router.push('chatRoom');
                    console.log('this.$router：'+this.$router);
                    // alert('注册成功');
                }else{
                    alert('用户名已注册！');
                    this.$refs.name_input.focus();
                }
            }
        },
        mounted(){
            document.addEventListener('keyup', (e)=>{
                if( e.keyCode === 13 ){
                    this.start();
                }
            })
        }
    }
</script>

<style scoped>
    #login{
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .login-con{
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 20px 30px;
        background-color: #cffffa;
        border: 1px solid #ccc;
        text-align: center;
        transform: translate(-50%, -50%);
    }
    input[type=text]{
        padding-bottom: 5px;
        background-color: #cffffa;
        border-bottom: 2px solid #000;
        text-indent: 5px;
        font-size: 18px;
    }
    #start{
        margin-top: 10px;
        background-color: rgba(255, 255, 255, 0);
        font-size: 20px;
    }
    #start:hover{
        cursor: pointer;
    }
</style>
