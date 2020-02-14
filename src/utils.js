function getEmptyArray(n, m) {
  var table = new Array(n);
  for(var i = 0 ; i < n ; i++) { 
    table[i] = (new Array(m)).fill(0);
  }
  return table;
}

export { getEmptyArray };
