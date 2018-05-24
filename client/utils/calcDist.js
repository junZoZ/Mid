//code get by:https://blog.csdn.net/qq_33417035/article/details/78028461

function calcRad(degree) {
  var PI = Math.PI;
  return degree * PI / 180.0;
}

/**
 * 获取两个经纬度之间的距离
 * @param lat1 第一点的纬度
 * @param lng1 第一点的经度
 * @param lat2 第二点的纬度
 * @param lng2 第二点的经度
 * @returns {Number}
 */

function calcDistance(lat1, lng1, lat2, lng2) {
  var f = calcRad((lat1 + lat2) / 2);
  var g = calcRad((lat1 - lat2) / 2);
  var l = calcRad((lng1 - lng2) / 2);
  var sin_g = Math.sin(g);
  var sin_l = Math.sin(l);
  var sin_f = Math.sin(f);
  var s, c, w, r, degree, h1, h2;
  var a = 6378137.0;//地球半径，单位为米
  var fl = 1 / 298.257;
  sin_g = sin_g * sin_g;
  sin_l = sin_l * sin_l;
  sin_f = sin_f * sin_f;
  s = sin_g * (1 - sin_l) + (1 - sin_f) * sin_l;
  c = (1 - sin_g) * (1 - sin_l) + sin_f * sin_l;
  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  degree = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;
  s = degree * (1 + fl * (h1 * sin_f * (1 - sin_g) - h2 * (1 - sin_f) * sin_g));
  s = s / 1000;
  s = s.toFixed(2);//指定小数点后的位数。   
  return s;
}

module.exports={calcDistance}