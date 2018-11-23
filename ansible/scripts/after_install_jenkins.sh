TOKEN="45ef1643835470b4561d6b3597f6f256b7c9a47e032d7e2ca19f079e01c7a211"
PROJECT=$DEPLOYMENT_GROUP_NAME
SERVICE="nginx"


if [ "${HOSTNAME}" == "pro-jump-server" ]
then
    cd /etc/tencent_cdn/${PROJECT}
    coscmd upload /data/mobi-tx-detail/dist/ /segwit -rs  
    coscmd upload /data/mobi-tx-detail/dist/ /txDetail -rs
    aws s3 cp /data/mobi-tx-detail/dist/ s3://mobiwebstatic/txDetail/ --recursive
    aws s3 cp /data/mobi-tx-detail/dist/ s3://mobiwebstatic/segwit/ --recursive
fi


function dingbot()
{
    (($?==0))&&S="successfully"||S="unsuccessfully"

    curl -XPOST https://oapi.dingtalk.com/robot/send\?access_token\=$TOKEN \
        -H "Content-Type: application/json" \
        -d "{
                'msgtype': 'markdown',
                'markdown': {
                    'title': '$PROJECT deployed $S',
                    'text': '### **$PROJECT** deployed $S\n\n> **$PROJECT** deployed to *${HOSTNAME}* **$S**\n\n> restart services is **${SERVICE}**\n'
                }
            }"
}
nginx -t
dingbot
if [[ "successfully" =~ $S ]];then
    service nginx restart
fi
