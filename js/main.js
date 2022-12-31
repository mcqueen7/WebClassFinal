const URL="https://script.google.com/macros/s/AKfycbzZeJjCKLOk_W1wr4ZGsr3A2a_BUE_Yo7IAQOWicjdC5w-VuXW4xwWod1GUCp8q5hMITg/exec";
var msgBoxState=0;
$(document).ready(function(){
    init();
    loadData();
});
function init(){
    let scrollTop = $(this).scrollTop();
    let scrollHeight = $(document).height();
    let windowHeight = $(this).height();
    let scrollBottom = scrollHeight - windowHeight - scrollTop;

    $(".btn-send").click(function(e){
         postData();

        $("textarea[name=content]").val("");
    });
    $(".msgswitch").click(function(e){
       if(msgBoxState==0&&scrollBottom>$("footer").height()+$(".messagePart").height()+20){
       
            console.log("OKPRESS");
            msgBoxState=1;
            //alert("OPEN");
            // gsap.to('.messagePart', {
            //     duration: 1,
            //     y: -500,
            // })
            gsap.to('.msg_container', {
                duration: 1,
                y: -$(".messagePart").height()+20
            })
        $(".msgswitchicon").css("transform", "rotateX(180deg)")
        
       }
       else {
        msgBoxState=0;
        //alert("close");
        // gsap.to('.messagePart', {
        //     duration: 1,
        //     y:0,
        // })
        gsap.to('.msg_container', {
            duration: 1,
            y: 0,
        })
        $(".msgswitchicon").css("transform", "rotateX(0deg)")
       }
    });
    $('#sendModal').on('show.bs.modal', function (e) {
        $(this).removeClass('animate__fadeOutDownBig');
        $(this).addClass('animate__zoomInDown');
    });
    $('#sendModal').on('hide.bs.modal', function (e) {
        $(this).removeClass('animate__zoomInDown');
        $(this).addClass('animate__fadeOutDownBig');
    });

    $(window).scroll(function(){
        let wh = currentScrollPercentage();
         $('.progress .progress-bar').css('width', wh+'%');

        scrollTop = $(this).scrollTop();
        scrollHeight = $(document).height();
        windowHeight = $(this).height();
        scrollBottom = scrollHeight - windowHeight - scrollTop;
        if(scrollTop + windowHeight == scrollHeight){
            console.log("已经到最底部了！!");
          }
        if(scrollBottom<=$("footer").height()+$(".messagePart").height()+20) {
            console.log("DANGER！!");
            msgBoxState=0;
          
            gsap.to('.msg_container', {
                duration: 1,
                y: 0,
            })
            $(".msgswitchicon").css("transform", "rotateX(0deg)")
        } 
      });
      function currentScrollPercentage(){
        let scrollPercent = (scrollTop) / (scrollHeight - windowHeight);
        let scrollPercentRounded = Math.round(scrollPercent*100);
        console.log(scrollPercentRounded);
        return scrollPercentRounded;
    }
}

function postData(){
    let modal = new bootstrap.Modal('#sendModal');
    let params={};
//select
    params.method="write";
    params.identity=$("select[name=Identity]").val();
    params.name=$("input[name=Name]").val();
    params.schoolName=$("input[name=schoolName]").val();
    params.imgURL=$("input[name=imgURL]").val();
    params.txtColor=$("input[name=txtColor]").val();
    params.content=$("textarea[name=content]").val();
    if(params.name=="")params.name="匿名";
    if(params.schoolName=="")params.schoolName="匿名學校";
    if(params.imgURL=="")params.imgURL="https://secure.gravatar.com/avatar/12122a41f5e1d5f75d7b0aaf67199e7e?s=300&d=mm&r=g";
    
    console.log(params);
    $.post(URL,params,function(data){
        if(data.result=="sus"){
            modal.show();
            // alert("留言成功")
            loadData();
        }
        else{

        }
    }).fail(function(data){
        alert(data);
    });
}
function loadData(){
    $(".cover").css("display","grid");
    $(".all_article_container").remove();
    $('section').append(`<div class="all_article_container container"></div>`);
    params={};
    params.method="read";
    $.post(URL,params,function(data){
        if(data.result=="sus"){
            let msgData=data.data;
            $(".cover").css("display","none");
            for(let i=0;i<msgData.length-1;i++){
                content=oneMsg(i,msgData[i]);
                $(".all_article_container").append(content);
                $("."+msgData[i].timestamp).css("color",msgData[i].txtColor);
            }
        }
        else {
            $(".cover").css("display","none");
        }
        console.log(data);
    }).fail(function(data){
        $(".cover").css("display","none");
    });
}
function oneMsg(n,msg){
    //let date=new Date();
    // console.log(msg.time);
    let str = msg.content.replace(/(\r\n)|(\n)/g,'<br>')
    let html=` 
  
    <div class="message_box">
      <div class="msg_info d-flex  w-100">  
        <img class="img-fluid rounded-circle userhead border border-dark" src="${msg.imgURL}" alt="user">
        <div class="w-100">
          <div class="mx-2 w-100 pe-2 me-3">
            <text class="msg-name">${msg.name}</text>
            <text class="msg-school">${msg.schoolName}</text>
            <text class="msg-idt ">${msg.identity}</text>
          </div>
          <div class="mx-2">
           <text class="msg-time">${msg.time}</text>
          </div>
        </div>
      </div>
      <div class="msg_content p-2">
          <text class="${msg.timestamp}">${str}</text>
      </div>
    </div>
    `;
    return html;
}