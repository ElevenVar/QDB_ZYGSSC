function checkPhoneVal(val, that) {
    let flag = false;
    if (val === '') {
        that.$message({
            message: "请输入手机号",
            type: "warning"
        });
        flag = false;
    } else {
        const phoneReg = /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i; // 手机号正则表达式
        if (!phoneReg.test(val)) {
            that.$notify({
                type: "error",
                message: "请输入有效手机号码",
                customClass: "dgg-tip-msg"
            });
            /* that.$message({
                message: "请输入有效手机号码",
                type: "warning"
            }); */
            flag = false;
        } else {
            flag = true;
        }
    }
    return flag;
}

export default {
    checkPhoneVal
}