import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types';
import axios from 'axios';

export const getItems = () => async dispatch => {
  dispatch(setItemsLoading());

  const response = await axios.get('/api/items');
  dispatch({
    type: GET_ITEMS,
    payload: response.data
  })
}

export const addItem = item => async dispatch => {
  const response = await axios.post('/api/items', item);

  dispatch({
    type: ADD_ITEM,
    payload: response.data
  });
}

export const deleteItem = id => async dispatch => {
  await axios.delete(`/api/items/${id}`);

  dispatch({
    type: DELETE_ITEM,
    payload: id
  });
}

export const setItemsLoading = () => {
  return {
    type: ITEMS_LOADING
  }
}