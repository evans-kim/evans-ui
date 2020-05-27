export default (error) => {
    const res = error.response;
    if(!res || !res.data){
        return Promise.reject(error);
    }
    if (res.status === 401 || res.status === 402) {

        window.vm.$message({type:'warning',showClose:true,message:'로그인이 필요합니다.'});

        let redirect = window.vm.$route.fullPath;

        window.vm.$router.push({name: 'loginPage', query:{ redirect: redirect }});
        return Promise.reject(error);
    }
    if (res.status === 404 ) {
        if(res.data.message){
            window.vm.$message({type:'warning', message:res.data.message, showClose:true});
        }
        window.vm.$router.push({name:'NotFoundPage'});
        return Promise.reject(error);
    }

    if (res.status === 403 || res.status === 405) {
        if(!res.data.message){
            window.vm.$message({type:'warning',showClose:true,message:'접근할 수 없는 기능입니다.'});
        }
    }
    if(res.status === 406 ){
        if(!res.data.message){
            window.vm.$message({type:'warning',showClose:true,message:'문제가 지속적일 경우 고객선테로 연락 주시기 바랍니다.'});
        }
    }
    if(res.data.message){
        window.vm.$message({type:'warning', message:res.data.message, showClose:true});
    }
    return Promise.reject(error);
}
