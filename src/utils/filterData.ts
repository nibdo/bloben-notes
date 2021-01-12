import { taskType } from '../types/types';
import sortData from './sort-data';

 const Filter: any = {
  findItem: (childId: string, data: any[]): any => {
    for (const item of data) {
      if (item.id === childId) {
        return item;
      }
    }
  },
  findById: (id: string, data: any[]): any => {
    for (const item of data) {
      if (item.id === id) {
        return item;
      }
    }
  },
  filterData: async (listId: string, data: any[]): Promise<any> => {
    const result: any[] = [];

    for (const item of data) {
      if (item.listId === listId) {
        result.push(item);
      }
    }

    return result;
  },
  getParent: (listId: string, data: any[]) => {
    for (const item of data) {
      if (listId === item.id) {
        return item;
      }
    }
  },
  async formatTasks(listId: string, data: any[], sortBy: string): Promise<any> {
    const filteredData: any[] = await this.filterData(listId, data);
    // if (data.length === 0) {
    //   return [];
    // }

    return this.sortTasks(filteredData, sortBy);
  },
  sortTasks: (data: taskType[], sortBy: string): Promise<any[]> => {
    return new Promise((resolve) => {
      if (data.length === 0) {
        resolve(data);
      }
      const favouriteNormalTasks: any[] = [];
      const favouriteCheckedTasks: any[] = [];
      const completedTasks: any[] = [];
      const normalTasks: any[] = [];
      let favouriteNormalSorted;
      let favouriteCheckedSorted;
      let completedSorted;
      let normalSorted;
      let result;
      data.forEach((item, index) => {
        if (item.isFavourite) {
          //On top
          if (item.isCompleted) {
            favouriteCheckedTasks.push(item);
          } else {
            favouriteNormalTasks.push(item);
          }
          if (index + 1 === data.length) {
            favouriteNormalSorted = sortData(favouriteNormalTasks, sortBy);
            favouriteCheckedSorted = sortData(favouriteCheckedTasks, sortBy);
            normalSorted = sortData(normalTasks, sortBy);
            completedSorted = sortData(completedTasks, sortBy);
            result = favouriteNormalSorted
              .concat(normalSorted)
              .concat(favouriteCheckedSorted)
              .concat(completedSorted);
            resolve(result);
          }
        } else {
          if (item.isCompleted) {
            completedTasks.push(item);
            if (index + 1 === data.length) {
              favouriteNormalSorted = sortData(
                favouriteNormalTasks,
                'favourite'
              );
              favouriteCheckedSorted = sortData(
                favouriteCheckedTasks,
                'favourite'
              );
              normalSorted = sortData(normalTasks, sortBy);
              completedSorted = sortData(completedTasks, sortBy);
              result = favouriteNormalSorted
                .concat(normalSorted)
                .concat(favouriteCheckedSorted)
                .concat(completedSorted);
              resolve(result);
            }
          } else {
            normalTasks.push(item);
            if (index + 1 === data.length) {
              favouriteNormalSorted = sortData(
                favouriteNormalTasks,
                'favourite'
              );
              favouriteCheckedSorted = sortData(
                favouriteCheckedTasks,
                'favourite'
              );
              normalSorted = sortData(normalTasks, sortBy);
              completedSorted = sortData(completedTasks, sortBy);
              result = favouriteNormalSorted
                .concat(normalSorted)
                .concat(favouriteCheckedSorted)
                .concat(completedSorted);
              resolve(result);
            }
          }
        }
      });
    });
    // TODO: find better solution
  },
};

 export default Filter;
