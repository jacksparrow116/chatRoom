<template>
    <div id="right">
        <h2 class="inline-users">在线用户：{{userNum}}</h2>
        <div class="listWrap">
            <ul>
                <li v-for="item in userList" class="user-item">{{item}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "userList",
        data(){
            return {
                userList: []
            }
        },
        sockets: {
            userMsg: function (data) {
                console.log(data)
                this.userList = data;
            },
            offline(data){
                this.userList = data;
            }
        },
        computed: {
            userNum(){
                return this.userList.length;
            }
        }
    }
</script>

<style scoped>
    #right{
        float: left;
        width: 190px;
        height: 600px;
        margin-left: 5px;
        border: 1px solid #000;
    }
    .inline-users{
        padding-left: 10px;
        font-weight: normal;
        font-size: 20px;
        line-height: 40px;
    }
    .user-item{
        padding-left: 10px;
        line-height: 30px;
    }
    .user-item:hover{
        background-color: #f3f3f3;
    }
</style>
