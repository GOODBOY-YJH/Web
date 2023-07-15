<template>
    <el-footer>
        <div class="footer">
            <div class="left">
                <!-- <img src="../assets/image/ahut_cs.jpg" alt="Logo" /> -->
                <p>©2023 安徽工业大学xxxxxxxxx备案号xxxxxxxx.</p>
            </div>
            <div class="right">
                <p>联系我们</p>
                <p>隐私政策</p>
                <p>使用条款</p>
            </div>
        </div>
    </el-footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>
  
<style lang="less" scoped>
.footer {
    background: rgb(247, 251, 253);
    padding: 30px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .left {
        display: flex;
        align-items: center;

        img {
            width: 50px;
            margin-right: 10px;
        }

        p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }

    }

    .right {
        display: flex;

        p {
            margin: 0;
            margin-right: 30px;
            font-size: 14px;
            color: #666;
            cursor: pointer;
        }

        p:hover {
            color: #333;
        }
    }
}
</style>
  