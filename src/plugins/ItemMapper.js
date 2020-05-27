export default{
    props:{
        mapper : null
    },
    methods:{
        getItem(item){

            if(!this.mapper){
                return item;
            }

            Object.keys( this.mapper ).map((key)=>{
                let fieldName = this.mapper[key];

                if(typeof fieldName === 'function'){
                    item[key] = fieldName(item);
                }else{
                    item[key] = item[fieldName];
                }
            });

            return item;
        }
    }
}
