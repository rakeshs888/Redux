import React from 'react';
import ReactDOM from 'react-dom'
import Redux , { createStore} from 'redux';
import {combineReducers} from 'redux';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      );
    default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);



const FilterLink = ({
  filter,
  currentFilter,
  children,
  onClick
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }

  return (
    <a href='#'
       onClick={e => {
         e.preventDefault();
         onClick(filter);
       }}
    >
      {children}
    </a>
  );
};

const Footer = ({
  visibilityFilter,
  onFilterClick
}) => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      All
    </FilterLink>
    {', '}
    <FilterLink
      filter='SHOW_ACTIVE'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      Active
    </FilterLink>
    {', '}
    <FilterLink
      filter='SHOW_COMPLETED'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      Completed
    </FilterLink>
  </p>
);

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ?
          'line-through' :
          'none'
    }}
  >
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

const AddTodo = ({
  onAddClick
}) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        onAddClick(input.value);
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

let nextTodoId = 0;
const TodoApp = ({
  todos,
  visibilityFilter
}) => (
  <div>
    <AddTodo
      onAddClick={text =>
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text
        })
      }
    />
    <TodoList
      todos={
        getVisibleTodos(
          todos,
          visibilityFilter
        )
      }
      onTodoClick={id =>
        store.dispatch({
          type: 'TOGGLE_TODO',
          id
        })
      }
    />
    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={filter =>
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
      }
    />
  </div>
);

