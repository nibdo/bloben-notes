import { format } from 'date-fns';

export const formatDate = (date) => {
  let formatedDate = format(new Date(date), "yyyy-MM-dd HH:mm:ss 'Z'");
  return formatedDate;
};

export const sortData = (data, rule) => {
  let sortedData;
  if (rule === 'created') {
    sortedData = data.sort((a, b) => {
      return parse(a.created) - parse(b.created);
    });
  } else if (rule === 'updated') {
    sortedData = data.sort((a, b) => {
      return parse(a.updated) - parse(b.updated);
    });
  } else if (rule === 'name') {
    sortedData = data.sort((a, b) => {
      let aItem = a.text
        ? a.text.slice(0, 1).toUpperCase()
        : a.list.slice(0, 1).toUpperCase();
      let bItem = b.text
        ? b.text.slice(0, 1).toUpperCase()
        : b.list.slice(0, 1).toUpperCase();
      return aItem.localeCompare(bItem);
    });
  }
  return sortedData;
};
export const sortDataPromise = (data, rule) => {
  return new Promise((resolve) => {
    let sortedData;
    if (rule === 'created') {
      resolve(
        data.sort((a, b) => {
          return parse(b.created) - parse(a.created);
        })
      );
    } else if (rule === 'updated') {
      resolve(
        data.sort((a, b) => {
          return parse(b.updated) - parse(a.updated);
        })
      );
    } else if (rule === 'name') {
      resolve(
        data.sort((a, b) => {
          let aItem = a.text.slice(0, 1).toUpperCase();
          let bItem = b.text.slice(0, 1).toUpperCase();
          return aItem.localeCompare(bItem);
        })
      );
    }
  });
};

export const renderIcon = (icon) => {
  return icon;
};
