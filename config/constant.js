exports.HTTP_CODE = {
  success: 200,
  not_found: 404,
  fail: 500
}

exports.RES_NORMAL_CODE = 0

exports.RES_EXCEPTION = {
  other: {
    code: -1,
    message: '服务器繁忙'
  },
  not_login: {
    code: -2,
    message: '未登录'
  },
  login_expired: {
    code: -3,
    message: '登录失效'
  },
  login_failed: {
    code: -4,
    message: '账号或密码错误'
  },
  registered: {
    code: -5,
    message: '手机号已注册'
  },
  user_inexist: {
    code: -6,
    message: '用户不存在'
  },
  no_file: {
    code: -7,
    message: '未选择文件'
  },
  unexpected_file: {
    code: -8,
    message: '上传的文件格式错误'
  },
  limit_file_size: {
    code: -9,
    message: '上传的文件过大'
  },
  no_permission: {
    code: -10,
    message: '无权限'
  },
}

exports.UPLOAD_CONFIG = {
  img: {
    file_size: 1024 * 1024 * 10,
    mime_types: ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']
  },
  video: {
    file_size: 1024 * 1024 * 100,
    mime_types: ['video/mp4', 'video/mpeg', 'video/x-msvideo', 'video/webm', 'video/3gpp', 'video/x-m4v', 'video/quicktime']
  },
}