import { createSlice } from '@reduxjs/toolkit';

// Defining our starting UI state
const initialUIState = { 
    cartIsVisible: false
};

// createSlice prepares a slice of our global state. It takes an object as an argument.
// Every slice requires a "name" property within that object. It
// also requires an initial state (for ours we're just using our already-defined initial
// state). We need reducer functions as well. Each reducer function we define within 
// createSlice automatically recieves the current state. Unlike reducer functions we
// define outside of createSlice, the ones we define here can directly manipulate the 
// current state in order to update it without causing bugs (redux toolkit handles this
// for us).
const uiSlice = createSlice({
    name: 'ui',
    initialState: initialUIState,
    reducers: {
        toggle(state) {
            state.cartIsVisible = !state.cartIsVisible;
        }
    }
});

// Exporting uiSlice.actions here which gives us access to actions that
// automatically trigger our reducer functions we defined using createSlice().
// We want to access these actions in other components so we can update the data
// store using those components.
export const uiActions = uiSlice.actions;

export default uiSlice;