const render = () => {
  ReactDOM.render(
    <TodoApp
      {...store.getState()}
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();



// /*
//  * Open the console
//  * to see the state log.
//  */

// const todo = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return {
//         id: action.id,
//         text: action.text,
//         completed: false
//       };
//     case 'TOGGLE_TODO':
//       if (state.id !== action.id) {
//         return state;
//       }

//       return {
//         ...state,
//         completed: !state.completed
//       };
//     default:
//       return state;
//   }
// };

// const todos = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return [
//         ...state,
//         todo(undefined, action)
//       ];
//     case 'TOGGLE_TODO':
//       return state.map(t => todo(t, action));
//     default:
//       return state;
//   }
// };

// const visibilityFilter = (
//   state = 'SHOW_ALL',
//   action
// ) => {
//   switch (action.type) {
//     case 'SET_VISIBILITY_FILTER':
//       return action.filter;
//     default:
//       return state;
//   }
// };

// const combineReducers = (reducers) => {
//   return (state = {}, action) => {
//     return Object.keys(reducers).reduce(
//       (nextState, key) => {
//         nextState[key] = reducers[key](
//           state[key],
//           action
//         );
//         return nextState;
//       },
//       {}
//     );
//   };
// };
// const todoApp=combineReducers({
//   todos, visibilityFilter
// });

// // const todoApp = (state = {}, action) => {
// //   return {
// //     todos: todos(
// //       state.todos,
// //       action
// //     ),
// //     visibilityFilter: visibilityFilter(
// //       state.visibilityFilter,
// //       action
// //     )
// //   };
// // };


// const store = createStore(todoApp);

// console.log('Initial state:');
// console.log(store.getState());
// console.log('--------------');

// console.log('Dispatching ADD_TODO.');
// store.dispatch({
//   type: 'ADD_TODO',
//   id: 0,
//   text: 'Learn Redux'
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('--------------');

// console.log('Dispatching ADD_TODO.');
// store.dispatch({
//   type: 'ADD_TODO',
//   id: 1,
//   text: 'Go shopping'
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('--------------');

// console.log('Dispatching TOGGLE_TODO.');
// store.dispatch({
//   type: 'TOGGLE_TODO',
//   id: 0
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('--------------');

// console.log('Dispatching SET_VISIBILITY_FILTER');
// store.dispatch({
//   type: 'SET_VISIBILITY_FILTER',
//   filter: 'SHOW_COMPLETED'
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('--------------');



// const todo = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return {
//         id: action.id,
//         text: action.text,
//         completed: false
//       };
//     case 'TOGGLE_TODO':
//       if (state.id !== action.id) {
//         return state;
//       }

//       return {
//         ...state,
//         completed: !state.completed
//       };
//     default:
//       return state;
//   }
// };

// const todos = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return [
//         ...state,
//         todo(undefined, action)
//       ];
//     case 'TOGGLE_TODO':
//       return state.map(t => todo(t, action));
//     default:
//       return state;
//   }
// };

// const testAddTodo = () => {
//   const stateBefore = [];
//   const action = {
//     type: 'ADD_TODO',
//     id: 0,
//     text: 'Learn Redux'
//   };
//   const stateAfter = [
//     {
//       id: 0,
//       text: 'Learn Redux',
//       completed: false
//     }
//   ];
  
//   deepFreeze(stateBefore);
//   deepFreeze(action);
  
//   expect(
//     todos(stateBefore, action)
//   ).toEqual(stateAfter);
// };

// const testToggleTodo = () => {
//   const stateBefore = [
//     {
//       id: 0,
//       text: 'Learn Redux',
//       completed: false
//     },
//     {
//       id: 1,
//       text: 'Go shopping',
//       completed: false
//     }
//   ];
//   const action = {
//     type: 'TOGGLE_TODO',
//     id: 1
//   };
//   const stateAfter = [
//     {
//       id: 0,
//       text: 'Learn Redux',
//       completed: false
//     },
//     {
//       id: 1,
//       text: 'Go shopping',
//       completed: true
//     }
//   ];
  
//   deepFreeze(stateBefore);
//   deepFreeze(action);
  
//   expect(
//     todos(stateBefore, action)
//   ).toEqual(stateAfter);
// };


// testAddTodo();
// testToggleTodo();
// console.log('All tests passed.');



// /*
//  * Open the console
//  * to see that the tests pass.
//  */

// const todos = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return [
//         ...state,
//         {
//           id: action.id,
//           text: action.text,
//           completed: false
//         }
//       ];
//     default:
//       return state;
//   }
// };

// const testAddTodo = () => {
//   const stateBefore = [];
//   const action = {
//     type: 'ADD_TODO',
//     id: 0,
//     text: 'Learn Redux'
//   };
//   const stateAfter = [
//     {
//       id: 0,
//       text: 'Learn Redux',
//       completed: false
//     }
//   ];
  
//   deepFreeze(stateBefore);
//   deepFreeze(action);
  
//   expect(
//     todos(stateBefore, action)
//   ).toEqual(stateAfter);
// };

// testAddTodo();
// console.log('All tests passed.');


// const toggleTodo = (todo) => {
//   return {
//     ...todo,
//     completed: !todo.completed
//   };
// };

// const testToggleTodo = () => {
//   const todoBefore = {
//     id: 0,
//     text: 'Learn Redux',
//     completed: false
//   };
//   const todoAfter = {
//     id: 0,
//     text: 'Learn Redux',
//     completed: true
//   };
  
//   deepFreeze(todoBefore);
  
//   expect(
//     toggleTodo(todoBefore)
//   ).toEqual(todoAfter);
// };

// testToggleTodo();
// console.log('All tests passed.');




// const addCounter = (list) => {
//   return [...list, 0];
// };

// const removeCounter = (list, index) => {
//   return [
//     ...list.slice(0, index),
//     ...list.slice(index + 1)
//   ];
// };

// const incrementCounter = (list, index) => {
//   return [
//     ...list.slice(0, index),
//     list[index] + 1,
//     ...list.slice(index + 1)
//   ];
// };

// const testAddCounter = () => {
//   const listBefore = [];
//   const listAfter = [0];
  
//   deepFreeze(listBefore);
  
//   expect(
//     addCounter(listBefore)
//   ).toEqual(listAfter);
// };

// const testRemoveCounter = () => {
//   const listBefore = [0, 10, 20];
//   const listAfter = [0, 20];
  
//   deepFreeze(listBefore);
  
//   expect(
//     removeCounter(listBefore, 1)
//   ).toEqual(listAfter);
// };

// const testIncrementCounter = () => {
//   const listBefore = [0, 10, 20];
//   const listAfter = [0, 11, 20];
  
//   deepFreeze(listBefore);
  
//   expect(
//     incrementCounter(listBefore, 1)
//   ).toEqual(listAfter);
// };

// testAddCounter();
// testRemoveCounter();
// testIncrementCounter();

// console.log('All tests passed.');





// const counter = (state = 0, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return state + 1;
//     case 'DECREMENT':
//       return state - 1;
//     default: 
//       return state;
//   }
// }

// const Counter = ({
//   value,
//   onIncrement,
//   onDecrement
// }) => (
//   <div>
//     <h1>{value}</h1>
//     <button onClick={onIncrement}>+</button>
//     <button onClick={onDecrement}>-</button>
//   </div>


// );

// // const { createStore } = Redux;
// const store = createStore(counter);

// const render = () => {
//   ReactDOM.render(
//     <Counter
//       value={store.getState()}
//       onIncrement={() =>
//         store.dispatch({
//           type: 'INCREMENT'           
//         })            
//       }
//       onDecrement={() =>
//         store.dispatch({
//           type: 'DECREMENT'           
//         })            
//       }
//     />,
//     document.getElementById('root')
//   );
// };

// store.subscribe(render);
// render();





// const counter = (state = 0, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return state + 1;
//     case 'DECREMENT':
//       return state - 1;
//     default: 
//       return state;
//   }
// }

// const createStore = (reducer) => {
//   let state;
//   let listeners = [];
  
//   const getState = () => state;
  
//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach(listener => listener());
//   };
  
//   const subscribe = (listener) => {
//     listeners.push(listener);
//     return () => {
//       listeners = listeners.filter(l => l !== listener);
//     };
//   };
  
//   dispatch({});
  
//   return { getState, dispatch, subscribe };
// };

// const store = createStore(counter);

// const render = () => {
//   document.body.innerText = store.getState();
// };

// store.subscribe(render);
// render();

// document.addEventListener('click', () => {
//   store.dispatch({ type: 'INCREMENT' });
// });


// const todo = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return {
//         id: action.id,
//         text: action.text,
//         completed: false
//       };
//     case 'TOGGLE_TODO':
//       if (state.id !== action.id) {
//         return state;
//       }

//       return {
//         ...state,
//         completed: !state.completed
//       };
//     default:
//       return state;
//   }
// };

// const todos = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return [
//         ...state,
//         todo(undefined, action)
//       ];
//     case 'TOGGLE_TODO':
//       return state.map(t =>
//         todo(t, action)
//       );
//     default:
//       return state;
//   }
// };

// const visibilityFilter = (
//   state = 'SHOW_ALL',
//   action
// ) => {
//   switch (action.type) {
//     case 'SET_VISIBILITY_FILTER':
//       return action.filter;
//     default:
//       return state;
//   }
// };

// //const { combineReducers } = Redux;
// const todoApp = combineReducers({
//   todos,
//   visibilityFilter
// });

// //const { createStore } = Redux;
// const store = createStore(todoApp);

// const { Component } = React;

// let nextTodoId = 0;
// class TodoApp extends Component {
//   render() {
//     return (
//       <div>
//         <input ref={node => {
//           this.input = node;
//         }} />
//         <button onClick={() => {
//           store.dispatch({
//             type: 'ADD_TODO',
//             text: this.input.value,
//             id: nextTodoId++
//           });
//           this.input.value = '';
//         }}>
//           Add Todo
//         </button>
//         <ul>
//           {this.props.todos.map(todo =>
//             <li key={todo.id}>
//               {todo.text}
//             </li>
//           )}
//         </ul>
//       </div>
//     );
//   }
// }

// const render = () => {
//   ReactDOM.render(
//     <TodoApp
//       todos={store.getState().todos}
//     />,
//     document.getElementById('root')
//   );
// };

// store.subscribe(render);
// render();






// const counter = (state = 0, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return state + 1;
//     case 'DECREMENT':
//       return state - 1;
//     default:
//       return state;
//   }
// } 

// //const { createStore } = Redux;
// const stores = createStore(counter);

// const render1 = () => {
//   document.body.innerText = stores.getState();
// };

// stores.subscribe(render1);
// render1();

// document.addEventListener('click', () => {
//   stores.dispatch({ type: 'INCREMENT' });
// });