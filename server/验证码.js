const svgCaptcha = require('svg-captcha')
const getNumber = async () => {
    //返回{svg:验证码svg,key:答案}
  const cap = svgCaptcha.createMathExpr({
    size: 4, // 验证码长度
    width:"100",
    height:"30",
    fontSize: 50,
    ignoreChars: '', // 验证码字符中排除 0o1i
    noise: 3, // 干扰线条的数量
    color: false, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    //background: '#fff' // 验证码图片背景颜色
  })
  let img = cap.data // 验证码
  var text = cap.text.toLowerCase() // 验证码字符，忽略大小写
  return {svg:img,key:text}
}

exports.getNumber=getNumber;

