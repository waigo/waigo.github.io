const _ = require('lodash');

export default {
  flatten: function(navMenu) {
    return _.flatMap(navMenu.children, (info, id) => {
      return [{
        label: info.label,
        url: info.url,
        repoPath: info.repoPath,
      }].concat(_.map(info.children || [], v => {
        return {
          label: `${info.label}: ${v.label}`,
          url: v.url,
          repoPath: v.repoPath,
        }
      }));
    });
  }
}