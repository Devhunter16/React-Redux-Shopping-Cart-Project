import { createSlice } from '@reduxjs/toolkit';

// Defining our starting cart state
const initialCartState = {
    items: [],
    totalQuantity: 0,
};

// createSlice prepares a slice of our global state. It takes an object as an argument.
// Every slice requires a "name" property within that object. It
// also requires an initial state (for ours we're just using our already-defined initial
// state). We need reducer functions as well. Each reducer function we define within 
// createSlice automatically recieves the current state. Unlike reducer functions we
// define outside of createSlice, the ones we define here can directly manipulate the 
// current state in order to update it without causing bugs (redux toolkit handles this
// for us).
const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        addItemToCart(state, action) {
            // Payload is whatever value we're going to be passing to this function when we
            // use it in another file. "Payload" is from redux-toolkit, it is essentially
            // any extra data you added to the action.
            const newItem = action.payload;
            // We're checking whether or not the item exists within the "items" array already
            // and if it does we increase the quantity of that existing item rather than
            // creating a new one.
            const existingItem = state.items.find(item => item.id === newItem.id);
            state.totalQuantity++;
            // If we do not find the item within our array, then we add it to the array.
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.title
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            // We're checking whether or not the item exists within the "items" array already
            // and if it does we store that items in the existingItem variable.
            const existingItem = state.items.find(item => item.id === id);
            state.totalQuantity--;
            if (existingItem.quantity === 1) {
                // Filtering our items array by finding the item in the array that's id
                // matches the id we passed into removeItemFromCart, then state.items
                // becomes a new array without that item in it.
                state.items = state.items.filter(item => item.id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }
        }
    }
});

// Exporting cartSlice.actions here which gives us access to actions that
// automatically trigger our reducer functions we defined using createSlice().
// We want to access these actions in other components so we can update the data
// store using those components.
export const cartActions = cartSlice.actions;

export default cartSlice;