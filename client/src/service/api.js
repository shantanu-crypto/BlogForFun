import axios from 'axios';
import { API_NOTIFICATION_MESSAGE,SERVICE_URLS } from '../constants/config';

import { getAccessToken,getType } from '../utils/common-utils';

const API_URL='http://localhost:8000';

const axiosInstance=axios.create({
    baseURL:API_URL,
    timeout:10000,
    headers:{
        "Accept": "application/json, form-data", 
        "Content-Type":"application/json"
    }
})

axiosInstance.interceptors.request.use(
    function(config){
        if(config.TYPE.params){
            config.params=config.TYPE.params;
        }else if(config.TYPE.query){
            config.url=config.url+'/'+config.TYPE.query;
        }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    function(response){
        //stop loader here
        return processResponse(response);
    },
    function(error){
        return Promise.reject(processError(error));
    }
)

// If success -> return {isSucess:true,data:object}
//if fail-> return{isFaliure:true,status:string,msg:string,code:int}
const processResponse=(response)=>{
    if(response?.status===200){
        return {isSuccess:true,data:response.data}
    }else{
        return {
            isFaliure:true,
            status:response?.status,
            msg:response?.msg,
            code:response?.code
        }
    }
}

const processError=(error)=>{
    if(error.response){
        //request made and server responded with a status other
        //that falls out of the range 2.x.x
        console.log("Error In Response:", error.toJSON());
        return {
            isError:true,
            msg:API_NOTIFICATION_MESSAGE.responseFailure,
            code:error.response.status
        }
    }else if(error.request){
        // request made but no response was received
        console.log("Error In Request:", error.toJSON());
        return {
            isError:true,
            msg:API_NOTIFICATION_MESSAGE.requestFailure,
            code:""
        }
    }else{
        // something hanppend in setting up
        console.log("Error In Network:", error.toJSON());
        return {
            isError:true,
            msg:API_NOTIFICATION_MESSAGE.networkError,
            code:""
        }
    }
}

const API={};

for (const [key,value] of Object.entries(SERVICE_URLS)){
    API[key]=(body,showUploadProgress,showDownloadProgress)=>
        axiosInstance({
            method:value.method,
            url:value.url,
            data:value.method === 'DELETE' ? {} : body,
            responseType:value.responseType,
            headers:{
                authorization:getAccessToken()
            },
            TYPE: getType(value,body),
            onUploadProgress:function(progressEvent){
                if(showUploadProgress){
                    let percentageCompleted=Math.round((progressEvent.loaded*100)/progressEvent.total);
                    showUploadProgress(percentageCompleted);
                }
            },
            onDownloadProgress:function(progressEvent){
                if(showDownloadProgress){
                    let percentageCompleted=Math.round((progressEvent.loaded*100)/progressEvent.total);
                    showDownloadProgress(percentageCompleted);
                }
            }
        })
}

export {API};