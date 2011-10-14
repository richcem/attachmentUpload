# 专用附件上传插件

## How to use

- 简单使用

------
    <script type="java/javascript" src="src/oray.attachmentUpload.source.js"></script>  
    <script type="java/javascript">
        jQuery(function(){
            $('#form').attachmentUpload({
                // 上传地址
                url: "xxxxx",
                // 跨域支持
                domain: "xxxx.com",
                // interface 
                ICommon: XXX.Common
            });
        });
    </script>
