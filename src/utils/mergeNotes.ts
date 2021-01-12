 //
 // * Logic for merging note changes
 // * RULES:
 // *
 //
 // 1. Prev note exist, it is not in new note
 //    - Should delete it?
 //    - Should delete only if author is same?
 //    - If it was synced, it was deleted by someone
 //    - But what if it wasnt synced
 //    - deleted is represented as empty string? should we render that?
 //
 // 2. There is new note
 //    - Just append it and assume correct order

 // 3. There is same note but in different state

 //

import { findIndexById } from '../bloben-package/utils/common';

 /**
  *
  * @param prevBody
  * @param newBody
  */
export const mergeNotes = async (prevBody: any, newBody: any) => {
    return new Promise(async (resolve: any) => {
        const prevBodyClone: any = [...prevBody];

        console.log('prevBody', prevBody)
        console.log('new body', newBody)

        resolve(newBody)

        for (const [index, item] of newBody.entries()) {
            // Find item in prev body
            const indexOfItemInPrevBody: number = await findIndexById(prevBody, item.id);

            // Add to prevBody
            if (!indexOfItemInPrevBody) {
                prevBodyClone.push(item)
            } else {
                // Check what is newer
                // TODO other options, better rules for choosing, even better some merging should be
                //  applied
                // Just replace it now by server item ...
                prevBodyClone[index] = item;
            }

            if (index + 1 === newBody.length) {
                resolve(prevBodyClone)
            }
        }
    })
}
