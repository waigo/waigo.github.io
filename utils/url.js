export default {
  trailingSlashIt: function(p) {
    if ('/' !== p.charAt(p.length-1)) {
      p += '/';
    }

    return p;
  }
}
