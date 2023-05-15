require('dotenv').config();
const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);
const boardId = process.env.MODAY_BOARD_ID; // support queue board


// find the group by title and return the id
const getGroupId = async (title) => {
    try {
        const query = `query { boards (ids: ${boardId}) { name id groups {title id }  } }`;
        const res = await monday.api(query);
        const groups = res.data.boards[0].groups;
        const group = groups.find(g => g.title === title);
        if (group) {
            console.log(`Group ${title} found  - ${group.id}`);
            return group.id;
        }
        console.log(`Group ${title} not found`);
        return null;
    }catch (e) {
        console.log(e);
        return null;
    }
}

//add item to a group by group id
const addItemToGroup = async (groupId, itemObject) => {
    try {
        const query = `mutation { create_item (board_id: ${boardId}, group_id: ${groupId}, item_name: "${itemObject.name}", column_values: "${JSON.stringify(itemObject.column_values).replace(/"/g, '\\"')}") { id } }`;
        const res = await monday.api(query);
        console.log(res);
        return res;
    }catch (e) {
        console.log(e);
        return null;
    }
}
// get all items of a group by group id
const getItemsByGroupId = async (groupId) => {
    try {
        const query = `query { boards (ids: ${boardId}) {groups (ids: ${groupId}) {items{ id name column_values{id title value}}}}}`;
        const res = await monday.api(query);
        //console.log(res);
        if(res.data.boards[0].groups.length>0)return res.data.boards[0].groups.items;
        return null;
    }catch (e) {
        console.log(e);
        return null;
    }
}

// create an item object
const createItemObject = async (name, reporter_id, channel_id, ts) => {
    return {
        name,
        column_values:{
            text6: reporter_id, // slack reporter id
            text: channel_id, // slack channel id
            text9: ts // slack message timestamp
        }
    }
}

// move an item to a group by group id and column value
const moveItemToGroup = async (groupId, itemId) => {
    try {
        const query = `mutation { move_item_to_group ( group_id: ${groupId}, item_id: ${itemId}) { id } }`;
        const res = await monday.api(query);
        console.log(res);
        return res;
    }catch (e) {
        console.log(e);
        return null;
    }
}

//add Update to item by item id
const addUpdateToItem = async (itemId, update) => {
    try {
        const query = `mutation { create_update (item_id: ${itemId}, body: "${update}") { id } }`;
        const res = await monday.api(query);
        console.log(res);
        return res;
    }catch (e) {
        console.log(e);
        return null;
    }
}

// find item by column value
const getItemByColumnValue = async (columnId, value) => {
    try {
        const query = `query {items_by_column_values ( board_id: ${boardId},column_id: \"${columnId}\", column_value: \"${value}\") {id name column_values{id title value}}}`;
        const res = await monday.api(query);
        console.log(res.data);
        return res.data;
    }catch (e) {
        console.log(e);
        return null;
    }

}

module.exports = {createItemObject, getGroupId, addItemToGroup, getItemsByGroupId, addUpdateToItem,moveItemToGroup,getItemByColumnValue};
//getItemsByGroupId("topics");
//getItemByColumnValue('text9','1684058589.970999')
//moveItemToGroup('topics', '1194469307');