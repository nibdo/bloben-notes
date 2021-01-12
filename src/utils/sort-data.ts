
const sortData = (data: any[], rule: string) => {
  // Get type
  const dateType = typeof data[0];

  switch (rule) {
    default:
      return data;
    case 'favourite':
      return data.sort((a: any, b: any) => {
        const aItem: any = a.isFavourite;
        const bItem: any = b.isFavourite;

        return aItem - bItem;
      });
    case 'updatedAt':
      // @ts-ignore
      return data.sort((a: any, b: any) => {
        const aItem: any = a.updatedAt;
        const bItem: any = b.updatedAt;

        return bItem - aItem;
      });
    case 'created':
      // tslint:disable-next-line:radix
      return data.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
    case 'name':
      return data.sort((a: any, b: any) => {
        const aItem: any = a.text.slice(0, 1).toUpperCase();
        const bItem: any = b.text.slice(0, 1).toUpperCase();

        return aItem.localeCompare(bItem);
      });
  }
};

export default sortData;
