export function dateAdd(date, interval, units) {
    if(!(date instanceof Date))
      return undefined;
    var ret = new Date(date); //don't change original date
    var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
    switch(String(interval).toLowerCase()) {
      case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
      case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
      case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
      case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
      case 'day'    :  ret.setDate(ret.getDate() + units);  break;
      case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
      case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
      case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
      default       :  ret = undefined;  break;
    }
    return ret;

    // This function is courtesy of @kip on Stack Overflow: https://stackoverflow.com/a/1214753/11151978
}

export function shuffleArray(array) {
    // This method is an implementation of the Fisher - Yates Shuffle algorithm
    let len = array.length
    let temp, i

    while(len) {
        i = Math.floor(Math.random() * len--)
        temp = array[len]
        array[len] = array[i]
        array[i] = temp
    }

    return array
}